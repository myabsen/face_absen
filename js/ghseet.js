// File: public/js/gsheet.js

// Ganti URL berikut dengan URL Web Apps dari Google Apps Script kamu
const GAS_URL = "https://script.google.com/macros/s/AKfycbwe80uzI8OaCcOo3OtnsaZ-59WzqBt-oQwKDnp2VQeOOKgjwykQtPY8kkYU9kRSkCqw/exec";

function kirimAbsenKeSheet(encoding) {
  const data = {
    mode: "absen",
    encoding: JSON.stringify(Array.from(encoding))
  };

  fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(res => {
      statusDiv.textContent = `Status: ${res.message}`;
    })
    .catch(err => {
      console.error(err);
      statusDiv.textContent = "Status: gagal mengirim absen";
    });
}

function simpanWajahKeSheet(nama, encoding) {
  const data = {
    mode: "simpan",
    nama: nama,
    encoding: JSON.stringify(Array.from(encoding))
  };

  fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(res => {
      statusDiv.textContent = `Status: ${res.message}`;
    })
    .catch(err => {
      console.error(err);
      statusDiv.textContent = "Status: gagal menyimpan wajah";
    });
}
