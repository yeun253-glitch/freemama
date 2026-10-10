import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "자유부인",
    short_name: "자유부인",
    description: "어렵게 얻은 자유 시간, 후회 없이 쓰는 코스를 1분 만에.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf8f6",
    theme_color: "#d9667a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
