// File: public/js/login.js

const loginUrl = "https://script.google.com/macros/s/AKfycbwe80uzI8OaCcOo3OtnsaZ-59WzqBt-oQwKDnp2VQeOOKgjwykQtPY8kkYU9kRSkCqw/exec"; // ganti dengan URL Web App GAS kamu

function prosesLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const pesan = document.getElementById("pesan");

  fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "login", username, password })
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "ok") {
        if (res.role === "admin") {
          window.location.href = "dashboard.html";
        } else {
          alert("Login berhasil sebagai user. Fitur belum tersedia.");
        }
      } else {
        pesan.textContent = res.message || "Login gagal";
      }
    })
    .catch(err => {
      console.error(err);
      pesan.textContent = "Terjadi kesalahan login";
    });
}
