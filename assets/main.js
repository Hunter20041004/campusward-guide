const showDemo = document.querySelector('#show-demo');
showDemo?.addEventListener('click', () => {
  const result = document.querySelector('#demo-result');
  result.hidden = !result.hidden;
  showDemo.setAttribute('aria-expanded', String(!result.hidden));
  showDemo.textContent = result.hidden ? '看示範回覆' : '收起示範回覆';
});
const copyPrompt = document.querySelector('#copy-prompt');
copyPrompt?.addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(document.querySelector('#sample-prompt').textContent);
    status.textContent = '已複製，可以到實際產品貼上。';
  } catch {
    status.textContent = '這個瀏覽器無法直接複製，請選取上方文字後手動複製。';
  }
});
