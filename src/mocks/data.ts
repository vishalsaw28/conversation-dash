import type { Conversation } from "../types";

const now = new Date();
const minsAgo = (m: number) =>
  new Date(now.getTime() - m * 60_000).toISOString();

export const MOCK_AGENTS = [
  { id: "agent_1", name: "You (Priya S.)" },
  { id: "agent_2", name: "Marcus T." },
  { id: "agent_3", name: "Aiko R." },
];

export const CURRENT_AGENT_ID = "agent_1";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_001",
    customer: {
      name: "Rahul Mehta",
      email: "rahul@acmecorp.com",
      avatarInitials: "RM",
    },
    channel: "chat",
    status: "waiting",
    priority: "critical",
    urgencyScore: 97,
    subject: "Payment gateway completely broken — losing orders",
    lastMessage:
      "This is unacceptable. We are losing ₹50k per hour. I need someone NOW.",
    waitingSince: minsAgo(47),
    updatedAt: minsAgo(3),
    assignedTo: null,
    tags: ["enterprise", "payment", "P0"],
    sentiment: "very_negative",
    csatRisk: true,
    escalationReason: "AI confidence < 40% + customer anger detected",
    _failWrites: false,
    messages: [
      {
        id: "m1",
        role: "customer",
        content:
          "Our payment gateway is returning 502 errors on every transaction.",
        timestamp: minsAgo(47),
      },
      {
        id: "m2",
        role: "bot",
        content:
          "I understand you're having trouble with payments. Let me check your account status.",
        timestamp: minsAgo(46),
      },
      {
        id: "m3",
        role: "customer",
        content:
          'You\'ve been "checking" for 40 minutes. Do you even have a human I can talk to?',
        timestamp: minsAgo(10),
      },
      {
        id: "m4",
        role: "bot",
        content: "I'm escalating this to a human agent right away.",
        timestamp: minsAgo(9),
      },
      {
        id: "m5",
        role: "customer",
        content:
          "This is unacceptable. We are losing ₹50k per hour. I need someone NOW.",
        timestamp: minsAgo(3),
      },
    ],
  },
  {
    id: "conv_002",
    customer: {
      name: "Sarah Chen",
      email: "schen@globalretail.io",
      avatarInitials: "SC",
    },
    channel: "email",
    status: "waiting",
    priority: "high",
    urgencyScore: 81,
    subject: "Bulk export stuck at 0% for 2 hours",
    lastMessage: "I have a board presentation in 3 hours and need this data.",
    waitingSince: minsAgo(120),
    updatedAt: minsAgo(15),
    assignedTo: null,
    tags: ["enterprise", "export", "time-sensitive"],
    sentiment: "negative",
    csatRisk: true,
    escalationReason: "Wait time > 2h + deadline mentioned",
    messages: [
      {
        id: "m1",
        role: "customer",
        content:
          "I started a bulk export at 9am and it's been stuck at 0% for two hours now.",
        timestamp: minsAgo(120),
      },
      {
        id: "m2",
        role: "bot",
        content:
          "I can see the export job ID 7731. It appears to be queued. Expected wait is 15–30 minutes.",
        timestamp: minsAgo(118),
      },
      {
        id: "m3",
        role: "customer",
        content:
          "It's been TWO HOURS. I have a board presentation in 3 hours and need this data.",
        timestamp: minsAgo(15),
      },
    ],
  },
  {
    id: "conv_003",
    customer: {
      name: "James Okoye",
      email: "jokoye@fintech.ng",
      avatarInitials: "JO",
    },
    channel: "whatsapp",
    status: "in_progress",
    priority: "high",
    urgencyScore: 74,
    subject: "Account locked after failed 2FA — can't access funds",
    lastMessage: "Still waiting for the unlock code. It's been 20 mins.",
    waitingSince: minsAgo(65),
    updatedAt: minsAgo(5),
    assignedTo: "agent_2",
    tags: ["fintech", "security", "account-access"],
    sentiment: "negative",
    csatRisk: true,
    escalationReason: "Security-related, AI cannot verify identity",
    messages: [
      {
        id: "m1",
        role: "customer",
        content:
          "My account got locked after I mistyped my 2FA code 3 times. I can't access my funds.",
        timestamp: minsAgo(65),
      },
      {
        id: "m2",
        role: "bot",
        content:
          "For security reasons, I'm escalating this to a human agent who can verify your identity.",
        timestamp: minsAgo(63),
      },
      {
        id: "m3",
        role: "agent",
        content:
          "Hi James, I'm Marcus. I'm pulling up your account now and will send an unlock code to your registered email.",
        timestamp: minsAgo(25),
      },
      {
        id: "m4",
        role: "customer",
        content: "Still waiting for the unlock code. It's been 20 mins.",
        timestamp: minsAgo(5),
      },
    ],
  },
  {
    id: "conv_004",
    customer: {
      name: "Priya Nair",
      email: "pnair@startup.in",
      avatarInitials: "PN",
    },
    channel: "chat",
    status: "waiting",
    priority: "medium",
    urgencyScore: 52,
    subject: "API rate limits seem wrong on Pro plan",
    lastMessage: "Can you confirm what the actual limits are for my tier?",
    waitingSince: minsAgo(28),
    updatedAt: minsAgo(28),
    assignedTo: null,
    tags: ["api", "billing", "pro-plan"],
    sentiment: "neutral",
    csatRisk: false,
    escalationReason: "Billing-related question, needs human verification",
    messages: [
      {
        id: "m1",
        role: "customer",
        content:
          "I upgraded to Pro yesterday but I'm still hitting the same rate limits as the free plan.",
        timestamp: minsAgo(28),
      },
      {
        id: "m2",
        role: "bot",
        content:
          "I see your account was upgraded. Rate limit changes can take up to 24 hours to propagate. If it's been longer, a human agent can investigate.",
        timestamp: minsAgo(27),
      },
      {
        id: "m3",
        role: "customer",
        content: "Can you confirm what the actual limits are for my tier?",
        timestamp: minsAgo(28),
      },
    ],
  },
  {
    id: "conv_005",
    customer: {
      name: "Tomás Herrera",
      email: "tomas@latinshop.mx",
      avatarInitials: "TH",
    },
    channel: "chat",
    status: "waiting",
    priority: "medium",
    urgencyScore: 45,
    subject: "Spanish language bot giving wrong translations",
    lastMessage:
      'The bot keeps saying "su pedido está listo" even when items are out of stock.',
    waitingSince: minsAgo(55),
    updatedAt: minsAgo(20),
    assignedTo: null,
    tags: ["localization", "bug", "spanish"],
    sentiment: "negative",
    csatRisk: false,
    escalationReason: "Bug report, AI couldn't reproduce",
    messages: [
      {
        id: "m1",
        role: "customer",
        content:
          "Your bot is giving customers wrong order status in Spanish. It says orders are ready when they're not.",
        timestamp: minsAgo(55),
      },
      {
        id: "m2",
        role: "bot",
        content:
          "Thank you for reporting this. I'm escalating to a human agent to investigate the localization issue.",
        timestamp: minsAgo(54),
      },
      {
        id: "m3",
        role: "customer",
        content:
          'The bot keeps saying "su pedido está listo" even when items are out of stock.',
        timestamp: minsAgo(20),
      },
    ],
  },
  {
    id: "conv_006",
    customer: {
      name: "Fatima Al-Rashid",
      email: "fatima@menatrade.ae",
      avatarInitials: "FA",
    },
    channel: "voice",
    status: "waiting",
    priority: "low",
    urgencyScore: 22,
    subject: "Question about invoice format for VAT compliance",
    lastMessage:
      "Please send me the updated invoice template when you get a chance.",
    waitingSince: minsAgo(90),
    updatedAt: minsAgo(80),
    assignedTo: null,
    tags: ["invoicing", "compliance", "uae"],
    sentiment: "neutral",
    csatRisk: false,
    escalationReason:
      "Legal/compliance question, AI not trained on UAE VAT rules",
    messages: [
      {
        id: "m1",
        role: "customer",
        content:
          "We need our invoices to include a specific VAT registration number field for UAE compliance.",
        timestamp: minsAgo(90),
      },
      {
        id: "m2",
        role: "bot",
        content:
          "This is a compliance question I'm not fully equipped to answer. Routing you to a specialist.",
        timestamp: minsAgo(89),
      },
      {
        id: "m3",
        role: "customer",
        content:
          "Please send me the updated invoice template when you get a chance.",
        timestamp: minsAgo(80),
      },
    ],
  },
  {
    id: "conv_007",
    customer: {
      name: "Derek Walsh",
      email: "dwalsh@irishbrands.ie",
      avatarInitials: "DW",
    },
    channel: "email",
    status: "snoozed",
    priority: "medium",
    urgencyScore: 38,
    subject: "Bulk SMS campaign quota increase request",
    lastMessage: "Waiting to hear back after submitting the usage form.",
    waitingSince: minsAgo(200),
    updatedAt: minsAgo(60),
    assignedTo: "agent_1",
    tags: ["sms", "quota", "campaign"],
    sentiment: "neutral",
    csatRisk: false,
    escalationReason: "Quota increase requires manual approval",
    messages: [
      {
        id: "m1",
        role: "customer",
        content:
          "We need to increase our monthly SMS quota from 10k to 50k for an upcoming campaign.",
        timestamp: minsAgo(200),
      },
      {
        id: "m2",
        role: "agent",
        content:
          "Hi Derek, I've submitted the quota increase request. You'll need to fill out this usage form: [link]. I'll follow up once approved.",
        timestamp: minsAgo(180),
      },
      {
        id: "m3",
        role: "customer",
        content: "Waiting to hear back after submitting the usage form.",
        timestamp: minsAgo(60),
      },
    ],
  },
  {
    id: "conv_008",
    customer: {
      name: "Yuki Tanaka",
      email: "ytanaka@techcorp.jp",
      avatarInitials: "YT",
    },
    channel: "chat",
    status: "waiting",
    priority: "critical",
    urgencyScore: 89,
    subject: "Production bot loop crashing — 500 errors every 30 seconds",
    lastMessage:
      "Engineering is watching the logs. We need a fix or rollback NOW.",
    waitingSince: minsAgo(18),
    updatedAt: minsAgo(2),
    assignedTo: null,
    tags: ["production", "outage", "engineering", "P0"],
    sentiment: "very_negative",
    csatRisk: true,
    escalationReason: "Production outage, AI confidence 0%",
    _failWrites: true,
    messages: [
      {
        id: "m1",
        role: "customer",
        content:
          "Our production bot is in a crash loop. Every 30 seconds we get a 500 error and it restarts.",
        timestamp: minsAgo(18),
      },
      {
        id: "m2",
        role: "bot",
        content:
          "This sounds like a critical issue. Escalating to engineering support immediately.",
        timestamp: minsAgo(17),
      },
      {
        id: "m3",
        role: "customer",
        content:
          "Engineering is watching the logs. We need a fix or rollback NOW.",
        timestamp: minsAgo(2),
      },
    ],
  },
];
