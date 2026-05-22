export type ToolLink = {
  label: string;
  url: string;
};

export type TutorialLink = ToolLink & {
  kind: "官方" | "教程" | "核验";
  note: string;
};

export type GuideTool = {
  name: string;
  category: string;
  description: string;
  bestFor: string;
  difficulty?: string;
  steps: string[];
  links: ToolLink[];
  tutorials?: TutorialLink[];
};

export type GuideStage = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  diagramTitle: string;
  diagram: string;
  knowledge: string[];
  beginnerPath?: string[];
  tools: GuideTool[];
  pitfalls: string[];
};

export type DecisionRow = {
  channel: string;
  fit: string;
  investment: string;
  strengths: string;
  risks: string;
  firstMove: string;
};

export const decisionRows: DecisionRow[] = [
  {
    channel: "Alibaba.com / 中国制造 / 环球资源",
    fit: "标准品、OEM/ODM、工厂有稳定供给能力",
    investment: "平台年费 + 运营 + RFQ/广告",
    strengths: "买家有采购意图，信任路径短，适合询盘积累",
    risks: "同质化报价严重，平台规则和排名成本会变",
    firstMove: "先做 20 个高质量产品页、认证资料、视频验厂和样品报价模板",
  },
  {
    channel: "LinkedIn + Google 主动开发",
    fit: "客单价高、行业明确、可找到采购/老板/工程角色",
    investment: "人力 + 数据工具 + 内容资产",
    strengths: "可控、可沉淀客户关系，不完全依赖平台",
    risks: "周期长，开发信质量和跟进节奏决定成败",
    firstMove: "定义 ICP，建 200 个目标客户清单，做 4 轮轻触达序列",
  },
  {
    channel: "Facebook / Instagram / 社群",
    fit: "消费品、轻定制、渠道商、区域代理、视觉展示强的产品",
    investment: "主页内容 + 群组互动 + 可选广告",
    strengths: "适合建立真人信任和案例展示",
    risks: "账号风控、地区文化差异、私信容易被忽略",
    firstMove: "创建 Page，补齐公司资料，每周发案例、产线、包装和出货内容",
  },
  {
    channel: "展会 + 线上复盘",
    fit: "需要样品体验、认证复杂、客单价高的行业",
    investment: "展位/差旅 + 样品 + 展后 CRM",
    strengths: "信任建立快，适合见到关键决策人",
    risks: "展后不跟进会快速流失，成本较高",
    firstMove: "展前约见 30 个目标买家，展后 48 小时内发资料和下一步动作",
  },
  {
    channel: "独立站 / 内容站 / AI 搜索可见性",
    fit: "有品牌、案例、技术资料、长期 SEO 价值的品类",
    investment: "内容 + SEO + 表单 + 分析工具",
    strengths: "增强可信度，被搜索和 AI 摘要引用的机会更高",
    risks: "冷启动慢，不能代替主动获客",
    firstMove: "先做公司可信资料、核心品类页、证书页、案例页和询盘表单",
  },
];

export const trendSignals = [
  "买家前期研究更自主：官网、社媒、行业内容、AI 搜索摘要和同行推荐会先于销售接触发生。",
  "平台店仍有价值，但更像获客渠道之一，不应成为唯一客户资产来源。",
  "LinkedIn、Facebook、WhatsApp 和邮件组合触达，比单一开发信更适合 2026 年的 B2B 跟进。",
  "视频验厂、生产过程、包装发货、认证文件和真实案例，是降低陌生买家风险感的基础资产。",
  "AI 工具适合提效：客户研究、邮件初稿、多语种改写、报价说明、FAQ 和售后回复，但关键承诺必须人工确认。",
];

