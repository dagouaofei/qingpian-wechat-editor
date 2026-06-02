import type { Metadata } from "next";

import { HomePageClient } from "./home-page-client";

export const metadata: Metadata = {
  title: "轻篇公众号排版",
  description: "输入需求，真实 AI 生成带样式公众号文章",
};

export default function Home() {
  return <HomePageClient />;
}
