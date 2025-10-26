// 支持不同网址独立密码的验证接口
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { siteKey, password } = body;

    // 1. 从环境变量获取「网站-密码」映射表（必须配置）
    const SITE_PASSWORDS_JSON = env.VITE_SITE_PASSWORDS;
    if (!SITE_PASSWORDS_JSON) {
      return new Response(JSON.stringify({
        success: false,
        message: "服务器未配置网站密码表，请联系管理员"
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. 解析JSON（处理格式错误）
    let sitePasswordMap;
    try {
      sitePasswordMap = JSON.parse(SITE_PASSWORDS_JSON);
    } catch (e) {
      console.error("解析密码表JSON失败:", e);
      return new Response(JSON.stringify({
        success: false,
        message: "服务器密码表配置格式错误"
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. 检查当前网站是否配置了密码
    if (!sitePasswordMap[siteKey]) {
      return new Response(JSON.stringify({
        success: false,
        message: `【${siteKey}】未设置访问密码`
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. 验证密码（匹配当前网站的独立密码）
    if (password !== sitePasswordMap[siteKey]) {
      return new Response(JSON.stringify({
        success: false,
        message: "密码错误，请重试"
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. 网站跳转地址映射（默认配置，可选通过VITE_SITE_URLS自定义）
    let siteUrls = {
      baidu: "https://www.baidu.com",
      google: "https://www.google.com",
      github: "https://www.github.com",
      codepen: "https://codepen.io",
      bilibili: "https://www.bilibili.com",
      youku: "https://www.youku.com",
      iqiyi: "https://www.iqiyi.com",
      youtube: "https://www.youtube.com",
      tencent: "https://v.qq.com",
      weixin: "https://weixin.qq.com/",
      weibo: "https://weibo.com/",
      douyin: "https://www.douyin.com/",
      kuaishou: "https://www.kuaishou.com/",
      neteaseMusic: "https://music.163.com",
      qqMusic: "https://y.qq.com",
      kugouMusic: "https://www.kugou.com",
      kuwoMusic: "https://www.kuwo.cn",
      xiamiMusic: "https://www.xiami.com",
      spotify: "https://open.spotify.com",
      neteaseMail: "https://mail.163.com",
      qqMail: "https://mail.qq.com",
      gmail: "https://mail.google.com",
      outlook: "https://outlook.live.com",
      sinaMail: "https://mail.sina.com.cn",
      sohuMail: "https://mail.sohu.com",
      icourse: "https://www.icourse163.org/",
      coursera: "https://www.coursera.org/",
      neteaseClass: "https://study.163.com/",
      baijiajiangtan: "https://tv.cctv.com/lm/bjjjt/"
    };

    // 合并可选的自定义地址（VITE_SITE_URLS）
    if (env.VITE_SITE_URLS) {
      try {
        const envUrls = JSON.parse(env.VITE_SITE_URLS);
        siteUrls = { ...siteUrls, ...envUrls };
      } catch (e) {
        console.error("解析自定义地址JSON失败:", e);
        return new Response(JSON.stringify({
          success: false,
          message: "服务器地址表配置格式错误"
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 6. 返回目标地址
    return new Response(JSON.stringify({
      success: true,
      targetUrl: siteUrls[siteKey] || siteUrls.baidu
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      message: "服务器错误"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
