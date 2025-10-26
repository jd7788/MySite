// 主逻辑入口
document.addEventListener('DOMContentLoaded', () => {
  // 1. 渲染网站分类
  renderSiteCategories();
  
  // 2. 初始化时间显示
  initTimeDisplay();
  
  // 3. 初始化搜索功能
  initSearch();
  
  // 4. 初始化密码弹窗
  initPasswordModal();
});

// 渲染网站分类和卡片
function renderSiteCategories() {
  const container = document.getElementById('siteCategories');
  const { categories } = window.siteConfig;
  
  categories.forEach(category => {
    // 创建分类区块
    const section = document.createElement('section');
    section.className = 'mb-16';
    
    // 添加分类标题
    const title = document.createElement('h2');
    title.className = 'category-title';
    title.textContent = category.title;
    section.appendChild(title);
    
    // 创建网站网格
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6';
    
    // 添加网站卡片
    category.sites.forEach(site => {
      const card = document.createElement('div');
      card.className = 'site-card group';
      card.onclick = () => verifySite(site.key, site.name);
      card.innerHTML = `
        <i class="fa ${site.icon} site-icon" style="color: ${site.color}"></i>
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

// 时间显示功能
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
    
    // 隐藏骨架屏
    document.getElementById('beijingDate').classList.remove('hidden');
    document.getElementById('beijingTime').classList.remove('hidden');
    document.getElementById('dateSkeleton').classList.add('hidden');
    document.getElementById('timeSkeleton').classList.add('hidden');
  }
  
  updateTime();
  setInterval(updateTime, 1000);
}

// 搜索功能
function initSearch() {
  const input = document.getElementById('searchInput');
  const btn = document.getElementById('searchBtn');
  
  const search = () => {
    const query = input.value.trim();
    if (query) window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`);
  };
  
  btn.addEventListener('click', search);
  input.addEventListener('keydown', e => e.key === 'Enter' && search());
}

// 密码弹窗控制
function initPasswordModal() {
  const modal = document.getElementById('passwordModal');
  const cancelBtn = document.getElementById('cancelBtn');
  const confirmBtn = document.getElementById('confirmBtn');
  const passwordInput = document.getElementById('modalPassword');
  
  // 关闭弹窗
  window.closeModal = () => {
    modal.classList.add('hidden');
  };
  
  // 取消按钮
  cancelBtn.addEventListener('click', () => {
    window.closeModal();
  });
  
  // 确认按钮
  confirmBtn.addEventListener('click', async () => {
    const password = passwordInput.value.trim();
    if (!password) {
      showError('请输入密码');
      return;
    }
    
    // 显示加载状态
    setLoading(true);
    
    try {
      const response = await fetchWithTimeout(window.siteConfig.apiVerifyPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          siteKey: window.currentSiteKey, 
          password 
        })
      });
      
      if (!response.ok) throw new Error('验证失败');
      const { success, targetUrl } = await response.json();
      
      if (success && targetUrl) {
        window.closeModal();
        window.open(targetUrl, '_blank');
      } else {
        showError('密码错误，请重试');
      }
    } catch (err) {
      showError(err.name === 'AbortError' ? '请求超时' : '验证失败');
    } finally {
      setLoading(false);
    }
  });
  
  // 按Enter提交
  passwordInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') confirmBtn.click();
  });
  
  // 点击外部关闭
  modal.addEventListener('click', e => {
    if (e.target === modal) window.closeModal();
  });
}

// 验证网站访问权限
function verifySite(siteKey, siteName) {
  window.currentSiteKey = siteKey;
  document.getElementById('modalTitle').textContent = `请输入【${siteName}】的访问密码`;
  document.getElementById('modalPassword').value = '';
  document.getElementById('errorTip').classList.add('hidden');
  document.getElementById('passwordModal').classList.remove('hidden');
  document.getElementById('modalPassword').focus();
}

// 辅助函数：显示错误提示
function showError(message) {
  const errorEl = document.getElementById('errorTip');
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}

// 辅助函数：设置加载状态
function setLoading(isLoading) {
  const confirmText = document.getElementById('confirmText');
  const spinner = document.getElementById('loadingSpinner');
  const confirmBtn = document.getElementById('confirmBtn');
  
  if (isLoading) {
    confirmText.textContent = '验证中';
    spinner.classList.remove('hidden');
    confirmBtn.disabled = true;
  } else {
    confirmText.textContent = '验证';
    spinner.classList.add('hidden');
    confirmBtn.disabled = false;
  }
}

// 带超时的fetch请求
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), window.siteConfig.fetchTimeout);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}