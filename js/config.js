// 1. 网站完整配置数据（按分类整理，含图标/颜色/链接）
const SITE_CATEGORIES = [
  {
    title: "常用工具",
    sites: [
      { key: "baidu", name: "百度", icon: "fa-search", color: "text-blue-500", url: "https://www.baidu.com" },
      { key: "google", name: "谷歌", icon: "fa-google", color: "text-red-500", url: "https://www.google.com" },
      { key: "github", name: "GitHub", icon: "fa-github", color: "text-gray-800", url: "https://www.github.com" },
      { key: "codepen", name: "CodePen", icon: "fa-code", color: "text-pink-500", url: "https://codepen.io" },
      { key: "notion", name: "Notion", icon: "fa-sticky-note", color: "text-black", url: "https://www.notion.so" },
      { key: "figma", name: "Figma", icon: "fa-paint-brush", color: "text-purple-500", url: "https://www.figma.com" }
    ]
  },
  {
    title: "视频平台",
    sites: [
      { key: "bilibili", name: "哔哩哔哩", icon: "fa-play-circle", color: "text-pink-600", url: "https://www.bilibili.com" },
      { key: "youku", name: "优酷", icon: "fa-film", color: "text-red-600", url: "https://www.youku.com" },
      { key: "iqiyi", name: "爱奇艺", icon: "fa-play-circle-o", color: "text-red-600", url: "https://www.iqiyi.com" },
      { key: "youtube", name: "YouTube", icon: "fa-youtube-play", color: "text-red-600", url: "https://www.youtube.com" },
      { key: "tencent", name: "腾讯视频", icon: "fa-television", color: "text-blue-600", url: "https://v.qq.com" },
      { key: "netflix", name: "Netflix", icon: "fa-film", color: "text-red-700", url: "https://www.netflix.com" }
    ]
  },
  {
    title: "社交网络",
    sites: [
      { key: "weixin", name: "微信", icon: "fa-weixin", color: "text-green-500", url: "https://weixin.qq.com/" },
      { key: "weibo", name: "微博", icon: "fa-weibo", color: "text-red-500", url: "https://weibo.com/" },
      { key: "douyin", name: "抖音", icon: "fa-music", color: "text-gray-800", url: "https://www.douyin.com/" },
      { key: "kuaishou", name: "快手", icon: "fa-play-circle", color: "text-orange-500", url: "https://www.kuaishou.com/" },
      { key: "instagram", name: "Instagram", icon: "fa-instagram", color: "text-pink-500", url: "https://www.instagram.com" },
      { key: "twitter", name: "Twitter", icon: "fa-twitter", color: "text-blue-400", url: "https://twitter.com" }
    ]
  },
  {
    title: "在线音乐",
    sites: [
      { key: "neteaseMusic", name: "网易云音乐", icon: "fa-music", color: "text-red-500", url: "https://music.163.com" },
      { key: "qqMusic", name: "QQ音乐", icon: "fa-headphones", color: "text-green-500", url: "https://y.qq.com" },
      { key: "kugouMusic", name: "酷狗音乐", icon: "fa-volume-up", color: "text-blue-500", url: "https://www.kugou.com" },
      { key: "kuwoMusic", name: "酷我音乐", icon: "fa-music", color: "text-purple-500", url: "https://www.kuwo.cn" },
      { key: "xiamiMusic", name: "虾米音乐", icon: "fa-headphones", color: "text-orange-500", url: "https://www.xiami.com" },
      { key: "spotify", name: "Spotify", icon: "fa-spotify", color: "text-green-600", url: "https://open.spotify.com" }
    ]
  },
  {
    title: "邮箱平台",
    sites: [
      { key: "neteaseMail", name: "网易邮箱", icon: "fa-envelope", color: "text-red-500", url: "https://mail.163.com" },
      { key: "qqMail", name: "QQ邮箱", icon: "fa-envelope-o", color: "text-blue-500", url: "https://mail.qq.com" },
      { key: "gmail", name: "Gmail", icon: "fa-google", color: "text-red-500", url: "https://mail.google.com" },
      { key: "outlook", name: "Outlook", icon: "fa-windows", color: "text-blue-600", url: "https://outlook.live.com" },
      { key: "sinaMail", name: "新浪邮箱", icon: "fa-envelope", color: "text-orange-500", url: "https://mail.sina.com.cn" },
      { key: "sohuMail", name: "搜狐邮箱", icon: "fa-envelope", color: "text-blue-400", url: "https://mail.sohu.com" }
    ]
  },
  {
    title: "学习平台",
    sites: [
      { key: "icourse", name: "中国大学MOOC", icon: "fa-graduation-cap", color: "text-red-500", url: "https://www.icourse163.org/" },
      { key: "coursera", name: "Coursera", icon: "fa-book", color: "text-blue-500", url: "https://www.coursera.org/" },
      { key: "neteaseClass", name: "网易云课堂", icon: "fa-leanpub", color: "text-orange-500", url: "https://study.163.com/" },
      { key: "baijiajiangtan", name: "百家讲坛", icon: "fa-television", color: "text-indigo-500", url: "https://tv.cctv.com/lm/bjjjt/" },
      { key: "zhihu", name: "知乎", icon: "fa-book", color: "text-blue-500", url: "https://www.zhihu.com" },
      { key: "ted", name: "TED", icon: "fa-play-circle", color: "text-red-500", url: "https://www.ted.com" }
    ]
  }
];

// 2. 全局常量配置
window.APP_CONFIG = {
  siteCategories: SITE_CATEGORIES,
  apiVerifyPath: "/api/verify",
  fetchTimeout: 10000, // 请求超时10秒
  floatingTexts: [ // 悬浮文字库
    "哇！", "Nice✨", "好耶~", "Cool😎", "666", 
    "真棒！", "冲呀！", "厉害👍", "优秀！", "💯", 
    "🎉", "加油！", "Perfect", "Yeah!", "🌟"
  ],
  floatingColors: [ // 悬浮文字颜色
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"
  ]
};
