"use client";

import {
  AlertTriangle,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Layers,
  NotebookPen,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { decisionRows, officialSources, stages, type GuideStage, type GuideTool } from "@/data/guide";
import { AiAskLayer } from "@/components/AiAskLayer";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { NotesPanel } from "@/components/NotesPanel";
import { TermText } from "@/components/TermText";
import { TooltipProvider } from "@/components/ui/tooltip";

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function stageMatches(stage: GuideStage, query: string) {
  if (!query) return true;
  const haystack = normalize(
    [
      stage.index,
      stage.title,
      stage.subtitle,
      stage.summary,
      stage.tags.join(" "),
      stage.knowledge.join(" "),
      stage.pitfalls.join(" "),
      stage.beginnerPath?.join(" ") || "",
      stage.tools
        .map((tool) => [tool.name, tool.category, tool.description, tool.bestFor, tool.steps.join(" ")].join(" "))
        .join(" "),
    ].join(" "),
  );
  return haystack.includes(query);
}

function openAi(text = "请基于当前外贸操作地图，帮我拆解下一步行动。") {
  window.dispatchEvent(new CustomEvent("sell-out-open-ai", { detail: { text } }));
}

function scrollWorkspaceToTop() {
  const workspace = document.getElementById("workspace");
  const topbar = document.querySelector<HTMLElement>(".topbar");
  if (!workspace) return;

  const topbarHeight = topbar?.offsetHeight || 0;
  const targetTop = workspace.getBoundingClientRect().top + window.scrollY - topbarHeight - 12;
  window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
}

export function GuideApp() {
  const [query, setQuery] = useState("");
  const [activeStageId, setActiveStageId] = useState(stages[0]?.id || "");
  const [notesOpen, setNotesOpen] = useState(false);
  const [tutorialTool, setTutorialTool] = useState<GuideTool | null>(null);
  const [matrixOpen, setMatrixOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [mobileStageOpen, setMobileStageOpen] = useState(false);

  const activeStage = stages.find((stage) => stage.id === activeStageId) || stages[0];
  const normalizedQuery = normalize(query);
  const filteredStages = useMemo(() => stages.filter((stage) => stageMatches(stage, normalizedQuery)), [normalizedQuery]);

  function chooseStage(id: string) {
    setActiveStageId(id);
    setMobileStageOpen(false);
    scrollWorkspaceToTop();
  }

  return (
    <TooltipProvider>
    <main className="app-shell">
      <header className="topbar">
        <a href="#top" className="brand-mark" aria-label="外贸入门指引首页">
          <Layers size={19} />
          <span>外贸入门指引</span>
        </a>
        <label className="top-search">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索工具、流程、风险或平台…" />
        </label>
        <div className="top-actions">
          <button type="button" className="icon-action" onClick={() => openAi()} aria-label="打开 AI 咨询">
            <Bot size={18} />
          </button>
          <button type="button" className="icon-action" onClick={() => setNotesOpen(true)} aria-label="打开知识库笔记">
            <NotebookPen size={18} />
          </button>
        </div>
      </header>

      <div className="workspace-shell" id="workspace">
        {mobileStageOpen ? <button type="button" className="mobile-stage-backdrop" aria-label="关闭章节导航" onClick={() => setMobileStageOpen(false)} /> : null}
        <aside className={mobileStageOpen ? "process-rail mobile-open" : "process-rail"} aria-label="外贸流程导航">
          <div className="rail-heading">
            <span>流程导航</span>
            <strong>从获客到复购</strong>
          </div>
          <nav className="stage-nav">
            {stages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                className={stage.id === activeStage.id ? "stage-nav-item active" : "stage-nav-item"}
                onClick={() => chooseStage(stage.id)}
              >
                <span>{stage.index}</span>
                <div>
                  <strong>{stage.title}</strong>
                  <small>{stage.subtitle}</small>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        <section className="workspace-main" id="top">
          {normalizedQuery ? (
            <SearchResults stages={filteredStages} onChooseStage={chooseStage} />
          ) : (
            <>
              <StageWorkspace stage={activeStage} onOpenTutorial={setTutorialTool} />

              <DisclosurePanel title="平台与渠道决策矩阵" eyebrow="决策矩阵" open={matrixOpen} onToggle={() => setMatrixOpen((value) => !value)}>
                <DecisionMatrix />
              </DisclosurePanel>

              <DisclosurePanel title="官方入口和可核验资料" eyebrow="官方资料" open={sourcesOpen} onToggle={() => setSourcesOpen((value) => !value)}>
                <SourceLinks />
              </DisclosurePanel>
            </>
          )}
        </section>

      </div>

      <nav className="mobile-bottom-nav" aria-label="移动端快捷导航">
        <button type="button" className={mobileStageOpen ? "active" : ""} onClick={() => setMobileStageOpen((value) => !value)} aria-expanded={mobileStageOpen}>
          <BookOpen size={18} />
          章节
        </button>
        <button type="button" onClick={() => document.querySelector(".top-search input") instanceof HTMLInputElement && document.querySelector<HTMLInputElement>(".top-search input")?.focus()}>
          <Search size={18} />
          搜索
        </button>
        <button type="button" onClick={() => openAi(activeStage.summary)}>
          <Bot size={18} />
          AI
        </button>
      </nav>

      <button className="floating-ai" type="button" onClick={() => openAi(activeStage.summary)} aria-label="打开 AI 咨询" data-tooltip="有问题直接问，划线可提问">
        <Bot size={20} />
      </button>
      <button className="floating-notes" type="button" onClick={() => setNotesOpen(true)} aria-label="打开悬浮知识库笔记">
        <NotebookPen size={20} />
      </button>
      <TutorialDialog tool={tutorialTool} onClose={() => setTutorialTool(null)} />
      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} />
      <AiAskLayer />
    </main>
    </TooltipProvider>
  );
}

function SearchResults({ stages: results, onChooseStage }: { stages: GuideStage[]; onChooseStage: (id: string) => void }) {
  return (
    <section className="search-results" aria-label="搜索结果">
      <div className="section-heading">
        <h2>匹配章节</h2>
      </div>
      {results.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={24} />
          <p>没有匹配结果，换个关键词试试。</p>
        </div>
      ) : (
        <div className="result-grid">
          {results.map((stage) => (
            <button key={stage.id} type="button" className="result-card" onClick={() => onChooseStage(stage.id)}>
              <span>{stage.index}</span>
              <strong>{stage.title}</strong>
              <p>{stage.summary}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function StageWorkspace({
  stage,
  onOpenTutorial,
}: {
  stage: GuideStage;
  onOpenTutorial: (tool: GuideTool) => void;
}) {
  const firstSteps = stage.beginnerPath?.slice(0, 3) || stage.knowledge.slice(0, 3);
  const checkPoints = stage.knowledge.slice(0, 4);

  return (
    <section className="stage-workspace" aria-labelledby={`${stage.id}-title`}>
      <div className="stage-title-row">
        <div>
          <span className="stage-index">{stage.index}</span>
          <h2 id={`${stage.id}-title`}><TermText>{stage.title}</TermText></h2>
          <p><TermText>{stage.subtitle}</TermText></p>
        </div>
        <button type="button" className="ghost-action" onClick={() => openAi(stage.summary)}>
          <Bot size={17} />
          问这一章
        </button>
      </div>

      <article className="stage-summary-panel">
        <strong>结论</strong>
        <p><TermText>{stage.summary}</TermText></p>
      </article>

      <div className="stage-detail-grid">
        <article className="action-panel">
          <div className="card-heading">
            <GraduationCap size={18} />
            <h3>3 步开始</h3>
          </div>
          <ol>
            {firstSteps.map((item) => (
              <li key={item}><TermText>{item}</TermText></li>
            ))}
          </ol>
        </article>

        <article className="action-panel">
          <div className="card-heading">
            <CheckCircle2 size={18} />
            <h3>关键检查点</h3>
          </div>
          <ul>
            {checkPoints.map((item) => (
              <li key={item}><TermText>{item}</TermText></li>
            ))}
          </ul>
        </article>
      </div>

      <article className="diagram-panel">
        <div className="card-heading">
          <Layers size={18} />
          <h3>{stage.diagramTitle}</h3>
        </div>
        <MermaidDiagram chart={stage.diagram} />
      </article>

      <section className="tool-section">
        <div className="compact-section-heading">
          <h3>工具与入口</h3>
        </div>
        <div className="tool-list">
          {stage.tools.map((tool) => (
            <ToolCard key={`${stage.id}-${tool.name}`} tool={tool} onOpenTutorial={onOpenTutorial} />
          ))}
        </div>
      </section>

      <article className="pitfall-card">
        <div className="card-heading">
          <AlertTriangle size={18} />
          <h3>常见坑</h3>
        </div>
        <div>
          {stage.pitfalls.map((pitfall) => (
            <span key={pitfall}><TermText>{pitfall}</TermText></span>
          ))}
        </div>
      </article>
    </section>
  );
}

function ToolCard({ tool, onOpenTutorial }: { tool: GuideTool; onOpenTutorial: (tool: GuideTool) => void }) {
  return (
    <article className="tool-card">
      <div className="tool-top">
        <div>
          <span><TermText>{tool.category}</TermText></span>
          <h3><TermText>{tool.name}</TermText></h3>
        </div>
        <a href={tool.links[0]?.url || "#"} target="_blank" rel="noreferrer" aria-label={`打开 ${tool.name}`}>
          <ExternalLink size={16} />
        </a>
      </div>
      <p><TermText>{tool.description}</TermText></p>
      <div className="tool-meta">
        <span><TermText>{tool.difficulty || "按步骤执行"}</TermText></span>
      </div>
      <div className="tool-actions">
        {tool.tutorials?.length ? (
          <button type="button" onClick={() => onOpenTutorial(tool)}>
            <GraduationCap size={15} />
            教程
          </button>
        ) : null}
        {tool.links.slice(1).map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}

function DisclosurePanel({
  title,
  eyebrow,
  open,
  onToggle,
  children,
}: {
  title: string;
  eyebrow: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="disclosure-panel">
      <button type="button" className="section-toggle" onClick={onToggle} aria-expanded={open}>
        <span>
          <span className="section-eyebrow">{eyebrow}</span>
          <strong>{title}</strong>
        </span>
        <ChevronRight size={18} />
      </button>
      {open ? <div className="disclosure-content">{children}</div> : null}
    </section>
  );
}

function DecisionMatrix() {
  return (
    <div className="matrix-table" role="table" aria-label="外贸渠道决策矩阵">
      <div className="matrix-row matrix-head" role="row">
        <span>渠道</span>
        <span>适合</span>
        <span>投入</span>
        <span>优势</span>
        <span>风险</span>
        <span>第一步</span>
      </div>
      {decisionRows.map((row) => (
        <div className="matrix-row" role="row" key={row.channel}>
          <strong><TermText>{row.channel}</TermText></strong>
          <span><TermText>{row.fit}</TermText></span>
          <span><TermText>{row.investment}</TermText></span>
          <span><TermText>{row.strengths}</TermText></span>
          <span><TermText>{row.risks}</TermText></span>
          <span><TermText>{row.firstMove}</TermText></span>
        </div>
      ))}
    </div>
  );
}

function SourceLinks() {
  return (
    <div className="source-links">
      {officialSources.map((source) => (
        <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
          {source.label}
          <ExternalLink size={15} />
        </a>
      ))}
    </div>
  );
}

function TutorialDialog({ tool, onClose }: { tool: GuideTool | null; onClose: () => void }) {
  if (!tool) return null;

  return (
    <div className="tutorial-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="tutorial-dialog" aria-label={`${tool.name} 教程`}>
        <div className="tutorial-header">
          <div>
            <span>{tool.category}</span>
            <h2>{tool.name} 教程</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭教程">
            <X size={20} />
          </button>
        </div>

        <div className="tutorial-difficulty">
          <strong>新手难点</strong>
          <p>{tool.difficulty || "按页面步骤操作，遇到规则、费用或审核问题时优先查官方资料。"}</p>
        </div>

        <div className="tutorial-section">
          <h3>先照这个顺序做</h3>
          <ol>
            {tool.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="tutorial-section">
          <h3>靠谱教程和核验入口</h3>
          <div className="tutorial-links">
            {(tool.tutorials || tool.links.map((link) => ({ ...link, kind: "官方" as const, note: "以该页面的最新说明为准。" }))).map(
              (link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                  <span>{link.kind}</span>
                  <strong>{link.label}</strong>
                  <p>{link.note}</p>
                  <ExternalLink size={16} />
                </a>
              ),
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
