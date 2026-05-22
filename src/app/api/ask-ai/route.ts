import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type AskAiPayload = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  reasoningEffort?: string;
  selectedText?: string;
  question?: string;
};

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

export async function POST(request: NextRequest) {
  let payload: AskAiPayload;

  try {
    payload = (await request.json()) as AskAiPayload;
  } catch {
    return NextResponse.json({ error: "请求体不是有效 JSON。" }, { status: 400 });
  }

  const apiKey = payload.apiKey?.trim();
  const baseUrl = payload.baseUrl?.trim() || "https://api.86gamestore.com";
  const model = payload.model?.trim() || "gpt-5.4";
  const reasoningEffort = payload.reasoningEffort?.trim() || "xhigh";
  const selectedText = payload.selectedText?.trim();
  const question = payload.question?.trim();

  if (!apiKey) return NextResponse.json({ error: "缺少 API Key。" }, { status: 400 });
  if (!selectedText) return NextResponse.json({ error: "缺少选中文字。" }, { status: 400 });
  if (!question) return NextResponse.json({ error: "缺少问题。" }, { status: 400 });

  const prompt = [
    "你是一个面向中国外贸新手的页面问答助手。",
    "请基于用户选中的页面文字回答，先给结论，再给可执行步骤。",
    "如果涉及平台规则、费用、账号审核、合规、收款、税务或物流风险，提醒用户以官方页面和专业机构为准。",
    "",
    `页面选中文字：${selectedText}`,
    `用户问题：${question}`,
  ].join("\n");

  try {
    const response = await fetch(buildResponsesUrl(baseUrl), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: prompt,
        store: false,
        reasoning: reasoningEffort ? { effort: reasoningEffort } : undefined,
      }),
    });

    const data = await response.json().catch(async () => ({ raw: await response.text() }));

    if (!response.ok) {
      return NextResponse.json({ error: "AI 接口请求失败。", detail: data }, { status: response.status });
    }

    return NextResponse.json({
      answer: extractResponseText(data),
      raw: data,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "AI 代理请求失败。" }, { status: 500 });
  }
}
