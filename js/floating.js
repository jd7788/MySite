// 悬浮文字特效（确保全页面点击可见）
document.addEventListener('DOMContentLoaded', () => {
  const { floatingTexts, floatingColors } = window.APP_CONFIG;
  const animationTypes = [
    "float-basic", "float-sway", "float-spin", 
    "float-pulse", "float-gradient", "float-wave", 
    "float-flash", "float-spiral"
  ];

  // 监听全页面点击
  document.addEventListener('click', (e) => {
    // 随机配置
    const text = floatingTexts[Math.floor(Math.random() * floatingTexts.length)];
    const color = floatingColors[Math.floor(Math.random() * floatingColors.length)];
    const animation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    const isSpinReverse = Math.random() > 0.5;

    // 创建文字元素
    const textEl = document.createElement('span');
    textEl.textContent = text;
    textEl.className = `floating-text ${animation}`;
    textEl.style.color = color;

    // 固定定位+居中对齐点击点
    textEl.style.position = 'fixed';
    textEl.style.left = `${e.clientX}px`;
    textEl.style.top = `${e.clientY}px`;
    textEl.style.transform = 'translate(-50%, -50%)';
    textEl.style.zIndex = '9999';
    textEl.style.fontSize = 'clamp(1rem, 3vw, 1.5rem)'; // 与标签尺寸匹配

    // 旋转方向控制
    if (animation === 'float-spin' && isSpinReverse) {
      textEl.style.animationDirection = 'reverse';
    }

    // 添加到页面并自动移除
    document.body.appendChild(textEl);
    setTimeout(() => textEl.remove(), 1800);
  });
});

// 悬浮文字动画样式（注入到页面）
const styleEl = document.createElement('style');
styleEl.textContent = `
  .floating-text {
    pointer-events: none;
    will-change: transform, opacity;
    font-weight: bold;
  }
  .float-basic { animation: float-basic 1.8s ease-out forwards; }
  @keyframes float-basic { 0% { transform: translate(-50%, -50%); opacity: 1; } 100% { transform: translate(-50%, -120%); opacity: 0; } }
  .float-sway { animation: float-sway 1.8s ease-in-out forwards; }
  @keyframes float-sway { 0% { transform: translate(-50%, -50%); opacity: 1; } 25% { transform: translate(-40%, -70%); } 50% { transform: translate(-60%, -90%); } 75% { transform: translate(-45%, -110%); } 100% { transform: translate(-50%, -130%); opacity: 0; } }
  .float-spin { animation: float-spin 1.8s ease-out forwards; }
  @keyframes float-spin { 0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; } 100% { transform: translate(-50%, -120%) rotate(360deg); opacity: 0; } }
  .float-pulse { animation: float-pulse 1.8s ease-out forwards; }
  @keyframes float-pulse { 0% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 50% { transform: translate(-50%, -80%) scale(1.3); } 100% { transform: translate(-50%, -120%) scale(0.7); opacity: 0; } }
  .float-gradient { animation: float-gradient 1.8s ease-out forwards; }
  @keyframes float-gradient { 0% { transform: translate(-50%, -50%); opacity: 1; filter: hue-rotate(0deg); } 100% { transform: translate(-50%, -120%); opacity: 0; filter: hue-rotate(180deg); } }
  .float-wave { animation: float-wave 1.8s ease-in-out forwards; }
  @keyframes float-wave { 0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; } 25% { transform: translate(-45%, -70%) rotate(5deg); } 50% { transform: translate(-55%, -90%) rotate(-5deg); } 75% { transform: translate(-48%, -110%) rotate(3deg); } 100% { transform: translate(-50%, -130%) rotate(0deg); opacity: 0; } }
  .float-flash { animation: float-flash 1.8s ease-out forwards; }
  @keyframes float-flash { 0%,20%,40%,60%,80% { opacity: 1; } 10%,30%,50%,70%,90% { opacity: 0.5; } 0% { transform: translate(-50%, -50%); } 100% { transform: translate(-50%, -120%); opacity: 0; } }
  .float-spiral { animation: float-spiral 1.8s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  @keyframes float-spiral { 0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; } 25% { transform: translate(-40%, -70%) rotate(90deg); } 50% { transform: translate(-60%, -90%) rotate(180deg); } 75% { transform: translate(-45%, -110%) rotate(270deg); } 100% { transform: translate(-50%, -130%) rotate(360deg); opacity: 0; } }
`;
document.head.appendChild(styleEl);
