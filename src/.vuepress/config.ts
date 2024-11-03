import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/blog/",

  lang: "zh-CN",
  title: "鲁黎明的博客",
  description: "鲁黎明的博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
