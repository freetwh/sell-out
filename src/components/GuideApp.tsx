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
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { decisionRows, officialSources, stages, type GuideStage, type GuideTool } from "@/data/guide";
import { AiAskLayer } from "@/components/AiAskLayer";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { TermText } from "@/components/TermText";
import { TooltipProvider } from "@/components/ui/tooltip";

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

type SearchMatch = {
  id: string;
  label: string;
  text: string;
  targetId: string;
};

type StageSearchResult = {
  stage: GuideStage;
  matches: SearchMatch[];
};

function textMatches(value: string, query: string) {
  return normalize(value).includes(query);
}

function buildSearchResults(query: string): StageSearchResult[] {
  if (!query) return [];

  return stages
    .map((stage) => {
      const matches: SearchMatch[] = [];
      const addMatch = (label: string, text: string, targetId: string) => {
        if (!textMatches(text, query)) return;
        matches.push({
          id: `${targetId}-${matches.length}`,
          label,
          text,
          targetId,
        });
      };

      addMatch("章节", `${stage.index} ${stage.title}`, `${stage.id}-title`);
      addMatch("导语", stage.subtitle, `${stage.id}-title`);
      addMatch("结论", stage.summary, `${stage.id}-summary`);
      stage.tags.forEach((tag) => addMatch("标签", tag, `${stage.id}-title`));
      (stage.beginnerPath || []).forEach((item, index) => addMatch("3 步开始", item, `${stage.id}-beginner-${index}`));
      stage.knowledge.forEach((item, index) => addMatch("关键检查点", item, `${stage.id}-knowledge-${index}`));
      stage.tools.forEach((tool, index) => {
        const targetId = `${stage.id}-tool-${index}`;
        addMatch("工具", `${tool.category} ${tool.name}`, targetId);
        addMatch("工具说明", tool.description, targetId);
        addMatch("适合场景", tool.bestFor, targetId);
        if (tool.difficulty) addMatch("难点", tool.difficulty, targetId);
        tool.steps.forEach((step) => addMatch("操作步骤", step, targetId));
      });
      stage.pitfalls.forEach((pitfall, index) => addMatch("常见坑", pitfall, `${stage.id}-pitfall-${index}`));

      return { stage, matches: matches.slice(0, 6) };
    })
    .filter((result) => result.matches.length > 0);
}

function openAi(text = "请基于当前外贸操作地图，帮我拆解下一步行动。") {
  window.dispatchEvent(new CustomEvent("sell-out-open-ai", { detail: { text } }));
}

function scrollPageTo(top: number) {
  const targetTop = Math.max(0, top);
  if (typeof window.scrollTo === "function") {
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }
  document.documentElement.scrollTop = targetTop;
  document.body.scrollTop = targetTop;
}

function scrollWorkspaceToTop() {
  const workspace = document.getElementById("workspace");
  const topbar = document.querySelector<HTMLElement>(".topbar");
  if (!workspace) return;

  const topbarHeight = topbar?.offsetHeight || 0;
  const targetTop = workspace.getBoundingClientRect().top + window.scrollY - topbarHeight - 12;
  scrollPageTo(targetTop);
}

