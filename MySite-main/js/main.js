document.addEventListener('DOMContentLoaded', () => {
  const { apiVerifyPath, fetchTimeout, siteCategories } = window.APP_CONFIG;

  // 初始化北京时间显示（核心新增）
  initTimeDisplay();
  // 初始化搜索功能
  initSearch();
  // 初始化密码弹窗
  initPasswordModal();

  // 北京时间显示（标准时区实现）
  function initTimeDisplay() {
    // 强制使用上海时区（北京时间），不受用户本地时区影响
    function updateTime() {
      const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timeZone: 'Asia/Shanghai' // 锁定北京时间时区
      };
      
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24小时制
        timeZone: 'Asia/Shanghai' // 锁定北京时间时区
      };

      const now = new Date();
      // 格式化日期和时间（确保是北京时间）
      const beijingDate = new Intl.DateTimeFormat('zh-CN', dateOptions).format(now);
      const beijingTime = new Intl.DateTimeFormat('zh-CN', timeOptions).format(now);

      // 更新DOM显示
      document.getElementById('beijingDate').textContent = beijingDate;
      document.getElementById('beijingTime').textContent = beijingTime;

      // 隐藏骨架屏，显示实际时间
      document.getElementById('dateSkeleton').classList.add('hidden');
      document.getElementById('timeSkeleton').classList.add('hidden');
      document.getElementById('beijingDate').classList.remove('hidden');
      document.getElementById('beijingTime').classList.remove('hidden');
    }

    // 初始化立即执行一次，之后每秒更新
    updateTime();
    setInterval(updateTime, 1000);
  }

  // 密码弹窗相关逻辑（已有的代码）
  let currentSiteKey = "";
  let currentSiteName = "";
  let currentSiteUrl = "";

  window.verifySite = function(siteKey) {
    // 从config中匹配网站信息（已有逻辑）
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

    // 打开弹窗（已有逻辑）
    document.getElementById('modalTitle').textContent = `请输入【${currentSiteName}】的访问密码`;
    document.getElementById('modalPassword').value = '';
    document.getElementById('errorTip').classList.add('hidden');
    document.getElementById('passwordModal').classList.remove('hidden');
    document.getElementById('modalPassword').focus();
  };

  // 提交验证函数（已有的代码）
  async function submitVerification(password) {
    const confirmText = document.getElementById('confirmText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const modal = document.getElementById('passwordModal');

    confirmText.textContent = '验证中';
    loadingSpinner.classList.remove('hidden');
    confirmText.disabled = true;

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
      confirmText.textContent = '验证';
      loadingSpinner.classList.add('hidden');
      confirmText.disabled = false;
    }
  }

  // 其他辅助函数（搜索、错误提示等，保持不变）
  function initPasswordModal() { /* 已有逻辑 */ }
  function showError(message) { /* 已有逻辑 */ }
  function initSearch() { /* 已有逻辑 */ }
  async function fetchWithTimeout(url, options = {}) { /* 已有逻辑 */ }
});
