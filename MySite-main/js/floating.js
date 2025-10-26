// 悬浮文字动画逻辑
(function() {
  const { floatingTexts, floatingColors } = window.APP_CONFIG;
  const animationTypes = [
    "float-basic", "float-sway", "float-spin", "float-pulse",
    "float-gradient", "float-wave", "float-flash", "float-spiral"
  ];

  // 排除点击的元素
  const excludedElements = [
    document.getElementById('passwordModal'),
    document.getElementById('searchContainer'),
    document.getElementById('searchInput'),
    document.getElementById('searchBtn')
  ];

  // 检查是否为排除区域
  function isClickExcluded(target) {
    return excludedElements.some(el => {
      if (!el) return false;
      return el === target || el.contains(target);
    });
  }

  // 点击事件监听
  document.addEventListener('click', (e) => {
    if (isClickExcluded(e.target)) return;

    // 随机选择文字、颜色和动画
    const text = floatingTexts[Math.floor(Math.random() * floatingTexts.length)];
    const color = floatingColors[Math.floor(Math.random() * floatingColors.length)];
    const animation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    const isSpinReverse = Math.random() > 0.5;

    // 创建文字元素
    const textEl = document.createElement('span');
    textEl.className = `floating-text ${animation}`;
    textEl.textContent = text;
    textEl.style.color = color;

    // 定位到点击位置（基于视口）
    textEl.style.left = `${e.clientX}px`;
    textEl.style.top = `${e.clientY}px`;

    // 旋转动画反向
    if (animation === 'float-spin' && isSpinReverse) {
      textEl.style.animationDirection = 'reverse';
    }

    // 添加到页面并自动移除
    document.body.appendChild(textEl);
    setTimeout(() => textEl.remove(), 1800);
  });
})();