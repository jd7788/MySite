// 网站分类和配置数据
const siteCategories = [
  {
    title: "常用工具",
    sites: [
      { key: "baidu", name: "百度", icon: "fa-search", color: "#2B7FE0", url: "https://www.baidu.com" },
      { key: "google", name: "谷歌", icon: "fa-google", color: "#4285F4", url: "https://www.google.com" },
      { key: "github", name: "GitHub", icon: "fa-github", color: "#333333", url: "https://www.github.com" },
      { key: "codepen", name: "CodePen", icon: "fa-code", color: "#000000", url: "https://codepen.io" }
    ]
  },
  {
    title: "视频平台",
    sites: [
      { key: "bilibili", name: "哔哩哔哩", icon: "fa-play-circle", color: "#FB7299", url: "https://www.bilibili.com" },
      { key: "youku", name: "优酷", icon: "fa-film", color: "#FF0000", url: "https://www.youku.com" },
      { key: "iqiyi", name: "爱奇艺", icon: "fa-play-circle-o", color: "#1E9FFF", url: "https://www.iqiyi.com" },
      { key: "youtube", name: "YouTube", icon: "fa-youtube-play", color: "#FF0000", url: "https://www.youtube.com" },
      { key: "tencent", name: "腾讯视频", icon: "fa-television", color: "#00A1D6", url: "https://v.qq.com" }
    ]
  },
  {
    title: "社交网络",
    sites: [
      { key: "weixin", name: "微信", icon: "fa-weixin", color: "#07C160", url: "https://weixin.qq.com/" },
      { key: "weibo", name: "微博", icon: "fa-weibo", color: "#E6162D", url: "https://weibo.com/" },
      { key: "douyin", name: "抖音", icon: "fa-music", color: "#000000", url: "https://www.douyin.com/" },
      { key: "kuaishou", name: "快手", icon: "fa-play-circle", color: "#FE2C55", url: "https://www.kuaishou.com/" }
    ]
  }
];

// 导出配置（供其他JS文件使用）
window.siteConfig = {
  categories: siteCategories,
  apiVerifyPath: "/api/verify",
  fetchTimeout: 10000
};