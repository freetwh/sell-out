"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type GlossaryTerm = {
  term: string;
  explanation: string;
};

const GLOSSARY: GlossaryTerm[] = [
  { term: "Alibaba.com", explanation: "阿里巴巴国际站，面向全球买家的 B2B 外贸平台。" },
  { term: "Made-in-China", explanation: "中国制造网，海外买家寻找中国供应商的 B2B 平台。" },
  { term: "Google Search Console", explanation: "Google 官方站长工具，用于查看网站收录、搜索词和技术问题。" },
  { term: "Google Trends", explanation: "Google 趋势工具，用于观察关键词热度、地区差异和季节变化。" },
  { term: "Google Workspace", explanation: "Google 企业办公套件，常用于公司域名邮箱、日历和云端协作。" },
  { term: "LinkedIn", explanation: "职业社交平台，外贸中常用于找公司、找决策人和建立信任。" },
  { term: "Facebook", explanation: "Meta 旗下社交平台，常用于公司主页、群组、广告和客户消息触达。" },
  { term: "Instagram", explanation: "Meta 旗下图片和短视频平台，适合视觉展示强的产品获客。" },
  { term: "TikTok", explanation: "短视频平台，适合消费品、轻定制和视觉化产品做内容或广告测试。" },
  { term: "WhatsApp Business", explanation: "WhatsApp 企业版，用于企业资料、快捷回复、标签和客户沟通管理。" },
  { term: "WhatsApp", explanation: "海外常用即时通讯工具，外贸中适合已建立关系后的快速跟进。" },
  { term: "Payoneer", explanation: "跨境收款服务商，常用于平台结算和多币种收款场景。" },
  { term: "Wise Business", explanation: "Wise 企业账户，提供部分地区和币种的商业收付款能力。" },
  { term: "PayPal Business", explanation: "PayPal 企业账户，适合部分小额订单、样品费和海外买家熟悉的线上付款。" },
  { term: "DHL Express", explanation: "国际快递服务，常用于样品、小件和高时效订单。" },
  { term: "ImportYeti", explanation: "美国进口记录查询工具，可辅助发现进口商和竞品供应链关系。" },
  { term: "HubSpot CRM", explanation: "客户关系管理系统，用于管理线索、交易、任务和复购跟进。" },
  { term: "Zendesk", explanation: "客服工单系统，用于管理售后问题、FAQ 和客户服务流程。" },
  { term: "DocuSign", explanation: "电子签平台，用于远程合同、NDA 或代理协议签署留痕。" },
  { term: "Flexport", explanation: "数字货代和供应链服务平台，用于管理国际运输节点和单证。" },
  { term: "Canva", explanation: "在线设计工具，可快速制作公司介绍、产品单页和案例资料。" },
  { term: "Calendly", explanation: "会议预约工具，让客户自行选择可用时间并生成日历邀请。" },
  { term: "Notion", explanation: "协作文档和知识库工具，可用于产品资料库、FAQ 和销售模板管理。" },
  { term: "Google Drive", explanation: "Google 云盘，用于存放和分享证书、图片、报价和客户资料。" },
  { term: "Google Forms", explanation: "Google 表单，用于收集客户反馈、样品评价和售后信息。" },
  { term: "17TRACK", explanation: "跨承运商物流追踪工具，用于查询包裹状态和同步客户。" },
  { term: "B2B", explanation: "Business to Business，企业对企业的交易模式。" },
  { term: "B2C", explanation: "Business to Consumer，企业直接面向消费者的交易模式。" },
  { term: "OEM", explanation: "Original Equipment Manufacturer，按客户品牌或要求代工生产。" },
  { term: "ODM", explanation: "Original Design Manufacturer，供应商提供设计和生产，客户贴牌销售。" },
  { term: "RFQ", explanation: "Request for Quotation，询价请求；平台或买家向供应商索取报价。" },
  { term: "CRM", explanation: "Customer Relationship Management，客户关系管理系统或表格。" },
  { term: "ICP", explanation: "Ideal Customer Profile，理想客户画像，用来定义最值得开发的客户类型。" },
  { term: "MOQ", explanation: "Minimum Order Quantity，最小起订量。" },
  { term: "SKU", explanation: "Stock Keeping Unit，库存或产品管理中的最小品项单位。" },
  { term: "SEO", explanation: "Search Engine Optimization，搜索引擎优化，用于提升官网自然搜索曝光。" },
  { term: "FAQ", explanation: "Frequently Asked Questions，常见问题和标准回答。" },
  { term: "PDF", explanation: "便携式文档格式，常用于产品单页、报价单和公司资料。" },
  { term: "Page", explanation: "社交平台中的公司主页或品牌主页。" },
  { term: "Messenger", explanation: "Meta 的消息工具，常用于 Facebook Page 客户沟通。" },
  { term: "Business Portfolio", explanation: "Meta 企业资产管理结构，用于管理主页、广告账户、权限等资产。" },
  { term: "Business Center", explanation: "TikTok 等平台的企业中心，用于管理广告账户、权限和像素资产。" },
  { term: "Ads Manager", explanation: "广告管理后台，用于创建、投放和分析广告活动。" },
  { term: "Banner", explanation: "主页或广告中的横幅视觉图，通常承载品牌或活动信息。" },
  { term: "Logo", explanation: "品牌标识，外贸资料和主页中用于建立一致识别。" },
  { term: "IP", explanation: "网络访问地址；频繁变化可能触发部分平台风控。" },
  { term: "VPN", explanation: "虚拟专用网络；跨境访问时应注意合规性和账号风控。" },
  { term: "IP", explanation: "网络访问地址；频繁变化可能触发部分平台风控。" },
  { term: "PI", explanation: "Proforma Invoice，形式发票，用于确认产品、金额、付款和交付条款。" },
  { term: "Proforma Invoice", explanation: "形式发票，通常简称 PI，是外贸交易确认的重要文件。" },
  { term: "Incoterms", explanation: "国际贸易术语规则，定义买卖双方费用、风险和责任边界。" },
  { term: "EXW", explanation: "工厂交货，买方承担从卖方场所提货后的主要运输和风险。" },
  { term: "FOB", explanation: "船上交货，卖方负责将货物装上指定船舶，之后风险转移给买方。" },
  { term: "CIF", explanation: "成本、保险加运费，卖方承担到目的港的运费和最低保险。" },
  { term: "DAP", explanation: "目的地交货，卖方负责将货物运至指定目的地但通常不含进口清关税费。" },
  { term: "DDP", explanation: "完税后交货，卖方承担目的国清关、税费和交付责任，风险最高。" },
  { term: "NDA", explanation: "Non-Disclosure Agreement，保密协议。" },
  { term: "T/T", explanation: "Telegraphic Transfer，电汇，是外贸常见银行转账方式。" },
  { term: "L/C", explanation: "Letter of Credit，信用证，由银行按单证条件承诺付款。" },
  { term: "KYC", explanation: "Know Your Customer，了解你的客户，常用于账户审核和合规验证。" },
  { term: "HS Code", explanation: "海关商品编码，用于报关、税率、监管条件和物流报价。" },
  { term: "VAT", explanation: "Value Added Tax，增值税，常见于欧盟、英国等市场。" },
  { term: "GST", explanation: "Goods and Services Tax，商品及服务税，常见于澳大利亚、加拿大等市场。" },
  { term: "SLA", explanation: "Service Level Agreement，服务级别协议，定义响应和处理时限。" },
  { term: "sitemap", explanation: "网站地图文件，帮助搜索引擎发现和理解网站页面。" },
  { term: "hashtag", explanation: "社交媒体标签，常用于按话题或品类发现内容。" },
  { term: "AI", explanation: "人工智能，可辅助研究、写作和整理，但业务承诺需人工核验。" },
];

