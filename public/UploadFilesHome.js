const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const files = document.getElementById('fileInput').files;
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i]);
  }
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload');
  xhr.send(formData);
});