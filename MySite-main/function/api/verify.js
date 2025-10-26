// 处理所有请求方法，仅允许 POST
export async function onRequest(context) {
  const { request } = context;

  // 只接受 POST 方法，其他方法返回 405
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      success: false,
      message: '仅支持 POST 请求方式'
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST', // 明确告知允许的方法
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Origin': '*' // 允许跨域（根据实际需求调整）
      }
    });
  }

  // 处理 POST 请求
  return handlePostRequest(context);
}

// 核心 POST 请求处理逻辑
async function handlePostRequest(context) {
  try {
    const { request, env } = context;
    
    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return new Response(JSON.stringify({
        success: false,
        message: '请求格式错误，需为 JSON'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { siteKey, password } = body;
    
    // 验证参数是否存在
    if (!siteKey || !password) {
      return new Response(JSON.stringify({
        success: false,
        message: '缺少参数（siteKey 或 password）'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 读取环境变量中的密码表
    const SITE_PASSWORDS_JSON = env.VITE_SITE_PASSWORDS;
    if (!SITE_PASSWORDS_JSON) {
      return new Response(JSON.stringify({
        success: false,
        message: '服务器未配置密码表（VITE_SITE_PASSWORDS）'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 解析密码表 JSON
    let sitePasswordMap;
    try {
      sitePasswordMap = JSON.parse(SITE_PASSWORDS_JSON);
    } catch (err) {
      return new Response(JSON.stringify({
        success: false,
        message: '密码表格式错误（非标准 JSON）'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查当前网站是否配置了密码
    if (!sitePasswordMap[siteKey]) {
      return new Response(JSON.stringify({
        success: false,
        message: `【${siteKey}】未配置访问密码`
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证密码是否正确
    if (password !== sitePasswordMap[siteKey]) {
      return new Response(JSON.stringify({
        success: false,
        message: '密码错误，请重试'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 定义默认网站跳转地址
    const defaultUrls = {
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

    // 合并自定义地址（如果配置了 VITE_SITE_URLS）
    let siteUrls = { ...defaultUrls };
    if (env.VITE_SITE_URLS) {
      try {
        const customUrls = JSON.parse(env.VITE_SITE_URLS);
        siteUrls = { ...siteUrls, ...customUrls };
      } catch (err) {
        return new Response(JSON.stringify({
          success: false,
          message: '自定义地址表格式错误（非标准 JSON）'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 验证成功，返回目标地址
    return new Response(JSON.stringify({
      success: true,
      targetUrl: siteUrls[siteKey] || defaultUrls.baidu // 兜底地址
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    // 捕获未知错误
    console.error('验证接口错误:', err);
    return new Response(JSON.stringify({
      success: false,
      message: '服务器内部错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
