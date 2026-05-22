"use client";

import { useEffect, useId, useRef, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
};

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (error) {
    return <pre className="diagram-fallback">{chart}</pre>;
  }

  return <div ref={ref} className="mermaid-diagram" aria-label="业务流程图" />;
}
