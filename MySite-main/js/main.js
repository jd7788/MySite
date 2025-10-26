// 提交验证（优化错误提示）
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

    const { success, targetUrl, message } = await response.json();

    if (success && targetUrl) {
      modal.classList.add('hidden');
      window.open(targetUrl, '_blank');
    } else {
      // 显示后端返回的具体错误（如“该网站未设置密码”“密码错误”）
      showError(message || '验证失败，请重试');
    }
  } catch (err) {
    // 网络或超时错误
    showError(err.name === 'AbortError' ? '请求超时，请检查网络' : '服务器连接失败');
  } finally {
    // 恢复状态
    confirmText.textContent = '验证';
    loadingSpinner.classList.add('hidden');
    confirmText.disabled = false;
  }
}
