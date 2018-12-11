const admin = document.querySelector('#admin');
const adminPass = document.querySelector('#adminPass');

admin.addEventListener('change', () => {
  if (admin.checked) adminPass.style.display = 'block';
  else adminPass.style.display = 'none';
});
