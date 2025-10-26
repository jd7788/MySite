// 强制要求环境变量配置密码的验证接口（无默认密码）
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { siteKey, password } = body;

    // 1. 必须从环境变量获取密码（无默认值）
    const ACCESS_PASSWORD = env.VITE_ACCESS_PASSWORD;
    if (!ACCESS_PASSWORD) {
      return new Response(JSON.stringify({
        success: false,
        message: "服务器未配置访问密码，请联系管理员"
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 2. 验证密码
    if (password !== ACCESS_PASSWORD) {
      return new Response(JSON.stringify({
        success: false,
        message: "密码错误"
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. 网站地址映射（默认配置）
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

    // 合并环境变量中的网站地址（如果配置）
    if (env.VITE_SITE_URLS) {
      try {
        const envUrls = JSON.parse(env.VITE_SITE_URLS);
        siteUrls = { ...siteUrls, ...envUrls }; // 环境变量配置覆盖默认值
      } catch (e) {
        console.error("解析VITE_SITE_URLS失败:", e);
        return new Response(JSON.stringify({
          success: false,
          message: "服务器配置错误"
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 4. 返回目标地址
    return new Response(JSON.stringify({
      success: true,
      targetUrl: siteUrls[siteKey] || siteUrls.baidu // 找不到时默认百度
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