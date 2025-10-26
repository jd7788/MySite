// 悬浮文字核心逻辑
document.addEventListener('DOMContentLoaded', () => {
  // 文字库
  const floatingTexts = [
    "哇！", "Nice✨", "好耶~", "Cool😎", "666", 
    "真棒！", "冲呀！", "厉害👍", "优秀！", "💯", 
    "🎉", "加油！", "Perfect", "Yeah!", "🌟"
  ];

  // 颜色库
  const textColors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#EC4899", "#06B6D4", "#F97316",
    "#14B8A6", "#84CC16", "#DB2777", "#6366F1"
  ];

  // 动画类型
  const animationTypes = [
    "float-basic", "float-sway", "float-spin", 
    "float-pulse", "float-gradient", "float-wave", 
    "float-flash", "float-spiral"
  ];

  // 监听整个文档的点击事件（包括所有区域）
  document.addEventListener('click', (e) => {
    // 随机选择配置
    const text = floatingTexts[Math.floor(Math.random() * floatingTexts.length)];
    const color = textColors[Math.floor(Math.random() * textColors.length)];
    const animation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    const isSpinReverse = Math.random() > 0.5;

    // 创建文字元素
    const textEl = document.createElement('span');
    textEl.textContent = text;
    textEl.className = `floating-text ${animation}`;
    textEl.style.color = color;

    // 关键修复：使用fixed定位+视口坐标，确保在任何位置点击都能显示
    // 计算文字基线偏移，使视觉中心与点击点对齐
    textEl.style.left = `${e.clientX}px`;
    textEl.style.top = `${e.clientY}px`;
    textEl.style.transform = 'translate(-50%, -50%)'; // 居中对齐点击点

    // 旋转方向处理
    if (animation === 'float-spin' && isSpinReverse) {
      textEl.style.animationDirection = 'reverse';
    }

    // 添加到页面
    document.body.appendChild(textEl);

    // 动画结束后移除
    setTimeout(() => textEl.remove(), 1800);
  });
});