function scrollToSearchTarget(targetId: string) {
  const target = document.getElementById(targetId);
  const topbar = document.querySelector<HTMLElement>(".topbar");
  if (!target) return;

  const topbarHeight = topbar?.offsetHeight || 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - topbarHeight - 14;
  scrollPageTo(targetTop);
  target.classList.remove("search-jump-flash");
  window.setTimeout(() => target.classList.add("search-jump-flash"), 0);
  window.setTimeout(() => target.classList.remove("search-jump-flash"), 1800);
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return text;
  const normalizedText = text.toLowerCase();
  const normalizedNeedle = query.toLowerCase();
  const parts: ReactNode[] = [];
  let cursor = 0;
  let index = normalizedText.indexOf(normalizedNeedle);

  while (index >= 0) {
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(<mark key={`${index}-${parts.length}`}>{text.slice(index, index + query.length)}</mark>);
    cursor = index + query.length;
    index = normalizedText.indexOf(normalizedNeedle, cursor);
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

export function GuideApp() {
  const [query, setQuery] = useState("");
  const [activeStageId, setActiveStageId] = useState(stages[0]?.id || "");
  const [tutorialTool, setTutorialTool] = useState<GuideTool | null>(null);
  const [matrixOpen, setMatrixOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [mobileStageOpen, setMobileStageOpen] = useState(false);
  const [pendingJumpId, setPendingJumpId] = useState("");

  const activeStage = stages.find((stage) => stage.id === activeStageId) || stages[0];
  const normalizedQuery = normalize(query);
  const searchResults = useMemo(() => buildSearchResults(normalizedQuery), [normalizedQuery]);

  useEffect(() => {
    if (normalizedQuery || !pendingJumpId) return;
    const timer = window.setTimeout(() => {
      scrollToSearchTarget(pendingJumpId);
      setPendingJumpId("");
    }, 80);
    return () => window.clearTimeout(timer);
  }, [normalizedQuery, pendingJumpId, activeStageId]);

  function chooseStage(id: string) {
    setActiveStageId(id);
    setMobileStageOpen(false);
    scrollWorkspaceToTop();
  }

  function chooseSearchMatch(stageId: string, targetId: string) {
    setActiveStageId(stageId);
    setMobileStageOpen(false);
    setPendingJumpId(targetId);
    setQuery("");
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
            <SearchResults results={searchResults} query={query} onChooseMatch={chooseSearchMatch} />
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
      <TutorialDialog tool={tutorialTool} onClose={() => setTutorialTool(null)} />
      <AiAskLayer />
    </main>
    </TooltipProvider>
  );
}

function SearchResults({
  results,
  query,
  onChooseMatch,
}: {
  results: StageSearchResult[];
  query: string;
  onChooseMatch: (stageId: string, targetId: string) => void;
}) {
  return (
    <section className="search-results" aria-label="搜索结果">
      <div className="section-heading">
        <h2>匹配内容</h2>
      </div>
      {results.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={24} />
          <p>没有匹配结果，换个关键词试试。</p>
        </div>
      ) : (
        <div className="result-grid">
          {results.map((result) => (
            <article key={result.stage.id} className="result-card">
              <span>{result.stage.index}</span>
              <strong>
                <HighlightText text={result.stage.title} query={query} />
              </strong>
              <div className="result-match-list">
                {result.matches.map((match) => (
                  <button key={match.id} type="button" onClick={() => onChooseMatch(result.stage.id, match.targetId)}>
                    <small>{match.label}</small>
                    <p>
                      <HighlightText text={match.text} query={query} />
                    </p>
                  </button>
                ))}
              </div>
            </article>
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

      <article className="stage-summary-panel" id={`${stage.id}-summary`}>
        <strong>结论</strong>
        <p><TermText>{stage.summary}</TermText></p>
      </article>

      <div className="stage-detail-grid" id="quick-start">
        <article className="action-panel">
          <div className="card-heading">
            <GraduationCap size={18} />
            <h3>3 步开始</h3>
          </div>
          <ol>
            {firstSteps.map((item, index) => (
              <li key={item} id={`${stage.id}-beginner-${index}`}><TermText>{item}</TermText></li>
            ))}
          </ol>
        </article>

        <article className="action-panel">
          <div className="card-heading">
            <CheckCircle2 size={18} />
            <h3>关键检查点</h3>
          </div>
          <ul>
            {checkPoints.map((item, index) => (
              <li key={item} id={`${stage.id}-knowledge-${index}`}><TermText>{item}</TermText></li>
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

      <section className="tool-section" id="tool-list">
        <div className="compact-section-heading">
          <h3>工具与入口</h3>
        </div>
        <div className="tool-list">
          {stage.tools.map((tool, index) => (
            <ToolCard key={`${stage.id}-${tool.name}`} id={`${stage.id}-tool-${index}`} tool={tool} onOpenTutorial={onOpenTutorial} />
          ))}
        </div>
      </section>

      <article className="pitfall-card" id="risk-list">
        <div className="card-heading">
          <AlertTriangle size={18} />
          <h3>常见坑</h3>
        </div>
        <div>
          {stage.pitfalls.map((pitfall, index) => (
            <span key={pitfall} id={`${stage.id}-pitfall-${index}`}><TermText>{pitfall}</TermText></span>
          ))}
        </div>
      </article>
    </section>
  );
}

function ToolCard({ id, tool, onOpenTutorial }: { id: string; tool: GuideTool; onOpenTutorial: (tool: GuideTool) => void }) {
  return (
    <article className="tool-card" id={id}>
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
