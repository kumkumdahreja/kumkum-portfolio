// Mirrors the planned `social_collabs` table.
export type CollabCategory = "cafe" | "brand" | "modelling" | "ugc";

export type Collab = { name: string; category: CollabCategory };

const cafes = [
  "Rowdy Cafe", "Creme Cafe", "Gelato Genie", "Nero Cafe", "Tresso Coffee",
  "The Coffee Vault", "Aam Dining", "Sky Walk", "Burger Munk", "Kumudam Restaurant",
  "Coco India", "Ayaan Imli", "Walk in the Village", "Bento Cakery", "Krishna Bhog",
  "Hermits Cafe", "Sheroes Cafe", "Plikur", "The Harry's Spoon", "Cravize",
  "Tealogy", "Curious Mug", "Kolam", "Hunger Hub", "Canvas Canes",
  "The Crush Coffee", "Do Lamhe", "Fikora Coffee", "Uppam", "Arovaa",
  "Smoocho", "Yukai", "The Dark Room",
];

const brands = [
  "Dot & Key", "Himalaya", "Swiss Beauty", "Wishcare", "Joy", "Jiden", "DeoDap", "True Hunt",
];

export const collabs: Collab[] = [
  ...cafes.map((name) => ({ name, category: "cafe" as const })),
  ...brands.map((name) => ({ name, category: "brand" as const })),
  { name: "Makeup by Ruhi Gujjar", category: "modelling" },
  { name: "Hanumat Vihar", category: "ugc" },
];

export const byCategory = (c: CollabCategory) =>
  collabs.filter((x) => x.category === c).map((x) => x.name);

// Featured reels (shown on the media kit). `id` is the Instagram reel code
// from instagram.com/reel/<id>/ ; thumbnails live in public/images/reels/<id>.jpg
export type Reel = { id: string; category: CollabCategory; partner: string; note?: string; thumb?: string };

export const reels: Reel[] = [
  { id: "DdY2SqwpGe_", category: "cafe", partner: "Rowdy Cafe", note: "Vrindavan" },
  { id: "DdeKDOjpY9R", category: "cafe", partner: "Creme Coffee & Bakery", note: "Vrindavan" },
  { id: "Dd1RHfwpPR6", category: "cafe", partner: "Aam Dining", note: "Noida" },
  { id: "DgAHMXahO3X", category: "cafe", partner: "Arovaa", note: "Collab post" },
  { id: "DeUm3MpvIW3", category: "cafe", partner: "Burger Munk", note: "Collab post" },
  { id: "DfrcvN8plaA", category: "cafe", partner: "Hunger Hub", note: "Noida" },
  { id: "Df9nPU3oHKH", category: "cafe", partner: "Uppam", note: "Indore" },
  { id: "Df9GdYTpQm2", category: "brand", partner: "Dot & Key", note: "Skincare" },
  { id: "DfSAajDpw-5", category: "brand", partner: "True Hunt", note: "Cat food" },
  { id: "DejePh8p2_T", category: "brand", partner: "Joy", note: "Body care" },
  { id: "DeB49rTJ7KE", category: "brand", partner: "Jiden", note: "Fragrance" },
  { id: "DbnliXnBlZS", category: "modelling", partner: "Makeup by Ruhi Gujjar", note: "Bridal glam" },
  { id: "Dbia-ZtJzqa", category: "modelling", partner: "Makeup by Ruhi Gujjar", note: "Regal bride" },
  { id: "DcdqL1JhXJf", category: "modelling", partner: "Makeup by Ruhi Gujjar", note: "Bridal elegance" },
  { id: "DYMkhBkj4oK", category: "ugc", partner: "Hanumat Vihar", note: "Real estate" },
  { id: "DZmDe93j2zs", category: "ugc", partner: "Hanumat Vihar", note: "Real estate" },
];

export const reelUrl = (id: string) => `https://www.instagram.com/reel/${id}/`;
