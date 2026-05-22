"use client";

import { Download, Menu, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

type Note = {
  id: string;
  content: string;
  tags: string[];
  createdAt: string;
};

type GistConfig = {
  token?: string;
  gistId?: string;
};

type NotesPanelProps = {
  open: boolean;
  onClose: () => void;
};

const STORAGE_KEY = "sell-out-notes";
const CONFIG_KEY = "sell-out-gist-config";
const GIST_FILENAME = "sell-out-notes.json";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTags(value: string) {
  return value
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function NotesPanel({ open, onClose }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>(() => readJson<Note[]>(STORAGE_KEY, []));
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [query, setQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [token, setToken] = useState(() => readJson<GistConfig>(CONFIG_KEY, {}).token || "");
  const [gistId, setGistId] = useState(() => readJson<GistConfig>(CONFIG_KEY, {}).gistId || "");
  const [status, setStatus] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const onAddNote = (event: Event) => {
      const detail = (event as CustomEvent<{ content?: string; tags?: string[] }>).detail;
      if (!detail?.content?.trim()) return;
      persist([
        {
          id: makeId(),
          content: detail.content.trim(),
          tags: Array.isArray(detail.tags) ? detail.tags : [],
          createdAt: new Date().toISOString(),
        },
        ...notes,
      ]);
      setStatus("AI 问答已写入本地笔记，可用 Gist 同步。");
    };
    window.addEventListener("sell-out-add-note", onAddNote);
    return () => window.removeEventListener("sell-out-add-note", onAddNote);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return notes;
    return notes.filter((note) => {
      const text = `${note.content} ${note.tags.join(" ")}`.toLowerCase();
      return text.includes(normalized);
    });
  }, [notes, query]);

  function persist(nextNotes: Note[]) {
    const sorted = [...nextNotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setNotes(sorted);
    saveJson(STORAGE_KEY, sorted);
  }

  function addNote() {
    if (!content.trim()) return;
    persist([
      {
        id: makeId(),
        content: content.trim(),
        tags: normalizeTags(tags),
        createdAt: new Date().toISOString(),
      },
      ...notes,
    ]);
    setContent("");
    setTags("");
    setStatus("笔记已保存在本地。");
  }

  function deleteNote(id: string) {
    persist(notes.filter((note) => note.id !== id));
    setStatus("已删除笔记。");
  }

  function saveConfig(nextGistId = gistId) {
    saveJson(CONFIG_KEY, { token: token.trim(), gistId: nextGistId.trim() });
    setGistId(nextGistId.trim());
  }

  async function requestGist(path: string, init: RequestInit = {}) {
    const cleanToken = token.trim();
    if (!cleanToken) throw new Error("请先填写 GitHub Token。");
    const res = await fetch(`https://api.github.com${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });
    if (!res.ok) {
      const message = await res.text();
      throw new Error(`GitHub 请求失败 ${res.status}: ${message.slice(0, 160)}`);
    }
    return res.json();
  }

  async function findExistingGist() {
    const gists = (await requestGist("/gists?per_page=100")) as Array<{
      id: string;
      files?: Record<string, unknown>;
    }>;
    return gists.find((gist) => gist.files && Object.prototype.hasOwnProperty.call(gist.files, GIST_FILENAME));
  }

  async function syncNotes() {
    setSyncing(true);
    setStatus("正在同步 GitHub Gist...");
    try {
      let targetGistId = gistId.trim();
      if (!targetGistId) {
        const existing = await findExistingGist();
        targetGistId = existing?.id || "";
      }

      if (!targetGistId) {
        const created = (await requestGist("/gists", {
          method: "POST",
          body: JSON.stringify({
            description: "sell-out notes",
            public: false,
            files: {
              [GIST_FILENAME]: {
                content: JSON.stringify(notes, null, 2),
              },
            },
          }),
        })) as { id: string };
        saveConfig(created.id);
        setStatus("已创建私有 Gist 并完成同步。");
        return;
      }

      const remote = (await requestGist(`/gists/${targetGistId}`)) as {
        files?: Record<string, { content?: string }>;
      };
      const remoteContent = remote.files?.[GIST_FILENAME]?.content;
      const remoteNotes = remoteContent ? (JSON.parse(remoteContent) as Note[]) : [];
      const merged = mergeNotes(notes, remoteNotes);
      await requestGist(`/gists/${targetGistId}`, {
        method: "PATCH",
        body: JSON.stringify({
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(merged, null, 2),
            },
          },
        }),
      });
      saveConfig(targetGistId);
      persist(merged);
      setStatus("同步完成：本地与 Gist 已合并。");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "同步失败。");
    } finally {
      setSyncing(false);
    }
  }

  function exportNotes() {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = GIST_FILENAME;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("已导出 JSON。");
  }

  async function importNotes(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const incoming = JSON.parse(text) as Note[];
      persist(mergeNotes(notes, incoming));
      setStatus("导入完成，已与本地笔记合并。");
    } catch {
      setStatus("导入失败，请确认文件是笔记 JSON。");
    } finally {
      event.target.value = "";
    }
  }

  if (!open) return null;

  return (
    <div className="notes-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="notes-panel" aria-label="知识库笔记">
        <header className="notes-header">
          <div className="notes-title-group">
            <button type="button" onClick={() => setSettingsOpen((value) => !value)} aria-label="打开笔记工具">
              <Menu size={19} />
            </button>
            <div>
              <span>Local + GitHub Gist</span>
              <h2>知识库笔记</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭笔记">
            <X size={20} />
          </button>
        </header>

        {settingsOpen ? (
          <aside className="notes-menu" aria-label="笔记工具">
            <header className="notes-menu-head">
              <span>笔记工具</span>
              <button type="button" onClick={() => setSettingsOpen(false)} aria-label="关闭笔记工具">
                <X size={16} />
              </button>
            </header>
            <div className="notes-menu-actions">
              <button type="button" onClick={exportNotes}>
                <Download size={16} />
                导出
              </button>
              <label>
                <Upload size={16} />
                导入
                <input type="file" accept="application/json,.json" onChange={importNotes} />
              </label>
            </div>
            <label>
              GitHub Personal Access Token
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="需要 gist 权限，只保存在本地浏览器"
              />
            </label>
            <label>
              Gist ID
              <input value={gistId} onChange={(event) => setGistId(event.target.value)} placeholder="留空则自动创建或查找" />
            </label>
            <button type="button" onClick={syncNotes} disabled={syncing}>
              {syncing ? "同步中…" : "保存并同步"}
            </button>
          </aside>
        ) : null}

        <label className="note-search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索笔记内容或标签" />
        </label>

        <div className="note-list">
          <div className="note-status">
            <span>{filteredNotes.length} 条笔记</span>
            <span>{status}</span>
          </div>
          {filteredNotes.length === 0 ? (
            <div className="note-empty">还没有匹配笔记。</div>
          ) : (
            filteredNotes.map((note) => (
              <article key={note.id} className="note-item">
                <button type="button" onClick={() => deleteNote(note.id)} aria-label="删除笔记">
                  <Trash2 size={15} />
                </button>
                <p>{note.content}</p>
                <div>
                  {note.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
                <time dateTime={note.createdAt}>{new Date(note.createdAt).toLocaleString("zh-CN")}</time>
              </article>
            ))
          )}
        </div>

        <div className="notes-composer">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="记录一个知识点、模板或操作提醒…"
            rows={2}
          />
          <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="标签，用逗号分隔" />
          <button type="button" onClick={addNote} aria-label="添加笔记" disabled={!content.trim()}>
            <Plus size={19} />
          </button>
        </div>
      </aside>
    </div>
  );
}

function mergeNotes(localNotes: Note[], remoteNotes: Note[]) {
  const map = new Map<string, Note>();
  [...remoteNotes, ...localNotes].forEach((note) => {
    if (note?.id && note?.content) {
      map.set(note.id, {
        id: note.id,
        content: note.content,
        tags: Array.isArray(note.tags) ? note.tags : [],
        createdAt: note.createdAt || new Date().toISOString(),
      });
    }
  });
  return Array.from(map.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
