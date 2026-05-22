"use client";

import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  Filter,
  GraduationCap,
  Layers,
  NotebookPen,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { decisionRows, officialSources, stages, trendSignals, type GuideStage, type GuideTool } from "@/data/guide";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { NotesPanel } from "@/components/NotesPanel";

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
      stage.tools
        .map((tool) => [tool.name, tool.category, tool.description, tool.bestFor, tool.steps.join(" ")].join(" "))
        .join(" "),
    ].join(" "),
  );
  return haystack.includes(query);
}

export function GuideApp() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("全部");
  const [notesOpen, setNotesOpen] = useState(false);
  const [tutorialTool, setTutorialTool] = useState<GuideTool | null>(null);

  const tags = useMemo(() => ["全部", ...Array.from(new Set(stages.flatMap((stage) => stage.tags)))], []);
  const normalizedQuery = normalize(query);
  const filteredStages = useMemo(() => {
    return stages.filter((stage) => {
      const tagOk = activeTag === "全部" || stage.tags.includes(activeTag);
      return tagOk && stageMatches(stage, normalizedQuery);
    });
  }, [activeTag, normalizedQuery]);

  return (
    <main>
      <TopNav />
      <section className="hero-shell" id="top">
        <div className="hero-kicker">
          <Sparkles size={16} />
          2026 B2B Export Growth Playbook
        </div>
        <h1>外贸技能知识指引：从找客户到复购的一张操作地图</h1>
        <p className="hero-copy">
          面向中国工厂和贸易公司，把平台店、社媒、官网、开发信、报价、收款、发货和售后串成一套可执行流程。每个环节都配流程图、关键知识点、工具入口和新手步骤。
        </p>
        <div className="hero-actions">
          <a href="#platform" className="primary-action">
            先判断要不要开平台店
            <ChevronRight size={18} />
          </a>
          <button className="secondary-action" type="button" onClick={() => setNotesOpen(true)}>
            <NotebookPen size={18} />
            打开知识库笔记
          </button>
        </div>
      </section>

      <section className="control-panel" aria-label="搜索和筛选">
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索：Facebook、开发信、PI、Payoneer、DDP、售后..."
          />
        </label>
        <div className="tag-strip" aria-label="标签筛选">
          <Filter size={16} />
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={tag === activeTag ? "tag-chip active" : "tag-chip"}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="trend-board" id="trends">
        <div>
          <span className="section-eyebrow">What changed</span>
          <h2>2026 外贸获客的底层变化</h2>
        </div>
        <div className="trend-grid">
          {trendSignals.map((signal, index) => (
            <article key={signal} className="trend-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{signal}</p>
            </article>
          ))}
        </div>
      </section>

      <DecisionMatrix />

      <section className="stage-list" aria-label="外贸业务环节">
        {filteredStages.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={28} />
            <p>没有匹配结果，换个关键词试试。</p>
          </div>
        ) : (
          filteredStages.map((stage) => <StageSection key={stage.id} stage={stage} onOpenTutorial={setTutorialTool} />)
        )}
      </section>

      <section className="sources-panel" id="sources">
        <div>
          <span className="section-eyebrow">Official links</span>
          <h2>官方入口和可核验资料</h2>
          <p>平台规则、注册入口和费用可能变化，实操前优先以官方页面为准。</p>
        </div>
        <div className="source-links">
          {officialSources.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              {source.label}
              <ExternalLink size={15} />
            </a>
          ))}
        </div>
      </section>

      <footer>
        本站为外贸操作知识导航，不构成法律、税务、金融或合规意见。涉及制裁、认证、税务、危险品、儿童用品、医疗、食品接触材料等场景，应咨询专业机构并核验目标市场要求。
      </footer>

      <button className="floating-notes" type="button" onClick={() => setNotesOpen(true)} aria-label="打开悬浮知识库笔记">
        <NotebookPen size={20} />
        笔记
      </button>
      <TutorialDialog tool={tutorialTool} onClose={() => setTutorialTool(null)} />
      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} />
    </main>
  );
}

function TopNav() {
  return (
    <nav className="top-nav">
      <a href="#top" className="brand-mark">
        <Layers size={18} />
        Sell Out Guide
      </a>
      <div className="nav-scroll">
        <a href="#trends">趋势</a>
        <a href="#matrix">平台决策</a>
        {stages.map((stage) => (
          <a key={stage.id} href={`#${stage.id}`}>
            {stage.index} {stage.title}
          </a>
        ))}
        <a href="#sources">官方链接</a>
      </div>
    </nav>
  );
}

function DecisionMatrix() {
  return (
    <section className="matrix-panel" id="matrix">
      <div className="section-heading">
        <span className="section-eyebrow">Decision matrix</span>
        <h2>是否要开平台店：先看渠道角色</h2>
        <p>平台店适合承接采购意图，但不是万能答案。先看产品、团队、预算和客户资产沉淀方式。</p>
      </div>
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
            <strong>{row.channel}</strong>
            <span>{row.fit}</span>
            <span>{row.investment}</span>
            <span>{row.strengths}</span>
            <span>{row.risks}</span>
            <span>{row.firstMove}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StageSection({ stage, onOpenTutorial }: { stage: GuideStage; onOpenTutorial: (tool: GuideTool) => void }) {
  return (
    <section className="stage-section" id={stage.id}>
      <div className="stage-header">
        <div>
          <span className="stage-index">{stage.index}</span>
          <h2>{stage.title}</h2>
          <p>{stage.subtitle}</p>
        </div>
        <div className="stage-tags">
          {stage.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <p className="stage-summary">{stage.summary}</p>

      <div className="stage-grid">
        <article className="diagram-card">
          <div className="card-heading">
            <ShieldCheck size={18} />
            <h3>{stage.diagramTitle}</h3>
          </div>
          <MermaidDiagram chart={stage.diagram} />
        </article>

        <article className="knowledge-card">
          <h3>关键知识点</h3>
          <ul>
            {stage.knowledge.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      {stage.beginnerPath?.length ? (
        <article className="beginner-card">
          <div className="card-heading">
            <GraduationCap size={18} />
            <h3>小白从这里开始</h3>
          </div>
          <ol>
            {stage.beginnerPath.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
      ) : null}

      <div className="tool-grid">
        {stage.tools.map((tool) => (
          <ToolCard key={`${stage.id}-${tool.name}`} tool={tool} onOpenTutorial={onOpenTutorial} />
        ))}
      </div>

      <article className="pitfall-card">
        <h3>常见坑</h3>
        <div>
          {stage.pitfalls.map((pitfall) => (
            <span key={pitfall}>{pitfall}</span>
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
          <span>{tool.category}</span>
          <h3>{tool.name}</h3>
        </div>
        <div className="tool-links">
          {tool.links.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer" title={link.label}>
              <ExternalLink size={16} />
            </a>
          ))}
        </div>
      </div>
      <p>{tool.description}</p>
      {tool.difficulty ? (
        <div className="difficulty-note">
          <span>难点</span>
          {tool.difficulty}
        </div>
      ) : null}
      <div className="best-for">{tool.bestFor}</div>
      <ol>
        {tool.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="text-links">
        {tool.tutorials?.length ? (
          <button type="button" className="tutorial-button" onClick={() => onOpenTutorial(tool)}>
            <GraduationCap size={15} />
            教程
          </button>
        ) : null}
        {tool.links.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </article>
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