const TERMS = Array.from(new Map(GLOSSARY.map((item) => [item.term.toLowerCase(), item])).values()).sort(
  (a, b) => b.term.length - a.term.length,
);

function isAsciiWord(value: string) {
  return /^[A-Za-z0-9]$/.test(value);
}

function hasWordBoundary(text: string, start: number, end: number, term: string) {
  if (!/^[A-Za-z0-9]/.test(term) && !/[A-Za-z0-9]$/.test(term)) return true;
  const before = start > 0 ? text[start - 1] : "";
  const after = end < text.length ? text[end] : "";
  return !isAsciiWord(before) && !isAsciiWord(after);
}

function splitTerms(text: string) {
  const parts: Array<string | GlossaryTerm> = [];
  let index = 0;

  while (index < text.length) {
    const match = TERMS.find((item) => {
      const candidate = text.slice(index, index + item.term.length);
      return candidate.toLowerCase() === item.term.toLowerCase() && hasWordBoundary(text, index, index + item.term.length, item.term);
    });

    if (!match) {
      const last = parts[parts.length - 1];
      if (typeof last === "string") parts[parts.length - 1] = last + text[index];
      else parts.push(text[index]);
      index += 1;
      continue;
    }

    parts.push(match);
    index += match.term.length;
  }

  return parts;
}

function Term({ term, children }: { term: GlossaryTerm; children: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <span
          className="term-trigger"
          tabIndex={0}
          role="button"
          aria-label={`${children}：${term.explanation}`}
          onClick={(event) => {
            event.stopPropagation();
            setOpen((value) => !value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              setOpen((value) => !value);
            }
            if (event.key === "Escape") setOpen(false);
          }}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        <strong>{children}</strong>
        <span>{term.explanation}</span>
      </TooltipContent>
    </Tooltip>
  );
}

export function TermText({ children }: { children: string }) {
  const parts = useMemo(() => splitTerms(children), [children]);

  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === "string") return part;
        const text = children.slice(
          parts.slice(0, index).reduce((length, item) => length + (typeof item === "string" ? item.length : item.term.length), 0),
          parts.slice(0, index).reduce((length, item) => length + (typeof item === "string" ? item.length : item.term.length), 0) + part.term.length,
        );
        return (
          <Term key={`${part.term}-${index}`} term={part}>
            {text}
          </Term>
        );
      })}
    </>
  );
}

export function termText(value: string): ReactNode {
  return <TermText>{value}</TermText>;
}
