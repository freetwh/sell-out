"use client";

import { Bot, ExternalLink, KeyRound, Loader2, MessageCircle, Save, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type AiConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
  reasoningEffort: string;
};

type AiRecord = {
  id: string;
  text: string;
  question: string;
  answer: string;
  model: string;
  createdAt: string;
};

type SelectionBubble = {
  text: string;
  x: number;
  y: number;
};

type HighlightPopover = {
  text: string;
  x: number;
  y: number;
};

const CONFIG_KEY = "sell-out-ai-config";
const RECORDS_KEY = "sell-out-ai-records";
const DEFAULT_CONFIG: AiConfig = {
  apiKey: "",
  baseUrl: "https://api.86gamestore.com",
  model: "gpt-5.4",
  reasoningEffort: "xhigh",
};

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

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildResponsesUrl(baseUrl: string) {
  const clean = baseUrl.trim().replace(/\/+$/, "");
  if (clean.endsWith("/responses")) return clean;
  if (clean.endsWith("/v1")) return `${clean}/responses`;
  return `${clean}/v1/responses`;
}

function extractResponseText(data: unknown): string {
  if (data && typeof data === "object" && "output_text" in data && typeof data.output_text === "string") {
    return data.output_text;
  }

  const chunks: string[] = [];
  const visit = (value: unknown) => {
    if (!value || typeof value !== "object") return;
    if ("text" in value && typeof value.text === "string") chunks.push(value.text);
    if ("content" in value && Array.isArray(value.content)) value.content.forEach(visit);
    if ("output" in value && Array.isArray(value.output)) value.output.forEach(visit);
  };
  visit(data);
  return chunks.join("\n").trim() || "接口已返回，但没有解析到文本答案。";
}

async function requestAi(config: AiConfig, selectedText: string, question: string) {
  const proxyResponse = await fetch("/api/ask-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey: config.apiKey.trim(),
      baseUrl: config.baseUrl.trim(),
      model: config.model.trim() || DEFAULT_CONFIG.model,
      reasoningEffort: config.reasoningEffort.trim(),
      selectedText,
      question,
    }),
  });

  if (proxyResponse.ok) {
    const data = await proxyResponse.json();
    return typeof data.answer === "string" ? data.answer : extractResponseText(data);
  }

  if (![404, 405].includes(proxyResponse.status)) {
    const message = await proxyResponse.text();
    throw new Error(`请求失败 ${proxyResponse.status}: ${message.slice(0, 220)}`);
  }

  const prompt = [
    "你是一个面向中国外贸新手的页面问答助手。",
    "请基于用户选中的页面文字回答，先给结论，再给可执行步骤。",
    "如果涉及平台规则、费用、账号审核、合规、收款、税务或物流风险，提醒用户以官方页面和专业机构为准。",
    "",
    `页面选中文字：${selectedText}`,
    `用户问题：${question}`,
  ].join("\n");

  const directResponse = await fetch(buildResponsesUrl(config.baseUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model.trim() || DEFAULT_CONFIG.model,
      input: prompt,
      store: false,
      reasoning: config.reasoningEffort.trim() ? { effort: config.reasoningEffort.trim() } : undefined,
    }),
  });

  if (!directResponse.ok) {
    const message = await directResponse.text();
    throw new Error(`直连接口失败 ${directResponse.status}: ${message.slice(0, 220)}`);
  }

  return extractResponseText(await directResponse.json());
}

function shouldIgnoreSelectionTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("input, textarea, button, a, .notes-overlay, .tutorial-overlay, .ai-dialog, .ai-highlight-popover"));
}

function shouldSkipTextNode(node: Node) {
  const parent = node.parentElement;
  if (!parent || !node.textContent?.trim()) return true;
  return Boolean(
    parent.closest(
      "script, style, textarea, input, button, a, svg, pre, code, .notes-overlay, .tutorial-overlay, .ai-dialog, .ai-selection-toolbar, .ai-highlight-popover, [data-ai-highlight]",
    ),
  );
}

function removeExistingHighlights(root: Element) {
  root.querySelectorAll("[data-ai-highlight]").forEach((node) => {
    const text = document.createTextNode(node.textContent || "");
    node.replaceWith(text);
  });
  root.normalize();
}

function createHighlightedFragment(text: string, highlights: string[]) {
  const fragment = document.createDocumentFragment();
  let rest = text;

  while (rest) {
    const lowerRest = rest.toLowerCase();
    let match = "";
    let matchIndex = -1;

    highlights.forEach((item) => {
      const index = lowerRest.indexOf(item.toLowerCase());
      if (index >= 0 && (matchIndex === -1 || index < matchIndex || (index === matchIndex && item.length > match.length))) {
        match = item;
        matchIndex = index;
      }
    });

    if (matchIndex === -1) {
      fragment.append(document.createTextNode(rest));
      break;
    }

    if (matchIndex > 0) fragment.append(document.createTextNode(rest.slice(0, matchIndex)));

    const matchedText = rest.slice(matchIndex, matchIndex + match.length);
    const span = document.createElement("span");
    span.className = "ai-saved-highlight";
    span.dataset.aiHighlight = cleanText(match);
    span.textContent = matchedText;
    fragment.append(span);
    rest = rest.slice(matchIndex + match.length);
  }

  return fragment;
}