export const stages: GuideStage[] = [
  {
    id: "overview",
    index: "01",
    title: "2026 获客方式总览",
    subtitle: "不要押单一渠道，先搭一套可验证的获客组合。",
    summary:
      "外贸获客从平台流量竞争，转向多入口信任竞争。推荐用平台店承接高意图买家，用 LinkedIn/Google/Facebook 主动开发目标客户，用官网和内容资产完成信任背书。",
    tags: ["获客", "渠道组合", "AI 搜索", "B2B"],
    diagramTitle: "多渠道获客飞轮",
    diagram: `flowchart LR
  A[定义目标买家 ICP] --> B[平台店承接高意图询盘]
  A --> C[Google/LinkedIn 主动找客户]
  A --> D[Facebook/展会社媒建立信任]
  B --> E[CRM 统一跟进]
  C --> E
  D --> E
  E --> F[样品/报价/视频验厂]
  F --> G[成交与复购]
  G --> H[案例/评价/内容沉淀]
  H --> B
  H --> C
  H --> D`,
    knowledge: [
      "先定义 ICP：国家、行业、采购角色、采购量、价格带、认证要求和痛点。",
      "每个渠道只承担一个主目标：平台拿询盘，LinkedIn 找决策人，官网做信任，WhatsApp 做快速沟通。",
      "把产品资料、工厂视频、证书、案例、FAQ 做成可复用素材库。",
      "用 CRM 或表格记录来源、联系人、需求、下一步动作和跟进日期。",
    ],
    beginnerPath: [
      "第 1 天只做一件事：写出目标买家画像，不急着注册所有平台。",
      "第 2-3 天准备可信资料包：营业执照英文信息、公司介绍、产品规格、证书、工厂照片和 30 秒视频。",
      "第 4-7 天选两个主渠道测试：一个承接型渠道，比如平台店或官网；一个主动型渠道，比如 LinkedIn 或 Google 搜索。",
      "每周复盘一次有效线索，不用单纯追求浏览量或粉丝数。",
    ],
    tools: [
      {
        name: "Google Trends",
        category: "市场趋势",
        description: "观察目标国家关键词热度和季节性，判断需求是否在增长。",
        bestFor: "初步判断品类方向、国家优先级和季节性。",
        steps: ["输入产品英文关键词", "切换目标国家", "比较 2-5 个替代词", "记录高峰月份和相关查询"],
        links: [{ label: "打开 Google Trends", url: "https://trends.google.com/trends/" }],
      },
      {
        name: "LinkedIn",
        category: "B2B 开发",
        description: "寻找进口商、品牌方、分销商、采购经理和老板。",
        bestFor: "高客单价、行业明确、可找到公司和岗位的 B2B 产品。",
        difficulty: "中等：资料可信度、搜索关键词和私信节奏决定成效。",
        steps: ["完善个人资料", "建立公司主页", "搜索目标职位", "先互动再私信", "把线索同步到 CRM"],
        links: [
          { label: "创建 LinkedIn Page", url: "https://www.linkedin.com/help/linkedin/answer/a543852" },
          { label: "LinkedIn Ads", url: "https://www.linkedin.com/business/marketing/ads" },
        ],
        tutorials: [
          {
            label: "LinkedIn 公司主页官方教程",
            url: "https://www.linkedin.com/help/linkedin/answer/a543852",
            kind: "官方",
            note: "先按官方步骤建 Page，再补公司简介、官网、行业、Logo 和 Banner。",
          },
          {
            label: "LinkedIn 营销方案入口",
            url: "https://www.linkedin.com/business/marketing",
            kind: "核验",
            note: "投广告前先看官方产品页，确认目标国家、预算和素材要求。",
          },
        ],
      },
      {
        name: "ChatGPT / AI 助手",
        category: "提效",
        description: "做客户研究、开发信改写、FAQ、多语种回复和会议纪要。",
        bestFor: "提升资料整理和沟通初稿效率。",
        difficulty: "低到中等：难点不是生成文字，而是事实校对和公司口径统一。",
        steps: ["输入客户网站和目标角色", "生成触达理由", "人工校对事实", "改成公司语气", "保存高转化模板"],
        links: [{ label: "OpenAI", url: "https://openai.com/" }],
        tutorials: [
          {
            label: "ChatGPT 官方入口",
            url: "https://chatgpt.com/",
            kind: "官方",
            note: "用于客户研究、邮件初稿和多语种改写；产能、认证、价格必须人工确认。",
          },
        ],
      },
    ],
    pitfalls: [
      "不要只看询盘数量，要看询盘质量、国家、采购量和成交周期。",
      "不要让 AI 编造认证、产能、交期或客户案例。",
      "不要把客户资料散在微信、WhatsApp、邮箱和表格里无人维护。",
    ],
  },
  {
    id: "platform",
    index: "02",
    title: "是否要开平台店",
    subtitle: "平台店不是必选题，是获客预算和团队能力的选择题。",
    summary:
      "如果产品标准化、供应稳定、愿意持续运营产品页和 RFQ，平台店值得测试。如果客单价高、定制复杂、买家画像明确，主动开发和官网背书可能更快形成有效线索。",
    tags: ["平台店", "Alibaba", "询盘", "渠道决策"],
    diagramTitle: "平台店决策流程",
    diagram: `flowchart TD
  A[准备开平台店?] --> B{产品是否标准化且可展示}
  B -- 否 --> C[先做官网资料和主动开发]
  B -- 是 --> D{能否持续运营 3-6 个月}
  D -- 否 --> C
  D -- 是 --> E{是否有样品/证书/报价模板}
  E -- 否 --> F[补齐基础资料]
  E -- 是 --> G[小预算开店测试]
  G --> H[每周看询盘质量/关键词/转化]
  H --> I{有效询盘成本可接受?}
  I -- 是 --> J[加深产品页和广告]
  I -- 否 --> K[收缩预算, 转向主动开发]`,
    knowledge: [
      "平台店适合承接有采购意图的买家，但需要长期优化标题、图片、详情、关键词、RFQ 和响应速度。",
      "开店前先算获客成本：年费、广告、运营人力、样品和平台抽佣。",
      "平台页要用买家语言写：应用场景、规格、MOQ、交期、认证、包装、定制能力。",
      "平台线索要导入私域 CRM，避免平台规则变化影响客户资产。",
    ],
    beginnerPath: [
      "先不要急着交年费，拿 10 个竞品店铺对比标题、主图、MOQ、证书和详情页结构。",
      "准备 20 个可稳定供货的 SKU，每个 SKU 都要有英文标题、规格表、应用场景、包装和交期。",
      "开店后先盯响应速度、询盘质量和关键词来源，连续 4 周记录有效询盘成本。",
      "如果有效询盘成本过高，先优化产品页和 RFQ 话术，再决定是否加广告。",
    ],
    tools: [
      {
        name: "Alibaba.com Seller Central",
        category: "B2B 平台",
        description: "国际站供应商后台入口，用于开店、上传产品、管理询盘。",
        bestFor: "OEM/ODM、标准化工业品、礼品、消费品和可批量采购产品。",
        difficulty: "中等偏高：费用、认证、产品页质量、RFQ 响应和广告预算都影响结果。",
        steps: ["准备营业执照和公司资料", "咨询供应商方案", "上传核心产品", "设置 RFQ/询盘响应流程", "每周复盘关键词和询盘质量"],
        links: [{ label: "Seller Central", url: "https://seller.alibaba.com/?lang=en" }],
        tutorials: [
          {
            label: "Alibaba.com 卖家后台",
            url: "https://seller.alibaba.com/?lang=en",
            kind: "官方",
            note: "以后台和招商顾问给出的套餐、认证、广告规则为准，费用会随地区和方案变化。",
          },
          {
            label: "Alibaba.com Help Center",
            url: "https://service.alibaba.com/page/home",
            kind: "核验",
            note: "遇到产品发布、账号审核、交易保障和 RFQ 问题时优先查官方帮助中心。",
          },
        ],
      },
      {
        name: "Made-in-China",
        category: "B2B 平台",
        description: "面向海外买家的中国供应商平台，适合做额外询盘入口。",
        bestFor: "机械、五金、建材、电子、电器等传统外贸品类。",
        difficulty: "中等：重点在公司认证、产品资料完整度和持续询盘跟进。",
        steps: ["注册供应商账号", "补齐公司认证", "上传产品和证书", "跟进询盘", "记录有效询盘成本"],
        links: [{ label: "Made-in-China", url: "https://www.made-in-china.com/" }],
        tutorials: [
          {
            label: "Made-in-China 供应商入口",
            url: "https://www.made-in-china.com/help/seller/",
            kind: "官方",
            note: "注册、认证、产品发布和询盘规则要按官方卖家帮助页核对。",
          },
        ],
      },
      {
        name: "Google Search Console",
        category: "官网流量",
        description: "如果同时做独立官网，用它观察搜索收录和关键词表现。",
        bestFor: "把平台获客和官网信任背书结合起来。",
        difficulty: "中等：需要先有可访问官网、站点验证权限和基础 SEO 结构。",
        steps: ["验证网站", "提交 sitemap", "查看查询词", "优化品类页标题", "修复收录问题"],
        links: [{ label: "Search Console", url: "https://search.google.com/search-console/about" }],
        tutorials: [
          {
            label: "Search Console 官方入门",
            url: "https://support.google.com/webmasters/answer/9128668",
            kind: "官方",
            note: "先完成站点验证，再提交 sitemap，观察真实搜索词和收录问题。",
          },
        ],
      },
    ],
    pitfalls: [
      "不要把平台店当一次性装修项目，没人响应询盘就没有价值。",
      "不要只复制中文产品参数，必须改成海外买家可理解的采购语言。",
      "不要在平台承诺做不到的认证、交期和售后。",
    ],
  },
  {
    id: "prospect",
    index: "03",
    title: "找客户",
    subtitle: "先找对公司，再找对人，最后找对触达理由。",
    summary:
      "找客户不是买一堆邮箱，而是建立目标客户清单。先按国家和行业筛公司，再找采购、产品、运营、老板等角色，最后用业务场景写触达理由。",
    tags: ["客户开发", "Google", "LinkedIn", "海关数据", "名单"],
    diagramTitle: "客户清单构建流程",
    diagram: `flowchart LR
  A[选择目标国家/行业] --> B[搜索进口商/品牌/渠道商]
  B --> C[验证公司真实性]
  C --> D[找到关键联系人]
  D --> E[补全邮箱/LinkedIn/WhatsApp]
  E --> F[写触达理由]
  F --> G[导入 CRM 并安排跟进]`,
    knowledge: [
      "用关键词组合搜索：product + importer/distributor/wholesaler/private label/OEM。",
      "验证公司：官网、LinkedIn 员工、地址、社媒、展会记录、进口记录和评价。",
      "联系人优先级：采购、品类经理、产品经理、老板、运营负责人。",
      "每条线索至少记录国家、公司类型、产品匹配度、联系人、触达渠道和下一步。",
    ],
    beginnerPath: [
      "从一个国家和一个细分品类开始，避免一上来搜全球客户。",
      "先用 Google 找 50 家公司，再用 LinkedIn 验证公司员工和采购相关岗位。",
      "每家公司只记录有证据的字段，不确定的信息标记待核验。",
      "第一批名单宁愿少而准，先跑通触达和跟进节奏。",
    ],
    tools: [
      {
        name: "Google 高级搜索",
        category: "客户搜索",
        description: "用搜索语法发现进口商、批发商、品牌方和行业目录。",
        bestFor: "低成本建立第一批客户名单。",
        difficulty: "低到中等：难点在英文关键词组合和排除无效黄页。",
        steps: ["组合英文关键词", "使用 site: 和 intitle:", "打开公司官网验证", "记录联系人页面", "把结果放入表格"],
        links: [{ label: "Google", url: "https://www.google.com/" }],
        tutorials: [
          {
            label: "Google 搜索语法帮助",
            url: "https://support.google.com/websearch/answer/2466433",
            kind: "官方",
            note: "学会引号、减号、site: 和 OR，可以大幅减少无关结果。",
          },
        ],
      },
      {
        name: "ImportYeti",
        category: "海关数据",
        description: "通过美国进口记录发现采购商和供应链关系。",
        bestFor: "找美国进口商、竞品客户和采购频率线索。",
        difficulty: "中等：海关数据能提示交易关系，但联系人和当前需求仍要二次验证。",
        steps: ["搜索竞品或品类词", "查看进口商", "打开公司官网", "找联系人", "记录采购相关信息"],
        links: [{ label: "ImportYeti", url: "https://www.importyeti.com/" }],
        tutorials: [
          {
            label: "ImportYeti 使用入口",
            url: "https://www.importyeti.com/",
            kind: "教程",
            note: "从竞品名、供应商名或产品词反查美国进口商，再回到官网和 LinkedIn 验证。",
          },
        ],
      },
      {
        name: "Hunter",
        category: "邮箱查找",
        description: "根据公司域名查找公开邮箱格式和联系人邮箱。",
        bestFor: "补全开发信触达信息。",
        difficulty: "中等：邮箱格式只是线索，发送前要验证，避免退信伤害域名信誉。",
        steps: ["输入公司域名", "查看邮箱格式", "优先找采购/销售/老板", "验证邮箱", "写入 CRM"],
        links: [{ label: "Hunter", url: "https://hunter.io/" }],
        tutorials: [
          {
            label: "Hunter 官方指南",
            url: "https://hunter.io/help",
            kind: "官方",
            note: "重点看 Domain Search、Email Finder 和 Email Verifier，先小批量测试。",
          },
        ],
      },
    ],
    pitfalls: [
      "不要群发无差别开发信，会伤害域名信誉并降低回复率。",
      "不要只找 info@ 邮箱，尽量找到具体岗位或具体姓名。",
      "不要忽略小进口商，他们可能比大品牌更容易启动合作。",
    ],
  },
  {
    id: "outreach",
    index: "04",
    title: "接触客户",
    subtitle: "第一次触达的目标不是成交，而是获得一个小回应。",
    summary:
      "触达要短、具体、有理由。用邮件负责正式资料，用 LinkedIn 和 Facebook 建立人感，用 WhatsApp 做已建立联系后的快速沟通。",
    tags: ["开发信", "LinkedIn", "Facebook", "WhatsApp", "触达"],
    diagramTitle: "多触点接触时序",
    diagram: `sequenceDiagram
  participant S as 外贸销售
  participant B as 目标买家
  participant C as CRM
  S->>B: LinkedIn 关注/互动
  S->>B: 邮件 1: 具体匹配理由 + 1 个产品亮点
  S->>C: 记录触达时间和内容
  S->>B: 邮件 2: 案例/证书/短视频
  S->>B: LinkedIn 私信轻提醒
  B-->>S: 回复需求或转给同事
  S->>B: 发送规格表/样品/报价下一步`,
    knowledge: [
      "开发信结构：你是谁、为什么找他、你能解决什么、一个证据、一个低门槛问题。",
      "LinkedIn 不要一上来长篇推销，先用资料和内容建立可信度。",
      "Facebook Page 要补齐公司信息、产品相册、工厂视频、联系方式和 Messenger 自动回复。",
      "WhatsApp 适合跟进已同意沟通的客户，不适合冷启动轰炸。",
    ],
    beginnerPath: [
      "先用公司域名邮箱发送 20-50 封高质量开发信，不要买名单群发。",
      "Facebook/Instagram 先做主页可信度：公司资料、真实照片、联系方式、案例和短视频。",
      "国内使用 Meta 和 TikTok 相关产品常见难点是网络可达性、账号风控和企业资料审核，务必准备稳定合规的访问环境和一致的公司资料。",
      "WhatsApp 只跟进已经建立关系的人，冷启动轰炸容易被举报或封号。",
    ],
    tools: [
      {
        name: "Meta Business Suite",
        category: "Facebook/Instagram",
        description: "管理 Facebook Page、Instagram、消息、内容和广告资产。",
        bestFor: "做公司社媒信任背书和客户消息入口。",
        difficulty: "高：国内访问、个人账号风控、Business Portfolio、Page 权限和广告资产审核都可能卡住。",
        steps: ["创建或登录 Meta 账号", "创建 Business Portfolio", "创建 Facebook Page", "补齐公司资料和联系方式", "发布案例和产品内容"],
        links: [
          { label: "Meta Business", url: "https://business.facebook.com/" },
          { label: "Meta Help Center", url: "https://www.facebook.com/business/help" },
        ],
        tutorials: [
          {
            label: "创建 Facebook Page 官方教程",
            url: "https://www.facebook.com/help/104002523024878",
            kind: "官方",
            note: "用个人账号创建 Page，补齐名称、分类、简介、头像、封面和联系方式。",
          },
          {
            label: "Meta Business Help",
            url: "https://www.facebook.com/business/help",
            kind: "核验",
            note: "Business Portfolio、广告账户、权限和账号限制规则变化快，操作前先查官方帮助。",
          },
          {
            label: "Meta Business Suite",
            url: "https://business.facebook.com/",
            kind: "官方",
            note: "集中管理 Page、Instagram、消息和内容；国内访问不稳定时不要频繁换设备和 IP。",
          },
        ],
      },
      {
        name: "TikTok for Business",
        category: "短视频/广告",
        description: "用于 TikTok 广告账户、Business Center、素材和像素管理。",
        bestFor: "视觉强、适合短视频种草的消费品、轻定制和区域代理招募。",
        difficulty: "高：TikTok 在国内常见访问门槛，普通代理/VPN 可能打不开或不稳定；广告账户还需要业务资料、账单信息和审核。",
        steps: ["先确认目标市场是否适合 TikTok", "准备企业资料和官网/落地页", "创建 Business Center 或 Ads Manager", "完成账单和审核", "小预算测试素材"],
        links: [
          { label: "TikTok Business", url: "https://www.tiktok.com/business/" },
          { label: "Business Help Center", url: "https://businesshelp.tiktok.com/" },
        ],
        tutorials: [
          {
            label: "TikTok Ads Manager 官方入门",
            url: "https://ads.tiktok.com/help/",
            kind: "官方",
            note: "按官方步骤创建广告账户、设置账单和审核；政策与可投地区要实时核验。",
          },
          {
            label: "TikTok Business Center 帮助",
            url: "https://businesshelp.tiktok.com/",
            kind: "核验",
            note: "管理广告账户、用户权限、像素和资产，遇到审核问题先查业务帮助中心。",
          },
        ],
      },
      {
        name: "Gmail / Google Workspace",
        category: "邮件",
        description: "使用公司域名邮箱发送开发信和正式报价资料。",
        bestFor: "建立正式可信的 B2B 沟通入口。",
        difficulty: "中等：域名邮箱必须配置 SPF/DKIM/DMARC，冷启动要控制发送量。",
        steps: ["配置公司域名邮箱", "设置 SPF/DKIM/DMARC", "准备签名", "小批量发送", "跟踪回复和退信"],
        links: [{ label: "Google Workspace", url: "https://workspace.google.com/" }],
        tutorials: [
          {
            label: "Google Workspace 管理员帮助",
            url: "https://support.google.com/a/",
            kind: "官方",
            note: "域名验证、用户邮箱、SPF、DKIM 和 DMARC 都应按管理员帮助中心配置。",
          },
          {
            label: "Google 发件人指南",
            url: "https://support.google.com/a/answer/81126",
            kind: "核验",
            note: "批量邮件和开发信要遵守发件人要求，减少进垃圾箱和退信。",
          },
        ],
      },
      {
        name: "WhatsApp Business",
        category: "即时沟通",
        description: "用企业资料、快捷回复、标签管理已建立联系的客户。",
        bestFor: "样品、报价、发货、售后等高频沟通。",
        difficulty: "中等：账号资料、号码稳定性、模板消息和反垃圾限制都要注意。",
        steps: ["注册 Business 账号", "完善公司资料", "设置目录和快捷回复", "给客户打标签", "避免未经许可群发"],
        links: [{ label: "WhatsApp Business", url: "https://www.whatsapp.com/business/" }],
        tutorials: [
          {
            label: "WhatsApp Business 官方入口",
            url: "https://www.whatsapp.com/business/",
            kind: "官方",
            note: "适合用企业资料、商品目录、快捷回复和标签管理已建立联系的客户。",
          },
          {
            label: "WhatsApp 帮助中心",
            url: "https://faq.whatsapp.com/",
            kind: "核验",
            note: "注册、换机、封号、商业功能和隐私规则以官方帮助中心为准。",
          },
        ],
      },
    ],
    pitfalls: [
      "不要第一封邮件塞太多附件，容易进垃圾箱。",
      "不要用私人邮箱代表公司做长期外贸开发。",
      "不要频繁换号、群发、复制粘贴私信，社媒账号容易被限制。",
    ],
  },
  {
    id: "convert",
    index: "05",
    title: "转化客户",
    subtitle: "把陌生信任变成可评估的采购下一步。",
    summary:
      "转化的核心是降低买家的不确定性：你是否可靠、产品是否匹配、价格是否合理、交付是否可控、出了问题谁负责。",
    tags: ["转化", "报价", "样品", "证书", "视频验厂"],
    diagramTitle: "询盘到样品转化",
    diagram: `flowchart TD
  A[收到回复/询盘] --> B[确认用途/规格/数量/国家]
  B --> C[判断客户等级]
  C --> D[发送资料包]
  D --> E[初步报价]
  E --> F{客户是否有明确兴趣}
  F -- 否 --> G[进入培育序列]
  F -- 是 --> H[样品/视频会议/验厂]
  H --> I[正式 PI 或合同]`,
    knowledge: [
      "客户分级看：公司真实性、需求清晰度、采购量、时间线、预算和决策角色。",
      "资料包应包括：公司简介、产品规格、认证、包装、案例、生产视频、FAQ。",
      "报价要明确币种、Incoterms、MOQ、有效期、交期、包装、付款条件和样品政策。",
      "用视频会议和短视频展示工厂、仓库、测试、包装和发货，增强真实感。",
    ],
    beginnerPath: [
      "先准备一个标准资料包，不要每次客户问才临时找图、找证书。",
      "收到询盘先问清用途、数量、国家、规格和时间线，再决定报价深度。",
      "报价单必须写清币种、贸易术语、有效期、付款方式和交期。",
      "样品阶段要记录客户反馈，把高频问题沉淀到 FAQ 和产品页。",
    ],
    tools: [
      {
        name: "Canva",
        category: "资料制作",
        description: "快速制作公司介绍、产品单页、证书展示和案例 PDF。",
        bestFor: "让小团队也能输出统一视觉的销售资料。",
        difficulty: "低到中等：难点在资料真实、版本统一，不是模板好不好看。",
        steps: ["选择 B2B 简洁模板", "替换公司和产品内容", "插入证书和案例", "导出 PDF", "版本号管理"],
        links: [{ label: "Canva", url: "https://www.canva.com/" }],
        tutorials: [
          {
            label: "Canva Design School",
            url: "https://www.canva.com/designschool/",
            kind: "教程",
            note: "适合小白快速做产品单页、公司介绍和案例 PDF，但数据与证书必须人工核验。",
          },
        ],
      },
      {
        name: "Calendly",
        category: "会议预约",
        description: "让客户直接选择会议时间，减少来回沟通。",
        bestFor: "跨时区视频会议和样品评审。",
        difficulty: "低：设置时区、可预约时间和会议链接即可。",
        steps: ["设置可预约时间", "连接日历", "创建会议类型", "发送链接", "会后记录下一步"],
        links: [{ label: "Calendly", url: "https://calendly.com/" }],
        tutorials: [
          {
            label: "Calendly Help",
            url: "https://help.calendly.com/",
            kind: "官方",
            note: "重点看日历连接、时区、会议类型和提醒设置。",
          },
        ],
      },
      {
        name: "Notion / Google Drive",
        category: "资料库",
        description: "管理产品资料、证书、报价模板、客户案例和 FAQ。",
        bestFor: "团队统一口径，避免重复找资料。",
        difficulty: "低到中等：权限、版本号和过期资料清理是关键。",
        steps: ["建立产品资料库", "按品类分类", "设置权限", "放入最新证书和图片", "淘汰过期文件"],
        links: [
          { label: "Notion", url: "https://www.notion.so/" },
          { label: "Google Drive", url: "https://drive.google.com/" },
        ],
        tutorials: [
          {
            label: "Google Drive 帮助",
            url: "https://support.google.com/drive/",
            kind: "官方",
            note: "适合统一管理证书、报价、图片和客户资料，注意外链权限。",
          },
          {
            label: "Notion Help Center",
            url: "https://www.notion.com/help",
            kind: "官方",
            note: "适合做团队知识库、报价模板和 FAQ 页面。",
          },
        ],
      },
    ],
    pitfalls: [
      "不要客户一问就只报最低价，先确认规格和采购场景。",
      "不要发送过期证书、模糊图片或不一致参数。",
      "不要忽视样品体验，样品阶段常常决定大货信任。",
    ],
  },
  {
    id: "deal",
    index: "06",
    title: "交易",
    subtitle: "把口头意向变成清晰、可执行、可追责的交易文件。",
    summary:
      "交易文件要覆盖产品、数量、价格、付款、交期、包装、验货、运输、违约和争议处理。越早写清楚，后面越少扯皮。",
    tags: ["PI", "合同", "Incoterms", "风控"],
    diagramTitle: "B2B 交易确认时序",
    diagram: `sequenceDiagram
  participant B as 买家
  participant S as 供应商
  participant F as 货代/银行
  B->>S: 确认规格/数量/包装
  S->>B: Proforma Invoice
  B->>S: 确认 PI 和付款条件
  B->>F: 安排付款/信用证/货代
  S->>S: 备料生产/质检
  S->>B: 更新生产进度
  S->>F: 订舱/交货/单证
  F-->>B: 提货/清关/派送`,
    knowledge: [
      "PI 至少包含：买卖双方、产品、规格、数量、单价、总价、币种、Incoterms、付款、交期、包装、银行信息。",
      "常见付款：30% 预付 + 70% 发货前，或信用证，或平台担保交易。",
      "Incoterms 决定费用和风险分界，常见有 EXW、FOB、CIF、DAP、DDP。",
      "大额订单要做客户背景、付款路径和制裁/合规风险检查。",
    ],
    beginnerPath: [
      "不要只在聊天里确认订单，至少用 PI 或合同把关键条款写清楚。",
      "贸易术语不懂就先问货代和客户，不要把 DDP、CIF、FOB 混用。",
      "收款账户、公司主体、发票抬头和合同主体要一致，异常情况要书面解释。",
      "大额订单先做合规和付款路径检查，再排产。",
    ],
    tools: [
      {
        name: "ICC Incoterms",
        category: "贸易术语",
        description: "国际商会发布的贸易术语规则官方入口。",
        bestFor: "理解 EXW/FOB/CIF/DAP/DDP 等责任边界。",
        difficulty: "中等偏高：术语影响费用、风险转移和清关责任，不能只凭习惯使用。",
        steps: ["确认买家要求的术语", "核对费用责任", "核对风险转移点", "写入 PI/合同", "与货代确认可执行性"],
        links: [{ label: "Incoterms 2020", url: "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/" }],
        tutorials: [
          {
            label: "ICC Incoterms 官方说明",
            url: "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/",
            kind: "官方",
            note: "贸易术语以 ICC 官方解释为准，实际责任还要写进 PI/合同并和货代确认。",
          },
        ],
      },
      {
        name: "DocuSign",
        category: "电子签",
        description: "用于远程合同签署和文件留痕。",
        bestFor: "需要正式签署合同、NDA、代理协议的客户。",
        difficulty: "中等：需要确认签署主体、签署权限和目标国家认可情况。",
        steps: ["上传合同", "设置签署人", "标注签署位置", "发送签署", "保存审计记录"],
        links: [{ label: "DocuSign", url: "https://www.docusign.com/" }],
        tutorials: [
          {
            label: "DocuSign Support",
            url: "https://support.docusign.com/",
            kind: "官方",
            note: "重点看签署流程、审计记录、身份验证和文件保存。",
          },
        ],
      },
    ],
    pitfalls: [
      "不要收款账户和 PI 公司主体不一致还不解释。",
      "不要把 DDP 当万能方案，税费、清关责任和目的国合规要先确认。",
      "不要在合同里漏掉包装、验货和交期变更条件。",
    ],
  },
  {
    id: "payment",
    index: "07",
    title: "收款",
    subtitle: "收款方式要兼顾成交便利、费用、结算周期和资金安全。",
    summary:
      "B2B 外贸常见收款是 T/T、L/C、平台担保和部分线上收款工具。新客户、大额订单、高风险国家要更谨慎，避免货款、账户和合规风险。",
    tags: ["收款", "T/T", "L/C", "Payoneer", "风控"],
    diagramTitle: "收款风控流程",
    diagram: `flowchart TD
  A[确定订单金额和客户风险] --> B{新客户或大额?}
  B -- 是 --> C[要求预付款/信用证/担保交易]
  B -- 否 --> D[按历史信用给条款]
  C --> E[核对付款主体和银行信息]
  D --> E
  E --> F[到账确认后排产/发货]
  F --> G[保存水单/PI/合同/发票]
  G --> H[异常付款立即暂停交付]`,
    knowledge: [
      "T/T 简单直接，但要核对付款主体、银行信息和到账状态。",
      "L/C 适合大额或信用要求高的订单，但单证要求严格。",
      "Payoneer/Wise 等工具适合部分跨境收款和平台结算，费用和可用地区要按官方说明确认。",
      "任何更换收款账户的请求，都要通过独立渠道二次确认，防止邮件诈骗。",
    ],
    beginnerPath: [
      "第一单优先使用预付款或平台担保，不要给陌生客户过长账期。",
      "付款截图只能作为参考，必须以银行或收款工具实际入账为准。",
      "客户要求更换账户、拆分付款或第三方付款时，暂停发货并二次确认。",
      "每种收款工具的费用、到账时间、可用国家和提现限制都要看官方页面。",
    ],
    tools: [
      {
        name: "Payoneer",
        category: "跨境收款",
        description: "常用于平台和国际业务收款，支持多币种收款能力。",
        bestFor: "平台卖家、跨境服务和部分海外收款场景。",
        difficulty: "中等：KYC、可用币种、费用、提现和平台绑定规则都要核验。",
        steps: ["注册企业账号", "完成 KYC", "查看可用收款账户", "绑定平台或发送收款信息", "核对费用和提现路径"],
        links: [{ label: "Payoneer", url: "https://www.payoneer.com/marketplace/get-paid-by-marketplaces/" }],
        tutorials: [
          {
            label: "Payoneer 官方帮助",
            url: "https://payoneer.custhelp.com/",
            kind: "官方",
            note: "注册、KYC、收款账户、费用和提现规则以官方帮助中心为准。",
          },
        ],
      },
      {
        name: "Wise Business",
        category: "多币种账户",
        description: "提供部分国家和币种的商业收付款能力。",
        bestFor: "小额、多币种、服务费敏感的业务场景。",
        difficulty: "中等：部分功能和账户详情会按公司注册地、币种和审核结果变化。",
        steps: ["注册 Business 账号", "完成企业验证", "开通可用币种", "发送收款资料", "导出交易记录"],
        links: [{ label: "Wise Business", url: "https://wise.com/business/" }],
        tutorials: [
          {
            label: "Wise Business 帮助",
            url: "https://wise.com/help/",
            kind: "官方",
            note: "看清楚企业验证、币种、费用、到账时间和可用地区。",
          },
        ],
      },
      {
        name: "PayPal Business",
        category: "线上收款",
        description: "海外买家熟悉，但要注意争议、拒付和账户风控。",
        bestFor: "样品费、小额订单或买家强要求 PayPal 的场景。",
        difficulty: "中等偏高：争议、拒付、账户限制和卖家保护条件要提前理解。",
        steps: ["注册 Business 账号", "完成验证", "设置收款链接或发票", "保留发货证明", "关注争议期限"],
        links: [{ label: "PayPal Business", url: "https://www.paypal.com/business" }],
        tutorials: [
          {
            label: "PayPal Business Help",
            url: "https://www.paypal.com/us/cshelp/business",
            kind: "官方",
            note: "重点看账户验证、费用、发票、争议处理和卖家保护条件。",
          },
        ],
      },
    ],
    pitfalls: [
      "不要在未确认到账前发货，截图不等于到账。",
      "不要忽略邮件账户被盗导致的改账户诈骗。",
      "不要把个人账户长期用于公司外贸收款。",
    ],
  },
  {
    id: "shipping",
    index: "08",
    title: "发货",
    subtitle: "发货不是把货交出去，而是把费用、时效、单证和风险一起管理。",
    summary:
      "不同订单选择不同物流：样品常用快递，小批量可空运，大货多走海运或铁路。要提前确认计费重、包装、目的国清关、保险和单证。",
    tags: ["物流", "货代", "单证", "DDP", "海运"],
    diagramTitle: "出货协同流程",
    diagram: `flowchart LR
  A[订单确认] --> B[确认 Incoterms 和运输方式]
  B --> C[包装/唛头/箱规]
  C --> D[订舱或下快递单]
  D --> E[出货前验货]
  E --> F[交货给货代/快递]
  F --> G[提供提单/追踪号/单证]
  G --> H[跟踪到港/清关/签收]`,
    knowledge: [
      "样品优先看时效和可追踪，大货优先看总成本、清关能力和稳定性。",
      "箱规、毛重、净重、HS Code、材质、用途会影响报价和清关。",
      "DDP 要特别确认目的国税费、合规责任、末端派送和异常处理。",
      "出货前拍照/视频留档：外箱、唛头、数量、封箱、装柜。",
    ],
    beginnerPath: [
      "样品先用快递跑通寄送、清关和客户签收体验。",
      "大货询价前准备箱规、重量、HS Code、目的港/地址和贸易术语。",
      "DDP 报价一定问清是否包含关税、VAT/GST、清关、末端派送和异常费。",
      "发货后把追踪号、单证和预计到达时间同步给客户。",
    ],
    tools: [
      {
        name: "DHL Express",
        category: "国际快递",
        description: "适合样品、小件、高时效订单。",
        bestFor: "样品寄送和紧急补货。",
        difficulty: "中等：材质、申报、目的国限制和偏远附加费会影响成本与时效。",
        steps: ["确认尺寸重量", "询价", "准备商业发票", "下单取件", "把追踪号发给客户"],
        links: [{ label: "DHL", url: "https://www.dhl.com/" }],
        tutorials: [
          {
            label: "DHL 官方帮助",
            url: "https://www.dhl.com/",
            kind: "官方",
            note: "寄样品前核对目的国限制、清关资料、追踪和附加费。",
          },
        ],
      },
      {
        name: "17TRACK",
        category: "物流追踪",
        description: "跨承运商包裹追踪工具，方便客服查询。",
        bestFor: "售后跟踪、客户催单和物流状态确认。",
        difficulty: "低：适合查状态，但异常处理仍要联系承运商或货代。",
        steps: ["输入追踪号", "识别承运商", "复制状态给客户", "异常件联系货代", "记录处理结果"],
        links: [{ label: "17TRACK", url: "https://www.17track.net/" }],
        tutorials: [
          {
            label: "17TRACK 查询入口",
            url: "https://www.17track.net/",
            kind: "教程",
            note: "可用于统一查询包裹状态，异常原因以承运商和货代反馈为准。",
          },
        ],
      },
      {
        name: "Flexport",
        category: "数字货代",
        description: "提供国际货运和供应链管理服务。",
        bestFor: "希望数字化管理海运/空运进度的团队。",
        difficulty: "中等偏高：适合有稳定出货量和明确单证流程的团队。",
        steps: ["准备货物信息", "获取报价", "确认服务条款", "上传单证", "跟踪运输节点"],
        links: [{ label: "Flexport", url: "https://www.flexport.com/" }],
        tutorials: [
          {
            label: "Flexport Learning Center",
            url: "https://www.flexport.com/learn/",
            kind: "教程",
            note: "适合学习海运、空运、清关和供应链基础概念。",
          },
        ],
      },
    ],
    pitfalls: [
      "不要只看运费单价，不看附加费、偏远费、关税和异常费。",
      "不要让客户收到货才发现包装、标签或说明书不符合当地要求。",
      "不要忘记同步追踪号和预计到达时间。",
    ],
  },
  {
    id: "after-sales",
    index: "09",
    title: "售后与复购",
    subtitle: "售后不是成本中心，是复购和转介绍的入口。",
    summary:
      "B2B 售后要快速定位责任、提供证据、给出方案并沉淀改进。处理得好，客户会更愿意给下一单。",
    tags: ["售后", "复购", "质量", "客户维护"],
    diagramTitle: "售后处理闭环",
    diagram: `flowchart TD
  A[客户反馈问题] --> B[收集照片/视频/批次/数量]
  B --> C[判断物流/使用/生产/预期差]
  C --> D[内部复盘责任和成本]
  D --> E[提出补发/折扣/退款/技术支持]
  E --> F[客户确认方案]
  F --> G[执行并跟踪]
  G --> H[更新 FAQ/质检/包装/说明书]
  H --> I[定期回访争取复购]`,
    knowledge: [
      "售后第一响应要快，即使不能马上解决，也要告诉客户处理时间线。",
      "建立问题分类：物流损坏、数量短缺、质量缺陷、使用误解、规格不符。",
      "高频问题要反哺产品页、说明书、包装、质检标准和报价条款。",
      "每个成交客户都要有复购节奏：到货确认、使用反馈、补货提醒、新品推荐。",
    ],
    beginnerPath: [
      "售后先收集事实：订单号、批次、照片、视频、数量、使用场景和客户诉求。",
      "给客户一个处理时间线，即使需要内部调查也不要沉默。",
      "处理完要写复盘：责任归因、补救成本、下次如何避免。",
      "把成交客户放入复购节奏，到货、使用、补货节点都要有提醒。",
    ],
    tools: [
      {
        name: "Zendesk",
        category: "客服工单",
        description: "管理邮件、工单、FAQ 和售后流程。",
        bestFor: "订单和客户数量增加后的售后协作。",
        difficulty: "中等：需要先定义问题分类、责任人和 SLA。",
        steps: ["接入客服邮箱", "创建问题分类", "设置模板回复", "分配责任人", "统计高频问题"],
        links: [{ label: "Zendesk", url: "https://www.zendesk.com/" }],
        tutorials: [
          {
            label: "Zendesk Help Center",
            url: "https://support.zendesk.com/",
            kind: "官方",
            note: "先学工单、宏、视图和知识库，再逐步做自动化。",
          },
        ],
      },
      {
        name: "HubSpot CRM",
        category: "CRM",
        description: "记录客户、交易、任务、邮件和复购跟进。",
        bestFor: "从线索开发到老客户复购的一体化管理。",
        difficulty: "中等：关键是团队持续录入和统一交易阶段。",
        steps: ["导入客户", "建立交易阶段", "设置跟进任务", "记录沟通", "按月份复盘复购机会"],
        links: [{ label: "HubSpot", url: "https://www.hubspot.com/products/crm" }],
        tutorials: [
          {
            label: "HubSpot Academy",
            url: "https://academy.hubspot.com/",
            kind: "教程",
            note: "适合系统学习 CRM、销售管道、邮件跟进和客户维护。",
          },
          {
            label: "HubSpot Knowledge Base",
            url: "https://knowledge.hubspot.com/",
            kind: "官方",
            note: "具体字段、导入、任务、邮件同步和权限设置以官方知识库为准。",
          },
        ],
      },
      {
        name: "Google Forms",
        category: "反馈收集",
        description: "收集客户反馈、样品评价、售后问题和满意度。",
        bestFor: "低成本标准化售后信息收集。",
        difficulty: "低：适合快速收集结构化反馈，但要注意文件上传权限。",
        steps: ["创建反馈表", "要求上传图片/视频链接", "收集批次信息", "导出表格", "同步内部处理"],
        links: [{ label: "Google Forms", url: "https://forms.google.com/" }],
        tutorials: [
          {
            label: "Google Forms 帮助",
            url: "https://support.google.com/docs/topic/9055404",
            kind: "官方",
            note: "学习题型、文件上传、表格同步和权限设置。",
          },
        ],
      },
    ],
    pitfalls: [
      "不要一开始就争辩责任，先收集事实并安抚客户。",
      "不要重复处理同类问题却不改质检或包装。",
      "不要成交后长期不联系客户，复购机会会被竞争对手拿走。",
    ],
  },
];

export const officialSources: ToolLink[] = [
  { label: "Meta Business Help", url: "https://www.facebook.com/business/help" },
  { label: "Facebook Page 官方创建指南", url: "https://www.facebook.com/help/104002523024878" },
  { label: "TikTok Business Help", url: "https://businesshelp.tiktok.com/" },
  { label: "Alibaba.com Seller Central", url: "https://seller.alibaba.com/?lang=en" },
  { label: "LinkedIn Pages Help", url: "https://www.linkedin.com/help/linkedin/answer/a543852" },
  { label: "Google 发件人指南", url: "https://support.google.com/a/answer/81126" },
  { label: "Payoneer Marketplace Payouts", url: "https://www.payoneer.com/marketplace/get-paid-by-marketplaces/" },
  { label: "ICC Incoterms 2020", url: "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/" },
  { label: "DHL Global Connectedness", url: "https://www.dhl.com/globalconnectedness" },
];
