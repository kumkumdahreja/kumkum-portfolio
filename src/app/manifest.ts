import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kumkum Dahreja",
    short_name: "Kumkum",
    description: "Web developer and café, food & lifestyle creator from Mathura, India.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7f1",
    theme_color: "#fbf7f1",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