export function AiAskLayer() {
  const [config, setConfig] = useState<AiConfig>(() => ({ ...DEFAULT_CONFIG, ...readJson<Partial<AiConfig>>(CONFIG_KEY, {}) }));
  const [records, setRecords] = useState<AiRecord[]>(() => readJson<AiRecord[]>(RECORDS_KEY, []));
  const [bubble, setBubble] = useState<SelectionBubble | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [popover, setPopover] = useState<HighlightPopover | null>(null);
  const [detailRecord, setDetailRecord] = useState<AiRecord | null>(null);
  const applyingHighlights = useRef(false);

  const highlights = useMemo(() => {
    return Array.from(new Set(records.map((record) => cleanText(record.text)).filter((text) => text.length >= 2))).sort(
      (a, b) => b.length - a.length,
    );
  }, [records]);

  const popoverRecords = useMemo(() => {
    if (!popover) return [];
    return records.filter((record) => cleanText(record.text).toLowerCase() === cleanText(popover.text).toLowerCase());
  }, [popover, records]);

  const persistRecords = useCallback((nextRecords: AiRecord[]) => {
    const sorted = [...nextRecords].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setRecords(sorted);
    saveJson(RECORDS_KEY, sorted);
  }, []);

  const applyHighlights = useCallback(() => {
    const root = document.querySelector("main");
    if (!root) return;
    applyingHighlights.current = true;
    removeExistingHighlights(root);

    if (highlights.length > 0) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => (shouldSkipTextNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
      });
      const nodes: Text[] = [];
      let current = walker.nextNode();
      while (current) {
        nodes.push(current as Text);
        current = walker.nextNode();
      }

      nodes.forEach((node) => {
        const value = node.textContent || "";
        if (!highlights.some((item) => value.toLowerCase().includes(item.toLowerCase()))) return;
        node.replaceWith(createHighlightedFragment(value, highlights));
      });
    }

    window.setTimeout(() => {
      applyingHighlights.current = false;
    }, 0);
  }, [highlights]);

  useEffect(() => {
    const timer = window.setTimeout(applyHighlights, 80);
    const root = document.querySelector("main");
    if (!root) return () => window.clearTimeout(timer);

    let mutationTimer = 0;
    const observer = new MutationObserver(() => {
      if (applyingHighlights.current) return;
      window.clearTimeout(mutationTimer);
      mutationTimer = window.setTimeout(applyHighlights, 120);
    });
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(mutationTimer);
      observer.disconnect();
      removeExistingHighlights(root);
    };
  }, [applyHighlights]);

  useEffect(() => {
    const updateSelection = (event: MouseEvent | KeyboardEvent) => {
      if (shouldIgnoreSelectionTarget(event.target)) return;
      window.setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
          setBubble(null);
          return;
        }
        const text = cleanText(selection.toString()).slice(0, 1000);
        if (text.length < 2) {
          setBubble(null);
          return;
        }
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setBubble({
          text,
          x: Math.min(window.innerWidth - 120, Math.max(16, rect.left + rect.width / 2 - 50)),
          y: Math.max(16, rect.top - 48),
        });
      }, 0);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("[data-ai-highlight]") : null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      setPopover({
        text: target.getAttribute("data-ai-highlight") || target.textContent || "",
        x: Math.min(window.innerWidth - 340, Math.max(16, rect.left)),
        y: Math.min(window.innerHeight - 260, rect.bottom + 10),
      });
    };

    document.addEventListener("mouseup", updateSelection);
    document.addEventListener("keyup", updateSelection);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("mouseup", updateSelection);
      document.removeEventListener("keyup", updateSelection);
      document.removeEventListener("click", onClick);
    };
  }, []);

  function openDialog(text: string) {
    setSelectedText(text);
    setQuestion("");
    setAnswer("");
    setStatus("");
    setDialogOpen(true);
    setBubble(null);
    setPopover(null);
  }

  function saveConfig() {
    saveJson(CONFIG_KEY, config);
    setStatus("AI 配置已保存在本地浏览器。");
  }

  async function askAi() {
    if (!config.apiKey.trim()) {
      setStatus("请先填写 API Key。");
      return;
    }
    if (!question.trim()) {
      setStatus("请先输入你想问的问题。");
      return;
    }

    setLoading(true);
    setStatus("正在请求 AI...");
    setAnswer("");
    saveJson(CONFIG_KEY, config);

    try {
      const nextAnswer = await requestAi(config, selectedText, question.trim());
      const record: AiRecord = {
        id: makeId(),
        text: selectedText,
        question: question.trim(),
        answer: nextAnswer,
        model: config.model.trim() || DEFAULT_CONFIG.model,
        createdAt: new Date().toISOString(),
      };
      persistRecords([record, ...records]);
      setAnswer(nextAnswer);
      setStatus("已保存到本地问答记录，并写入知识库笔记。");
      window.dispatchEvent(
        new CustomEvent("sell-out-add-note", {
          detail: {
            content: `AI 问答\n\n选中：${record.text}\n\n问题：${record.question}\n\n答案：${record.answer}`,
            tags: ["AI问答", "划线"],
          },
        }),
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "AI 请求失败。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {bubble ? (
        <button
          className="ai-selection-toolbar"
          style={{ left: bubble.x, top: bubble.y }}
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => openDialog(bubble.text)}
        >
          <MessageCircle size={16} />
          问 AI
        </button>
      ) : null}

      {popover ? (
        <aside className="ai-highlight-popover" style={{ left: popover.x, top: popover.y }}>
          <div className="ai-popover-head">
            <strong>已有问答</strong>
            <button type="button" onClick={() => setPopover(null)} aria-label="关闭问答记录">
              <X size={16} />
            </button>
          </div>
          <p className="ai-popover-text">{popover.text}</p>
          <div className="ai-record-list">
            {popoverRecords.map((record) => (
              <button key={record.id} type="button" onClick={() => setDetailRecord(record)}>
                <span>{record.question}</span>
                <time dateTime={record.createdAt}>{new Date(record.createdAt).toLocaleString("zh-CN")}</time>
              </button>
            ))}
          </div>
        </aside>
      ) : null}

      {dialogOpen ? (
        <div className="ai-overlay" onMouseDown={(event) => event.target === event.currentTarget && setDialogOpen(false)}>
          <aside className="ai-dialog" aria-label="AI 问答">
            <div className="ai-dialog-head">
              <div>
                <span>Local API Key + Responses API</span>
                <h2>问 AI</h2>
              </div>
              <button type="button" onClick={() => setDialogOpen(false)} aria-label="关闭 AI 问答">
                <X size={20} />
              </button>
            </div>

            <div className="ai-warning">
              <KeyRound size={17} />
              API Key 仅保存在本地浏览器。Vercel 部署会经本站 API 代理转发，避免 CORS；但 Key 仍会从浏览器发到本站 API。建议使用受限额度或中转 Key；每次提问都会消耗模型调用额度，本站不做用量上限。
            </div>

            <div className="ai-config-grid">
              <label>
                API Key
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(event) => setConfig((value) => ({ ...value, apiKey: event.target.value }))}
                  placeholder="sk-..."
                />
              </label>
              <label>
                Base URL
                <input
                  value={config.baseUrl}
                  onChange={(event) => setConfig((value) => ({ ...value, baseUrl: event.target.value }))}
                  placeholder="https://api.86gamestore.com"
                />
              </label>
              <label>
                Model
                <input value={config.model} onChange={(event) => setConfig((value) => ({ ...value, model: event.target.value }))} />
              </label>
              <label>
                Reasoning effort
                <input
                  value={config.reasoningEffort}
                  onChange={(event) => setConfig((value) => ({ ...value, reasoningEffort: event.target.value }))}
                  placeholder="xhigh"
                />
              </label>
            </div>

            <div className="ai-selected-text">
              <strong>选中文字</strong>
              <p>{selectedText}</p>
            </div>

            <label className="ai-question-box">
              你想问什么
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={4}
                placeholder="例如：这一步小白怎么做？风险是什么？给我一个执行清单。"
              />
            </label>

            <div className="ai-actions">
              <button type="button" onClick={saveConfig}>
                <Save size={16} />
                保存配置
              </button>
              <button type="button" className="ai-primary" onClick={askAi} disabled={loading}>
                {loading ? <Loader2 size={16} className="ai-spin" /> : <Bot size={16} />}
                {loading ? "咨询中..." : "咨询 AI"}
              </button>
            </div>

            {status ? <div className="ai-status">{status}</div> : null}
            {answer ? (
              <article className="ai-answer">
                <h3>AI 答案</h3>
                <p>{answer}</p>
              </article>
            ) : null}
          </aside>
        </div>
      ) : null}

      {detailRecord ? (
        <div className="ai-overlay" onMouseDown={(event) => event.target === event.currentTarget && setDetailRecord(null)}>
          <aside className="ai-dialog ai-detail-dialog" aria-label="AI 问答详情">
            <div className="ai-dialog-head">
              <div>
                <span>{new Date(detailRecord.createdAt).toLocaleString("zh-CN")}</span>
                <h2>问答详情</h2>
              </div>
              <button type="button" onClick={() => setDetailRecord(null)} aria-label="关闭问答详情">
                <X size={20} />
              </button>
            </div>
            <div className="ai-selected-text">
              <strong>划线文字</strong>
              <p>{detailRecord.text}</p>
            </div>
            <article className="ai-answer">
              <h3>{detailRecord.question}</h3>
              <p>{detailRecord.answer}</p>
            </article>
            <a className="ai-doc-link" href="https://platform.openai.com/docs/api-reference/responses/create" target="_blank" rel="noreferrer">
              Responses API 参考
              <ExternalLink size={15} />
            </a>
          </aside>
        </div>
      ) : null}
    </>
  );
}
