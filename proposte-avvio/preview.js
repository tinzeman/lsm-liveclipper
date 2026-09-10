const preview = document.querySelector('dialog');
for (const button of document.querySelectorAll('[data-preview]')) {
  button.addEventListener('click', () => {
    document.querySelector('#preview-title').textContent = button.dataset.preview;
    preview.showModal();
  });
}
preview.addEventListener('click', event => {
  if (event.target !== preview) return;
  const rect = preview.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) preview.close();
});
