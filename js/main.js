document.addEventListener('DOMContentLoaded', () => {
  const { siteCategories, apiVerifyPath, fetchTimeout } = window.APP_CONFIG;

  // 1. 动态渲染网站分类和卡片
  renderSiteCategories();
  // 2. 初始化时间显示
  initTimeDisplay();
  // 3. 初始化搜索功能
  initSearch();

  // ------------------------------
  // 函数：渲染网站分类
  // ------------------------------
  function renderSiteCategories() {
    const container = document.getElementById('siteCategories');
    siteCategories.forEach(category => {
      // 创建分类区块
      const section = document.createElement('section');
      section.className = 'mb-12';

      // 分类标题
      const title = document.createElement('h2');
      title.className = 'category-title';
      title.textContent = category.title;
      section.appendChild(title);

      // 网站网格（保持原布局：2列→6列响应式）
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4';

      // 生成网站卡片
      category.sites.forEach(site => {
        const card = document.createElement('div');
        card.className = 'site-card group';
        card.onclick = () => verifySite(site.key, site.name, site.url);
        // 卡片内容（使用配置的图标和颜色）
        card.innerHTML = `
          <i class="fa ${site.icon} site-icon ${site.color} group-hover:text-primary"></i>
          <span class="site-name">${site.name}</span>
        `;
        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  // ------------------------------
  // 函数：密码验证
  // ------------------------------
  async function verifySite(siteKey, siteName, defaultUrl) {
    const userPassword = prompt(`请输入【${siteName}】的访问密码：`);
    if (!userPassword) {
      window.open(defaultUrl, '_blank');
      return;
    }

    try {
      const response = await fetchWithTimeout(apiVerifyPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteKey, password: userPassword })
      });

      if (!response.ok) throw new Error(`服务异常（${response.status}）`);
      const { success, targetUrl } = await response.json();
      window.open(success ? targetUrl : defaultUrl, '_blank');
    } catch (err) {
      const errorMsg = err.name === 'AbortError' ? '请求超时，请检查网络' : '验证失败，请重试';
      alert(errorMsg);
      console.error('验证错误：', err);
    }
  }

  // ------------------------------
  // 函数：时间显示
  // ------------------------------
  function initTimeDisplay() {
    function updateTime() {
      const now = new Date();
      const beijingTime = new Date(now.getTime() + 8 * 3600000); // UTC+8
      
      document.getElementById('beijingDate').textContent = beijingTime.toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
      });
      document.getElementById('beijingTime').textContent = beijingTime.toLocaleTimeString('zh-CN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
    }
    updateTime();
    setInterval(updateTime, 1000);
  }

  // ------------------------------
  // 函数：搜索功能
  // ------------------------------
  function initSearch() {
    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    
    const performSearch = () => {
      const query = input.value.trim();
      if (query) window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`);
    };

    btn.addEventListener('click', performSearch);
    input.addEventListener('keydown', (e) => e.key === 'Enter' && performSearch());
  }

  // ------------------------------
  // 工具函数：带超时的fetch
  // ------------------------------
  async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
    
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
});
