import { existsSync, readFileSync } from "node:fs";

const guide = readFileSync(new URL("../src/data/guide.ts", import.meta.url), "utf8");
const guideApp = readFileSync(new URL("../src/components/GuideApp.tsx", import.meta.url), "utf8");
const aiLayer = readFileSync(new URL("../src/components/AiAskLayer.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const designPath = new URL("../DESIGN.md", import.meta.url);

const prospectMatch = guide.match(/id: "prospect"[\s\S]*?id: "outreach"/);

if (!prospectMatch) {
  throw new Error("Could not find the prospect stage.");
}

const prospectStage = prospectMatch[0];
const requiredChannels = ["WhatsApp", "TikTok", "Facebook", "Instagram", "LinkedIn"];
const missingChannels = requiredChannels.filter((channel) => !prospectStage.includes(channel));

if (missingChannels.length > 0) {
  throw new Error(`Prospect stage is missing social channels: ${missingChannels.join(", ")}`);
}

if (!existsSync(designPath)) {
  throw new Error("DESIGN.md is required for the redesigned UI system.");
}

const design = readFileSync(designPath, "utf8");
const uiRequirements = [
  [design, "Design System: Sell Out Guide"],
  [design, "Professional Export Operations Desk"],
  [guideApp, "workspace-shell"],
  [guideApp, "mobile-bottom-nav"],
  [guideApp, "activeStage"],
  [aiLayer, "ai-drawer"],
  [aiLayer, "ai-config-panel"],
  [aiLayer, "deleteRecord"],
  [aiLayer, "删除问答记录"],
  [aiLayer, "KeyRound"],
  [styles, "--navy"],
  [styles, ".workspace-shell"],
  [styles, ".ai-drawer"],
  [styles, ".mobile-bottom-nav"],
];

const missingUiRequirements = uiRequirements.filter(([source, token]) => !source.includes(token)).map(([, token]) => token);

if (missingUiRequirements.length > 0) {
  throw new Error(`Redesigned UI requirements missing: ${missingUiRequirements.join(", ")}`);
}

console.log("Guide content checks passed.");
