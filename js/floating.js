// 悬浮文字特效（仅添加点击效果，不修改任何原有样式）
document.addEventListener('DOMContentLoaded', () => {
  const { floatingTexts, floatingColors } = window.APP_CONFIG;
  const animationTypes = [
    "float-basic", "float-sway", "float-spin", 
    "float-pulse", "float-gradient", "float-wave"
  ];

  // 悬浮文字样式（注入页面，不与原有样式冲突）
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .floating-text {
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      font-weight: bold;
      will-change: transform, opacity;
      font-size: clamp(0.8rem, 3vw, 1rem); /* 与网站标签字体大小匹配 */
    }
    /* 动画效果（不影响原有样式） */
    .float-basic { animation: float-basic 1.5s ease-out forwards; }
    @keyframes float-basic { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -100%); opacity: 0; } }
    .float-sway { animation: float-sway 1.5s ease-in-out forwards; }
    @keyframes float-sway { 0% { transform: translate(-50%, -50%); opacity: 1; } 50% { transform: translate(-40%, -80%); } 100% { transform: translate(-50%, -100%); opacity: 0; } }
    .float-spin { animation: float-spin 1.5s ease-out forwards; }
    @keyframes float-spin { 0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; } 100% { transform: translate(-50%, -100%) rotate(360deg); opacity: 0; } }
    .float-pulse { animation: float-pulse 1.5s ease-out forwards; }
    @keyframes float-pulse { 0% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 50% { transform: translate(-50%, -80%) scale(1.2); } 100% { transform: translate(-50%, -100%) scale(0.8); opacity: 0; } }
    .float-gradient { animation: float-gradient 1.5s ease-out forwards; }
    @keyframes float-gradient { 0% { transform: translate(-50%, -50%); opacity: 1; filter: hue-rotate(0deg); } 100% { transform: translate(-50%, -100%); opacity: 0; filter: hue-rotate(180deg); } }
    .float-wave { animation: float-wave 1.5s ease-in-out forwards; }
    @keyframes float-wave { 0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; } 50% { transform: translate(-50%, -80%) rotate(5deg); } 100% { transform: translate(-50%, -100%) rotate(0deg); opacity: 0; } }
  `;
  document.head.appendChild(styleEl);

  // 监听点击事件（全页面生效，不影响原有交互）
  document.addEventListener('click', (e) => {
    const text = floatingTexts[Math.floor(Math.random() * floatingTexts.length)];
    const color = floatingColors[Math.floor(Math.random() * floatingColors.length)];
    const animation = animationTypes[Math.floor(Math.random() * animationTypes.length)];

    const textEl = document.createElement('span');
    textEl.textContent = text;
    textEl.className = `floating-text ${animation}`;
    textEl.style.color = color;
    textEl.style.left = `${e.clientX}px`;
    textEl.style.top = `${e.clientY}px`;
    textEl.style.transform = 'translate(-50%, -50%)'; // 居中对齐点击点

    document.body.appendChild(textEl);
    setTimeout(() => textEl.remove(), 1500);
  });
});
