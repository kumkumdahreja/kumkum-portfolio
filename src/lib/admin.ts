// Shared types & helpers for the admin panel (DB row shapes).

export type Stage = "onboarding" | "design" | "development" | "review" | "delivered";
export type PaymentStatus = "pending" | "advance" | "settled" | "na";
export type DealStatus = "planned" | "shoot_done" | "editing" | "posted" | "done" | "cancelled";
export type DealPayment = "na" | "pending" | "partial" | "received";
export type DealType = "paid" | "barter" | "ugc" | "paid_barter";
export type Deliverable = { label: string; done: boolean };

export type ProjectPrivate = {
  client: string;
  source: "direct" | "upwork" | "agency" | "personal";
  stage: Stage;
  repo_url: string;
  start_date: string | null;
  due_date: string | null;
  delivered_date: string | null;
  amount: number;
  received: number;
  payment_status: PaymentStatus;
  notes: string;
};

export type ProjectRow = {
  id: string;
  slug: string | null;
  title: string;
  kind: string;
  category: "web" | "shopify" | "wordpress" | "app" | "design";
  image_url: string;
  live_url: string;
  summary: string;
  stack: string[];
  featured: boolean;
  status: "live" | "in-progress";
  published: boolean;
  sort: number;
  created_at: string;
  project_private: ProjectPrivate | ProjectPrivate[] | null;
};

export type CollabRow = {
  id: string;
  name: string;
  category: "cafe" | "brand" | "modelling" | "ugc";
  show_on_site: boolean;
  sort: number;
};

export type DealRow = {
  id: string;
  collab_id: string;
  title: string;
  deal_type: DealType;
  status: DealStatus;
  deliverables: Deliverable[];
  shoot_date: string | null;
  due_date: string | null;
  posted_date: string | null;
  amount: number;
  received: number;
  payment_status: DealPayment;
  invoice_sent: boolean;
  barter_details: string;
  barter_value: number;
  contact_name: string;
  contact_phone: string;
  post_url: string;
  views: number | null;
  notes: string;
  created_at: string;
  collabs?: { name: string; category: string } | null;
};

export type ReelRow = {
  id: string;
  code: string;
  category: CollabRow["category"];
  partner: string;
  note: string;
  thumb_url: string;
  featured: boolean;
  sort: number;
};

export const privateOf = (p: ProjectRow): ProjectPrivate | null =>
  Array.isArray(p.project_private) ? p.project_private[0] ?? null : p.project_private;

export const stages: { id: Stage; label: string; tone: string }[] = [
  { id: "onboarding", label: "Onboarding", tone: "bg-sky" },
  { id: "design", label: "Design", tone: "bg-lavender" },
  { id: "development", label: "Development", tone: "bg-butter" },
  { id: "review", label: "Review", tone: "bg-peach" },
  { id: "delivered", label: "Delivered", tone: "bg-mint" },
];

export const dealStatuses: { id: DealStatus; label: string; tone: string }[] = [
  { id: "planned", label: "Planned", tone: "bg-sky" },
  { id: "shoot_done", label: "Shoot done", tone: "bg-lavender" },
  { id: "editing", label: "Editing", tone: "bg-butter" },
  { id: "posted", label: "Posted", tone: "bg-peach" },
  { id: "done", label: "Done", tone: "bg-mint" },
  { id: "cancelled", label: "Cancelled", tone: "bg-line" },
];

export const dealTypes: { id: DealType; label: string }[] = [
  { id: "barter", label: "Barter" },
  { id: "paid", label: "Paid" },
  { id: "paid_barter", label: "Paid + barter" },
  { id: "ugc", label: "UGC" },
];

export const categoryLabels: Record<CollabRow["category"], string> = {
  cafe: "Café / restaurant",
  brand: "Brand",
  modelling: "Modelling",
  ugc: "UGC",
};

export const deliverablePresets = ["Reel", "Story", "Post", "Collab post", "Raw UGC", "Google review", "Zomato review"];

export const rupees = (n: number) =>
  `₹${Math.round(n || 0).toLocaleString("en-IN")}`;

export const isPaidDeal = (d: Pick<DealRow, "deal_type" | "amount">) =>
  d.deal_type === "paid" || d.deal_type === "paid_barter" || d.amount > 0;

export const dealOutstanding = (d: DealRow) =>
  d.status === "cancelled" || !isPaidDeal(d) ? 0 : Math.max(0, (d.amount || 0) - (d.received || 0));

export const pendingDeliverables = (d: DealRow) =>
  d.status === "cancelled" ? 0 : (d.deliverables || []).filter((x) => !x.done).length;

export const fmtDate = (d: string | null) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";

export const isOverdue = (d: string | null) => !!d && new Date(d + "T23:59:59") < new Date();
