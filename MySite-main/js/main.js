document.addEventListener('DOMContentLoaded', () => {
  const { siteCategories, apiVerifyPath, fetchTimeout } = window.APP_CONFIG;

  // 渲染网站分类
  renderSiteCategories();
  // 初始化时间显示（标准北京时间）
  initTimeDisplay();
  // 初始化搜索功能
  initSearch();
  // 初始化密码弹窗
  initPasswordModal();

  // 渲染网站分类和卡片
  function renderSiteCategories() {
    const container = document.getElementById('siteCategories');
    siteCategories.forEach(category => {
      const section = document.createElement('section');
      section.className = 'mb-16';

      // 分类标题
      const title = document.createElement('h2');
      title.className = 'category-title';
      title.textContent = category.title;
      section.appendChild(title);

      // 卡片网格
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6';

      // 生成网站卡片
      category.sites.forEach(site => {
        const card = document.createElement('div');
        card.className = `site-card group site-card--${site.key}`;
        card.onclick = () => verifySite(site.key, site.name, site.defaultUrl);
        card.innerHTML = `
          <i class="fa ${site.icon} site-icon ${site.color} group-hover:text-primary"></i>
          <div class="site-name-container">
            <span class="site-name">${site.name} <i class="fa fa-lock text-xs text-dark-300"></i></span>
          </div>
        `;
        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  // 密码弹窗相关
  let currentSiteKey = "";
  let currentSiteUrl = "";

  function initPasswordModal() {
    const modal = document.getElementById('passwordModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const modalPassword = document.getElementById('modalPassword');

    // 关闭弹窗
    cancelBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      // 取消时跳转默认地址
      if (currentSiteUrl) window.open(currentSiteUrl, '_blank');
    });

    // 点击外部关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });

    // 确认验证
    confirmBtn.addEventListener('click', async () => {
      const password = modalPassword.value.trim();
      if (!password) {
        showError('请输入密码');
        return;
      }
      await submitVerification(password);
    });

    // 回车提交
    modalPassword.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirmBtn.click();
    });
  }

  // 打开验证弹窗
  function verifySite(siteKey, siteName, defaultUrl) {
    currentSiteKey = siteKey;
    currentSiteUrl = defaultUrl;
    document.getElementById('modalTitle').textContent = `请输入【${siteName}】的访问密码`;
    document.getElementById('modalPassword').value = '';
    document.getElementById('errorTip').classList.add('hidden');
    document.getElementById('passwordModal').classList.remove('hidden');
    document.getElementById('modalPassword').focus();
  }

  // 提交验证
  async function submitVerification(password) {
    const confirmText = document.getElementById('confirmText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const modal = document.getElementById('passwordModal');

    // 显示加载状态
    confirmText.textContent = '验证中';
    loadingSpinner.classList.remove('hidden');
    confirmText.disabled = true;

    try {
      const response = await fetchWithTimeout(apiVerifyPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteKey: currentSiteKey, password })
      });

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('服务器未配置密码，请联系管理员');
        } else {
          throw new Error(`验证失败（状态码: ${response.status}）`);
        }
      }

      const { success, targetUrl, message } = await response.json();

      if (success && targetUrl) {
        modal.classList.add('hidden');
        window.open(targetUrl, '_blank');
      } else {
        showError(message || '密码错误，请重试');
      }
    } catch (err) {
      showError(err.message || '验证失败，请重试');
    } finally {
      // 恢复状态
      confirmText.textContent = '验证';
      loadingSpinner.classList.add('hidden');
      confirmText.disabled = false;
    }
  }

  // 显示错误提示
  function showError(message) {
    const errorTip = document.getElementById('errorTip');
    errorTip.textContent = message;
    errorTip.classList.remove('hidden');
  }

  // 北京时间显示（标准时区实现）
  function initTimeDisplay() {
    function updateTime() {
      // 使用Intl.DateTimeFormat强制指定上海时区，确保时间准确
      const optionsDate = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timeZone: 'Asia/Shanghai' // 关键：锁定北京时间时区
      };
      
      const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Shanghai' // 关键：锁定北京时间时区
      };

      const now = new Date();
      // 格式化日期和时间（强制北京时间）
      const beijingDate = new Intl.DateTimeFormat('zh-CN', optionsDate).format(now);
      const beijingTime = new Intl.DateTimeFormat('zh-CN', optionsTime).format(now);

      // 更新显示
      document.getElementById('beijingDate').textContent = beijingDate;
      document.getElementById('beijingTime').textContent = beijingTime;

      // 隐藏骨架屏
      document.getElementById('dateSkeleton').classList.add('hidden');
      document.getElementById('timeSkeleton').classList.add('hidden');
      document.getElementById('beijingDate').classList.remove('hidden');
      document.getElementById('beijingTime').classList.remove('hidden');
    }

    updateTime();
    setInterval(updateTime, 1000); // 每秒更新
  }

  // 搜索功能
  function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    const performSearch = () => {
      const query = searchInput.value.trim();
      if (query) window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`);
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  // 带超时的fetch
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