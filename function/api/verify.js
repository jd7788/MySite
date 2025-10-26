// Cloudflare Workers 验证接口（与之前一致）
export async function onRequestPost(context) {
  // 密码环境变量映射（与config.js中的siteKey对应）
  const PASSWORD_ENV_MAP = {
    "baidu": "BAIDU_PASSWORD", "google": "GOOGLE_PASSWORD", "github": "GITHUB_PASSWORD", "codepen": "CODEPEN_PASSWORD",
    "notion": "NOTION_PASSWORD", "figma": "FIGMA_PASSWORD", "bilibili": "BILIBILI_PASSWORD", "youku": "YOUKU_PASSWORD",
    "iqiyi": "IQIYI_PASSWORD", "youtube": "YOUTUBE_PASSWORD", "tencent": "TENCENT_PASSWORD", "netflix": "NETFLIX_PASSWORD",
    "weixin": "WEIXIN_PASSWORD", "weibo": "WEIBO_PASSWORD", "douyin": "DOUYIN_PASSWORD", "kuaishou": "KUAIHOU_PASSWORD",
    "instagram": "INSTAGRAM_PASSWORD", "twitter": "TWITTER_PASSWORD", "neteaseMusic": "NETEASE_MUSIC_PASSWORD",
    "qqMusic": "QQ_MUSIC_PASSWORD", "kugouMusic": "KUGOU_MUSIC_PASSWORD", "kuwoMusic": "KUWO_MUSIC_PASSWORD",
    "xiamiMusic": "XIAMI_MUSIC_PASSWORD", "spotify": "SPOTIFY_PASSWORD", "neteaseMail": "NETEASE_MAIL_PASSWORD",
    "qqMail": "QQ_MAIL_PASSWORD", "gmail": "GMAIL_PASSWORD", "outlook": "OUTLOOK_PASSWORD", "sinaMail": "SINA_MAIL_PASSWORD",
    "sohuMail": "SOHU_MAIL_PASSWORD", "icourse": "ICOURESE_PASSWORD", "coursera": "COURSERA_PASSWORD",
    "neteaseClass": "NETEASE_CLASS_PASSWORD", "baijiajiangtan": "BAIJIA_PASSWORD", "zhihu": "ZHIHU_PASSWORD", "ted": "TED_PASSWORD"
  };

  // 目标URL环境变量映射
  const TARGET_URL_ENV_MAP = {
    "baidu": "BAIDU_TARGET_URL", "google": "GOOGLE_TARGET_URL", "github": "GITHUB_TARGET_URL", "codepen": "CODEPEN_TARGET_URL",
    "notion": "NOTION_TARGET_URL", "figma": "FIGMA_TARGET_URL", "bilibili": "BILIBILI_TARGET_URL", "youku": "YOUKU_TARGET_URL",
    "iqiyi": "IQIYI_TARGET_URL", "youtube": "YOUTUBE_TARGET_URL", "tencent": "TENCENT_TARGET_URL", "netflix": "NETFLIX_TARGET_URL",
    "weixin": "WEIXIN_TARGET_URL", "weibo": "WEIBO_TARGET_URL", "douyin": "DOUYIN_TARGET_URL", "kuaishou": "KUAIHOU_TARGET_URL",
    "instagram": "INSTAGRAM_TARGET_URL", "twitter": "TWITTER_TARGET_URL", "neteaseMusic": "NETEASE_MUSIC_TARGET_URL",
    "qqMusic": "QQ_MUSIC_TARGET_URL", "kugouMusic": "KUGOU_MUSIC_TARGET_URL", "kuwoMusic": "KUWO_MUSIC_TARGET_URL",
    "xiamiMusic": "XIAMI_MUSIC_TARGET_URL", "spotify": "SPOTIFY_TARGET_URL", "neteaseMail": "NETEASE_MAIL_TARGET_URL",
    "qqMail": "QQ_MAIL_TARGET_URL", "gmail": "GMAIL_TARGET_URL", "outlook": "OUTLOOK_TARGET_URL", "sinaMail": "SINA_MAIL_TARGET_URL",
    "sohuMail": "SOHU_MAIL_TARGET_URL", "icourse": "ICOURESE_TARGET_URL", "coursera": "COURSERA_TARGET_URL",
    "neteaseClass": "NETEASE_CLASS_TARGET_URL", "baijiajiangtan": "BAIJIA_TARGET_URL", "zhihu": "ZHIHU_TARGET_URL", "ted": "TED_TARGET_URL"
  };

  try {
    // 解析请求
    let requestData;
    try { requestData = await context.request.json(); } 
    catch (err) { return res(false, 400); }

    const { siteKey, password } = requestData;
    if (!siteKey || !password) return res(false, 400);

    // 验证密码
    const pwdEnv = PASSWORD_ENV_MAP[siteKey];
    const correctPwd = pwdEnv ? context.env[pwdEnv] : undefined;
    if (!correctPwd || password !== correctPwd) return res(false);

    // 返回目标URL
    const urlEnv = TARGET_URL_ENV_MAP[siteKey];
    const targetUrl = urlEnv ? context.env[urlEnv] || "" : "";
    return res(true, 200, targetUrl);

  } catch (err) {
    console.error("验证异常：", err);
    return res(false, 500);
  }

  // 响应工具函数
  function res(success, status = 200, targetUrl = "") {
    return new Response(JSON.stringify({ success, targetUrl }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
}
