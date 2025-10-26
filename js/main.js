document.addEventListener('DOMContentLoaded', () => {
  const { siteCategories, apiVerifyPath, fetchTimeout } = window.APP_CONFIG;

  // 1. 动态渲染网站分类（复用源码卡片结构）
  renderSiteCategories();
  // 2. 初始化时间显示（修复：删除多余8小时计算）
  initTimeDisplay();
  // 3. 初始化搜索功能（复用源码）
  initSearch();
  // 4. 初始化密码弹窗（复用源码）
  initPasswordModal();

  // ------------------------------
  // 函数：渲染网站分类（完全复用源码卡片结构）
  // ------------------------------
  function renderSiteCategories() {
    const container = document.getElementById('siteCategories');
    siteCategories.forEach(category => {
      const section = document.createElement('section');
      section.className = 'mb-16';

      // 分类标题（复用源码样式）
      const title = document.createElement('h2');
      title.className = 'category-title';
      title.textContent = category.title;
      section.appendChild(title);

      // 网站网格（复用源码响应式布局）
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6';

      // 生成网站卡片（复用源码结构：icon+name-container+lock图标）
      category.sites.forEach(site => {
        const card = document.createElement('div');
        card.className = 'site-card group';
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

  // ------------------------------
  // 函数：密码弹窗控制（完全复用源码逻辑）
  // ------------------------------
  let currentSiteKey = "";
  function initPasswordModal() {
    const modal = document.getElementById("passwordModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const passwordInput = document.getElementById("modalPassword");

    // 关闭弹窗
    window.closeModal = () => {
      modal.classList.add("hidden");
    };

    // 取消按钮（跳转默认链接）
    cancelBtn.addEventListener("click", () => {
      const site = siteCategories.flatMap(cat => cat.sites).find(s => s.key === currentSiteKey);
      if (site) window.open(site.defaultUrl, "_blank");
      window.closeModal();
    });

    // 确认按钮（验证密码）
    confirmBtn.addEventListener("click", async () => {
      const userPassword = passwordInput.value.trim();
      if (!userPassword) {
        showError("请输入密码");
        return;
      }

      // 显示加载状态
      setLoading(true);

      try {
        const response = await fetchWithTimeout(apiVerifyPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteKey: currentSiteKey, password: userPassword })
        });

        if (!response.ok) throw new Error(`服务异常（${response.status}）`);
        const { success, targetUrl } = await response.json();
        
        if (success && targetUrl) {
          window.closeModal();
          window.open(targetUrl, "_blank");
        } else {
          showError("密码错误，请重试");
        }
      } catch (err) {
        const msg = err.name === "AbortError" ? "请求超时，请检查网络" : "验证失败，请重试";
        showError(msg);
      } finally {
        setLoading(false);
      }
    });

    // Enter键提交
    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") confirmBtn.click();
    });

    // 点击外部关闭
    modal.addEventListener("click", (e) => {
      if (e.target === modal) window.closeModal();
    });
  }

  // ------------------------------
  // 函数：验证网站访问（复用源码）
  // ------------------------------
  function verifySite(siteKey, siteName) {
    currentSiteKey = siteKey;
    document.getElementById("modalTitle").textContent = `请输入【${siteName}】的访问密码`;
    document.getElementById("modalPassword").value = "";
    document.getElementById("errorTip").classList.add("hidden");
    document.getElementById("passwordModal").classList.remove("hidden");
    document.getElementById("modalPassword").focus();
  }

  // ------------------------------
  // 函数：北京时间更新（修复核心：删除+8小时）
  // ------------------------------
  function initTimeDisplay() {
    function updateTime() {
      // 修复：直接使用本地时间（浏览器自动识别北京时间，无需加8小时）
      const beijingTime = new Date();
      
      document.getElementById("beijingDate").textContent = beijingTime.toLocaleDateString("zh-CN", {
        year: "numeric", month: "long", day: "numeric", weekday: "long"
      });
      document.getElementById("beijingTime").textContent = beijingTime.toLocaleTimeString("zh-CN", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
      });

      // 隐藏骨架屏
      document.getElementById("beijingDate").classList.remove("hidden");
      document.getElementById("beijingTime").classList.remove("hidden");
      document.getElementById("dateSkeleton").classList.add("hidden");
      document.getElementById("timeSkeleton").classList.add("hidden");
    }
    updateTime();
    setInterval(updateTime, 1000);
  }

  // ------------------------------
  // 函数：搜索功能（复用源码）
  // ------------------------------
  function initSearch() {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");
    
    const performSearch = () => {
      const query = input.value.trim();
      if (query) window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`);
    };

    btn.addEventListener("click", performSearch);
    input.addEventListener("keydown", (e) => e.key === "Enter" && performSearch());
  }

  // ------------------------------
  // 工具函数（复用源码）
  // ------------------------------
  function showError(message) {
    const errorEl = document.getElementById("errorTip");
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  function setLoading(isLoading) {
    const confirmText = document.getElementById("confirmText");
    const spinner = document.getElementById("loadingSpinner");
    const confirmBtn = document.getElementById("confirmBtn");
    
    if (isLoading) {
      confirmText.textContent = "验证中";
      spinner.classList.remove("hidden");
      confirmBtn.disabled = true;
    } else {
      confirmText.textContent = "验证";
      spinner.classList.add("hidden");
      confirmBtn.disabled = false;
    }
  }

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
