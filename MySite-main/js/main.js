document.addEventListener('DOMContentLoaded', () => {
  const { apiVerifyPath, fetchTimeout, siteCategories } = window.APP_CONFIG;

  // 初始化功能
  initTimeDisplay();       // 北京时间显示
  initSearch();            // 搜索功能
  initPasswordModal();     // 密码弹窗（修复按钮点击）

  // 北京时间显示（标准时区实现）
  function initTimeDisplay() {
    function updateTime() {
      // 强制锁定北京时间时区
      const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timeZone: 'Asia/Shanghai'
      };
      
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Shanghai'
      };

      const now = new Date();
      const beijingDate = new Intl.DateTimeFormat('zh-CN', dateOptions).format(now);
      const beijingTime = new Intl.DateTimeFormat('zh-CN', timeOptions).format(now);

      // 更新DOM
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

  // 密码弹窗相关变量
  let currentSiteKey = "";
  let currentSiteName = "";
  let currentSiteUrl = "";

  // 打开验证弹窗（静态HTML调用）
  window.verifySite = function(siteKey) {
    // 从config匹配网站信息
    let targetSite = null;
    for (const category of siteCategories) {
      const site = category.sites.find(item => item.key === siteKey);
      if (site) {
        targetSite = site;
        break;
      }
    }

    if (!targetSite) {
      alert("网站配置不存在");
      return;
    }

    currentSiteKey = siteKey;
    currentSiteName = targetSite.name;
    currentSiteUrl = targetSite.defaultUrl;

    // 显示弹窗
    document.getElementById('modalTitle').textContent = `请输入【${currentSiteName}】的访问密码`;
    document.getElementById('modalPassword').value = '';
    document.getElementById('errorTip').classList.add('hidden');
    document.getElementById('passwordModal').classList.remove('hidden');
    document.getElementById('modalPassword').focus();
  };

  // 初始化密码弹窗（修复按钮点击）
  function initPasswordModal() {
    const modal = document.getElementById('passwordModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const modalPassword = document.getElementById('modalPassword');

    // 强制启用按钮点击
    cancelBtn.style.pointerEvents = 'auto';
    confirmBtn.style.pointerEvents = 'auto';

    // 取消按钮逻辑
    cancelBtn.onclick = () => {
      modal.classList.add('hidden');
      if (currentSiteUrl) {
        window.open(currentSiteUrl, '_blank');
      }
    };

    // 确定按钮逻辑
    confirmBtn.onclick = async () => {
      const password = modalPassword.value.trim();
      if (!password) {
        showError('请输入密码');
        return;
      }
      await submitVerification(password);
    };

    // 点击弹窗外部关闭
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    };

    // 回车提交
    modalPassword.onkeydown = (e) => {
      if (e.key === 'Enter') {
        confirmBtn.click();
      }
    };
  }

  // 提交验证
  async function submitVerification(password) {
    const confirmText = document.getElementById('confirmText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const modal = document.getElementById('passwordModal');

    // 显示加载状态
    confirmText.textContent = '验证中';
    loadingSpinner.classList.remove('hidden');
    confirmBtn.disabled = true;

    try {
      const response = await fetchWithTimeout(apiVerifyPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteKey: currentSiteKey, password })
      });

      const { success, targetUrl, message } = await response.json();

      if (success && targetUrl) {
        modal.classList.add('hidden');
        window.open(targetUrl, '_blank');
      } else {
        showError(message || '验证失败，请重试');
      }
    } catch (err) {
      showError(err.name === 'AbortError' ? '请求超时，请检查网络' : '服务器连接失败');
    } finally {
      // 恢复状态
      confirmText.textContent = '验证';
      loadingSpinner.classList.add('hidden');
      confirmBtn.disabled = false;
    }
  }

  // 显示错误提示
  function showError(message) {
    const errorTip = document.getElementById('errorTip');
    errorTip.textContent = message;
    errorTip.classList.remove('hidden');
    // 3秒后自动隐藏错误提示
    setTimeout(() => errorTip.classList.add('hidden'), 3000);
  }

  // 搜索功能
  function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    const performSearch = () => {
      const query = searchInput.value.trim();
      if (query) window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`);
    };

    searchBtn.onclick = performSearch;
    searchInput.onkeydown = (e) => {
      if (e.key === 'Enter') performSearch();
    };
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
