let role = "";

async function startVideo(videoId) {
  const video = document.getElementById(videoId);
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;
}

async function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  const res = await fetch("https://script.google.com/macros/s/AKfycbzAZBU9JxhGe_NvKvYK03k8l624A-X-UTXs9JRoF8edecF6Z6kzCAWO4xCoA-_48t-8EA/exec", {
    method: "POST",
    body: JSON.stringify({ user, pass }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  if (data.success) {
    role = data.role;
    document.getElementById("login-section").style.display = "none";

    if (role === "user") {
      document.getElementById("absen-section").style.display = "block";
      startVideo("video");
    } else if (role === "admin") {
      document.getElementById("admin-section").style.display = "block";
      startVideo("video-admin");
    }
  } else {
    alert("Login gagal!");
  }
}

async function getDescriptor(videoId) {
  const video = document.getElementById(videoId);
  const detections = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detections ? Array.from(detections.descriptor) : null;
}

async function scanWajahUser() {
  document.getElementById("status-user").innerText = "Mencocokkan wajah...";
  const descriptor = await getDescriptor("video");
  if (!descriptor) {
    document.getElementById("status-user").innerText = "Wajah tidak terdeteksi!";
    return;
  }

  const res = await fetch("https://script.google.com/macros/s/AKfycbzAZBU9JxhGe_NvKvYK03k8l624A-X-UTXs9JRoF8edecF6Z6kzCAWO4xCoA-_48t-8EA/exec?action=absen", {
    method: "POST",
    body: JSON.stringify({ descriptor }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  document.getElementById("status-user").innerText = data.message;
}

async function scanWajahAdmin() {
  const nama = document.getElementById("nama").value;
  const posisi = document.getElementById("posisi").value;
  document.getElementById("status-admin").innerText = "Mendeteksi dan menyimpan wajah...";

  const descriptor = await getDescriptor("video-admin");
  if (!descriptor) {
    document.getElementById("status-admin").innerText = "Wajah tidak terdeteksi!";
    return;
  }

  const res = await fetch("https://script.google.com/macros/s/AKfycbzAZBU9JxhGe_NvKvYK03k8l624A-X-UTXs9JRoF8edecF6Z6kzCAWO4xCoA-_48t-8EA/exec?action=simpan", {
    method: "POST",
    body: JSON.stringify({ nama, posisi, descriptor }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  document.getElementById("status-admin").innerText = data.message;
}
 
Promise.all([
 faceapi.nets.tinyFaceDetector.loadFromUri('models/tiny_face_detector')
faceapi.nets.faceLandmark68Net.loadFromUri('models/face_landmark_68')
faceapi.nets.faceRecognitionNet.loadFromUri('models/face_recognition')
]).then(() => {
  document.getElementById("login-section").style.display = "block";
}).catch(err => {
  alert("Gagal memuat model face-api: " + err.message);
  console.error(err);
});
