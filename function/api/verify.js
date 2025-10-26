// 后端验证逻辑（Cloudflare Workers环境示例）
export async function onRequestPost(context) {
  // 密码环境变量映射
  const PASSWORD_ENV_MAP = {
    "baidu": "BAIDU_PASSWORD", "google": "GOOGLE_PASSWORD", 
    "github": "GITHUB_PASSWORD", "codepen": "CODEPEN_PASSWORD",
    "bilibili": "BILIBILI_PASSWORD", "youku": "YOUKU_PASSWORD",
    "iqiyi": "IQIYI_PASSWORD", "youtube": "YOUTUBE_PASSWORD",
    "tencent": "TENCENT_PASSWORD", "weixin": "WEIXIN_PASSWORD",
    "weibo": "WEIBO_PASSWORD", "douyin": "DOUYIN_PASSWORD",
    "kuaishou": "KUAIHOU_PASSWORD"
  };

  // 目标URL环境变量映射
  const TARGET_URL_ENV_MAP = {
    "baidu": "BAIDU_TARGET_URL", "google": "GOOGLE_TARGET_URL",
    "github": "GITHUB_TARGET_URL", "codepen": "CODEPEN_TARGET_URL",
    "bilibili": "BILIBILI_TARGET_URL", "youku": "YOUKU_TARGET_URL",
    "iqiyi": "IQIYI_TARGET_URL", "youtube": "YOUTUBE_TARGET_URL",
    "tencent": "TENCENT_TARGET_URL", "weixin": "WEIXIN_TARGET_URL",
    "weibo": "WEIBO_TARGET_URL", "douyin": "DOUYIN_TARGET_URL",
    "kuaishou": "KUAIHOU_TARGET_URL"
  };

  try {
    // 解析请求数据
    let requestData;
    try {
      requestData = await context.request.json();
    } catch (err) {
      return new Response(JSON.stringify({ success: false }), {
        headers: { "Content-Type": "application/json" }, status: 400
      });
    }

    const { siteKey, password } = requestData;
    if (!siteKey || !password) {
      return new Response(JSON.stringify({ success: false }), {
        headers: { "Content-Type": "application/json" }, status: 400
      });
    }

    // 验证密码
    const pwdEnvName = PASSWORD_ENV_MAP[siteKey];
    const correctPassword = pwdEnvName ? context.env[pwdEnvName] : undefined;
    const isPwdValid = correctPassword && password === correctPassword;

    if (!isPwdValid) {
      return new Response(JSON.stringify({ success: false }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 返回目标URL
    const urlEnvName = TARGET_URL_ENV_MAP[siteKey];
    const targetUrl = urlEnvName ? context.env[urlEnvName] || "" : "";

    return new Response(JSON.stringify({
      success: true,
      targetUrl: targetUrl
    }), { headers: { "Content-Type": "application/json" } });

  } catch (error) {
    return new Response(JSON.stringify({ success: false }), {
      headers: { "Content-Type": "application/json" }, status: 500
    });
  }
}