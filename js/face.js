// File: public/js/face.js

const video = document.getElementById("video");
const statusDiv = document.getElementById("status");

async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
  await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
  statusDiv.textContent = "Status: model wajah siap";
}

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;
  statusDiv.textContent = "Status: kamera aktif";
}

async function captureFaceEncoding() {
  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    statusDiv.textContent = "Status: wajah tidak terdeteksi";
    return null;
  }

  statusDiv.textContent = "Status: wajah terdeteksi";
  return detection.descriptor;
}

async function startAbsen() {
  statusDiv.textContent = "Status: memproses absen...";
  const encoding = await captureFaceEncoding();
  if (!encoding) return;
  kirimAbsenKeSheet(encoding);
}

async function inputWajahBaru() {
  const nama = prompt("Masukkan nama teknisi:");
  if (!nama) return;
  statusDiv.textContent = `Status: memproses wajah baru untuk ${nama}...`;
  const encoding = await captureFaceEncoding();
  if (!encoding) return;
  simpanWajahKeSheet(nama, encoding);
}

// Jalankan saat halaman dimuat
window.addEventListener("DOMContentLoaded", async () => {
  await loadModels();
  await startCamera();
});
