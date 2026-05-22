"use client";

import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
};

type DiagramSize = {
  width: number;
  height: number;
};

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "");
  const canvasRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState<DiagramSize | null>(null);
  const [zoom, setZoom] = useState(1);

  function updateZoom(delta: number) {
    setZoom((value) => Math.min(2.2, Math.max(0.6, Number((value + delta).toFixed(2)))));
  }

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          securityLevel: "loose",
          themeVariables: {
            background: "transparent",
            primaryColor: "#f7f0df",
            primaryTextColor: "#1b1a17",
            primaryBorderColor: "#9c7a3d",
            lineColor: "#5b6b73",
            secondaryColor: "#d8e7df",
            tertiaryColor: "#eef2f3",
            fontFamily: "var(--font-body)",
          },
        });
        const { svg } = await mermaid.render(`diagram-${id}`, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          const renderedSvg = ref.current.querySelector("svg");
          const viewBox = renderedSvg?.getAttribute("viewBox")?.split(/\s+/).map(Number);
          if (renderedSvg && viewBox?.length === 4 && viewBox.every(Number.isFinite)) {
            const [, , viewBoxWidth, viewBoxHeight] = viewBox;
            const availableWidth = Math.max(320, (canvasRef.current?.clientWidth || viewBoxWidth) - 24);
            const baseWidth = Math.min(viewBoxWidth, availableWidth);
            const ratio = viewBoxHeight / viewBoxWidth;
            setSize({ width: baseWidth, height: Math.max(180, baseWidth * ratio) });
          }
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Mermaid 渲染失败");
        }
      }
    }

    renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div className="mermaid-viewer">
      <div className="mermaid-toolbar" aria-label="流程图缩放">
        <button type="button" onClick={() => updateZoom(-0.15)} aria-label="缩小流程图" title="缩小">
          <ZoomOut size={16} />
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => updateZoom(0.15)} aria-label="放大流程图" title="放大">
          <ZoomIn size={16} />
        </button>
        <button type="button" onClick={() => setZoom(1)} aria-label="重置流程图缩放" title="重置">
          <RotateCcw size={16} />
        </button>
      </div>
      <div ref={canvasRef} className="mermaid-canvas" aria-label="业务流程图">
        {error ? (
          <pre className="diagram-fallback">{chart}</pre>
        ) : (
          <div
            className="mermaid-scale-shell"
            style={size ? { width: size.width * zoom, height: size.height * zoom } : undefined}
          >
            <div
              ref={ref}
              className="mermaid-diagram"
              style={size ? { width: size.width, height: size.height, transform: `scale(${zoom})` } : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}
