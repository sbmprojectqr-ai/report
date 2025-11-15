// ====== CONFIG: REPLACE THESE VALUES with your EmailJS info ======
const EMAILJS_SERVICE_ID = "sbmprojectqr@gmail.com";    
const EMAILJS_TEMPLATE_ID = "template_qsgyy3e"; 
const EMAILJS_PUBLIC_KEY = "MJzgZh1FY-5o66gnS";   
// =================================================================

emailjs.init(EMAILJS_PUBLIC_KEY);

const fileInput = document.getElementById('fileInput');
const captureBtn = document.getElementById('captureBtn');
const preview = document.getElementById('preview');
const detailsEl = document.getElementById('details');
const locText = document.getElementById('locText');
const sendBtn = document.getElementById('sendBtn');

let imageBase64 = null;
let locationData = null;

// Camera open
captureBtn.addEventListener('click', () => {
  fileInput.value = '';
  fileInput.click();
});

// After image captured
fileInput.addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (!f) return;

  preview.src = URL.createObjectURL(f);
  preview.style.display = 'block';

  convertFileToBase64(f).then(b64 => imageBase64 = b64);

  captureLocation();
});

function convertFileToBase64(file) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function captureLocation() {
  if (!navigator.geolocation) {
    locText.textContent = "Location not supported";
    return;
  }

  locText.textContent = "Requesting location...";

  navigator.geolocation.getCurrentPosition(
    pos => {
      locationData = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        acc: pos.coords.accuracy
      };
      locText.textContent = `Location: ${locationData.lat.toFixed(5)}, ${locationData.lng.toFixed(5)} (±${Math.round(locationData.acc)}m)`;
    },
    err => {
      locText.textContent = "Location permission denied";
      locationData = null;
    },
    { enableHighAccuracy: true }
  );
}

sendBtn.addEventListener('click', async () => {
  if (!imageBase64) {
    alert("Capture a photo first.");
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  const locationLink = locationData 
    ? `https://maps.google.com/?q=${locationData.lat},${locationData.lng}`
    : "Location not shared";

  const templateParams = {
    details: detailsEl.value.trim() || "(no details)",
    image: imageBase64,
    location: locationLink,
    reported_at: new Date().toISOString()
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

    alert("Report sent successfully!");
    sendBtn.textContent = "Send Report";
    sendBtn.disabled = false;

    // reset UI
    preview.style.display = "none";
    imageBase64 = null;
    detailsEl.value = "";

  } catch (err) {
    alert("Failed to send. Try again.");
    sendBtn.textContent = "Send Report";
    sendBtn.disabled = false;
  }
});
