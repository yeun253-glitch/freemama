import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "자유부인",
    short_name: "자유부인",
    description: "나를 위한 시간, 가장 아름답게.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7f3",
    theme_color: "#fbf7f3",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
