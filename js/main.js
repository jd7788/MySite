document.addEventListener('DOMContentLoaded', () => {
  const { siteCategories, apiVerifyPath, fetchTimeout } = window.APP_CONFIG;

  renderSiteCategories();
  initTimeDisplay();
  initSearch();
  initPasswordModal();

  // ------------------------------
  // 渲染所有卡片（添加专属类）
  // ------------------------------
  function renderSiteCategories() {
    const container = document.getElementById('siteCategories');
    siteCategories.forEach(category => {
      const section = document.createElement('section');
      section.className = 'mb-16';

      const title = document.createElement('h2');
      title.className = 'category-title';
      title.textContent = category.title;
      section.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6';

      // 为所有卡片添加专属类：site-card--{key}
      category.sites.forEach(site => {
        const card = document.createElement('div');
        // 基础类 + 专属类（所有卡片都有）
        const cardClasses = `site-card group site-card--${site.key}`;
        card.className = cardClasses;
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
  // 其余函数（密码弹窗、时间、搜索）保持不变
  // ------------------------------
  let currentSiteKey = "";
  function initPasswordModal() { /* 原代码不变 */ }
  function verifySite(siteKey, siteName) { /* 原代码不变 */ }
  function initTimeDisplay() { /* 原代码不变（修复时间） */ }
  function initSearch() { /* 原代码不变 */ }
  function showError(message) { /* 原代码不变 */ }
  function setLoading(isLoading) { /* 原代码不变 */ }
  async function fetchWithTimeout(url, options = {}) { /* 原代码不变 */ }
});
