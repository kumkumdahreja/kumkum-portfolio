// Local files in /public are referenced as "/images/..."; uploads are full URLs.
export const asset = (path: string) =>
  !path || /^https?:\/\//.test(path) ? path : `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
