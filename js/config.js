// 1. 复用源码中的所有网站配置（含分类、图标、颜色、链接）
const SITE_CATEGORIES = [
  {
    title: "常用工具",
    sites: [
      { 
        key: "baidu", 
        name: "百度", 
        icon: "fa-search", 
        color: "text-[#2B7FE0]", // 复用源码图标颜色
        defaultUrl: "https://www.baidu.com" 
      },
      { 
        key: "google", 
        name: "谷歌", 
        icon: "fa-google", 
        color: "text-[#4285F4]", 
        defaultUrl: "https://www.google.com" 
      },
      { 
        key: "github", 
        name: "GitHub", 
        icon: "fa-github", 
        color: "text-[#333333]", 
        defaultUrl: "https://www.github.com" 
      },
      { 
        key: "codepen", 
        name: "CodePen", 
        icon: "fa-code", 
        color: "text-[#000000]", 
        defaultUrl: "https://codepen.io" 
      }
    ]
  },
  {
    title: "视频平台",
    sites: [
      { 
        key: "bilibili", 
        name: "哔哩哔哩", 
        icon: "fa-play-circle", 
        color: "text-[#FB7299]", 
        defaultUrl: "https://www.bilibili.com" 
      },
      { 
        key: "youku", 
        name: "优酷", 
        icon: "fa-film", 
        color: "text-[#FF0000]", 
        defaultUrl: "https://www.youku.com" 
      },
      { 
        key: "iqiyi", 
        name: "爱奇艺", 
        icon: "fa-play-circle-o", 
        color: "text-[#1E9FFF]", 
        defaultUrl: "https://www.iqiyi.com" 
      },
      { 
        key: "youtube", 
        name: "YouTube", 
        icon: "fa-youtube-play", 
        color: "text-[#FF0000]", 
        defaultUrl: "https://www.youtube.com" 
      },
      { 
        key: "tencent", 
        name: "腾讯视频", 
        icon: "fa-television", 
        color: "text-[#00A1D6]", 
        defaultUrl: "https://v.qq.com" 
      }
    ]
  },
  {
    title: "社交网络",
    sites: [
      { 
        key: "weixin", 
        name: "微信", 
        icon: "fa-weixin", 
        color: "text-[#07C160]", 
        defaultUrl: "https://weixin.qq.com/" 
      },
      { 
        key: "weibo", 
        name: "微博", 
        icon: "fa-weibo", 
        color: "text-[#E6162D]", 
        defaultUrl: "https://weibo.com/" 
      },
      { 
        key: "douyin", 
        name: "抖音", 
        icon: "fa-music", 
        color: "text-[#000000]", 
        defaultUrl: "https://www.douyin.com/" 
      },
      { 
        key: "kuaishou", 
        name: "快手", 
        icon: "fa-play-circle", 
        color: "text-[#FE2C55]", 
        defaultUrl: "https://www.kuaishou.com/" 
      }
    ]
  },
  {
    title: "在线音乐",
    sites: [
      { 
        key: "neteaseMusic", 
        name: "网易云音乐", 
        icon: "fa-music", 
        color: "text-[#C20C0C]", 
        defaultUrl: "https://music.163.com" 
      },
      { 
        key: "qqMusic", 
        name: "QQ音乐", 
        icon: "fa-headphones", 
        color: "text-[#12B7F5]", 
        defaultUrl: "https://y.qq.com" 
      },
      { 
        key: "kugouMusic", 
        name: "酷狗音乐", 
        icon: "fa-volume-up", 
        color: "text-[#FE8C00]", 
        defaultUrl: "https://www.kugou.com" 
      },
      { 
        key: "kuwoMusic", 
        name: "酷我音乐", 
        icon: "fa-music", 
        color: "text-[#548DD4]", 
        defaultUrl: "https://www.kuwo.cn" 
      },
      { 
        key: "xiamiMusic", 
        name: "虾米音乐", 
        icon: "fa-headphones", 
        color: "text-[#FF6700]", 
        defaultUrl: "https://www.xiami.com" 
      },
      { 
        key: "spotify", 
        name: "Spotify", 
        icon: "fa-spotify", 
        color: "text-[#1DB954]", 
        defaultUrl: "https://open.spotify.com" 
      }
    ]
  },
  {
    title: "邮箱平台",
    sites: [
      { 
        key: "neteaseMail", 
        name: "网易邮箱", 
        icon: "fa-envelope", 
        color: "text-[#C20C0C]", 
        defaultUrl: "https://mail.163.com" 
      },
      { 
        key: "qqMail", 
        name: "QQ邮箱", 
        icon: "fa-envelope-o", 
        color: "text-[#12B7F5]", 
        defaultUrl: "https://mail.qq.com" 
      },
      { 
        key: "gmail", 
        name: "Gmail", 
        icon: "fa-google", 
        color: "text-[#4285F4]", 
        defaultUrl: "https://mail.google.com" 
      },
      { 
        key: "outlook", 
        name: "Outlook", 
        icon: "fa-windows", 
        color: "text-[#00A4EF]", 
        defaultUrl: "https://outlook.live.com" 
      },
      { 
        key: "sinaMail", 
        name: "新浪邮箱", 
        icon: "fa-envelope", 
        color: "text-[#FF8C00]", 
        defaultUrl: "https://mail.sina.com.cn" 
      },
      { 
        key: "sohuMail", 
        name: "搜狐邮箱", 
        icon: "fa-envelope", 
        color: "text-[#0099FF]", 
        defaultUrl: "https://mail.sohu.com" 
      }
    ]
  },
  {
    title: "学习平台",
    sites: [
      { 
        key: "icourse", 
        name: "中国大学MOOC", 
        icon: "fa-graduation-cap", 
        color: "text-[#C91F37]", 
        defaultUrl: "https://www.icourse163.org/" 
      },
      { 
        key: "coursera", 
        name: "Coursera", 
        icon: "fa-book", 
        color: "text-[#0056D2]", 
        defaultUrl: "https://www.coursera.org/" 
      },
      { 
        key: "neteaseClass", 
        name: "网易云课堂", 
        icon: "fa-leanpub", 
        color: "text-[#FF6700]", 
        defaultUrl: "https://study.163.com/" 
      },
      { 
        key: "baijiajiangtan", 
        name: "百家讲坛", 
        icon: "fa-television", 
        color: "text-[#E6162D]", 
        defaultUrl: "https://tv.cctv.com/lm/bjjjt/" 
      }
    ]
  }
];

// 2. 全局常量（复用源码）
window.APP_CONFIG = {
  siteCategories: SITE_CATEGORIES,
  apiVerifyPath: "/api/verify",
  fetchTimeout: 10000,
  // 悬浮文字配置（不影响原有样式）
  floatingTexts: ["哇！", "Nice✨", "好耶~", "Cool😎", "666", "真棒！", "冲呀！", "厉害👍"],
  floatingColors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]
};
