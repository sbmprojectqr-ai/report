// ====== CONFIG: REPLACE THESE VALUES with your EmailJS info ======
const EMAILJS_SERVICE_ID = "sbmprojectqr@gmail.com";    
const EMAILJS_TEMPLATE_ID = "template_qsgyy3e"; 
const EMAILJS_PUBLIC_KEY = "MJzgZh1FY-5o66gnS";   
// =================================================================

emailjs.init(EMAILJS_PUBLIC_KEY);

let imageBase64 = null;
let locationData = null;

const fileInput = document.getElementById("fileInput");
const captureBtn = document.getElementById("captureBtn");
const preview = document.getElementById("preview");
const sendBtn = document.getElementById("sendBtn");
const locText = document.getElementById("locText");
const details = document.getElementById("details");

// CAMERA BUTTON → OPEN CAMERA
captureBtn.addEventListener("click", () => {
  fileInput.click();
});

// WHEN USER TAKES PHOTO
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";

  convertToBase64(file).then(b64 => {
    imageBase64 = b64;
  });

  getLocation();
});

// FILE → BASE64
function convertToBase64(file){
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });
}

// LOCATION
function getLocation(){
  if (!navigator.geolocation){
    locText.textContent = "Location not supported";
    return;
  }

  locText.textContent = "Fetching location...";

  navigator.geolocation.getCurrentPosition(
    pos => {
      locationData = pos.coords;
      locText.textContent =
        `Location: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} (±${Math.round(pos.coords.accuracy)}m)`;
    },
    err => {
      locText.textContent = "Location denied";
      locationData = null;
    },
    { enableHighAccuracy: true }
  );
}

// SEND EMAIL
sendBtn.addEventListener("click", () => {
  if (!imageBase64){
    alert("Please capture a photo first.");
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  let mapLink = locationData
    ? `https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}`
    : "Location not available";

  const params = {
    details: details.value || "(no details)",
    image: imageBase64,
    location: mapLink
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
  .then(() => {
    alert("Report sent successfully!");
    sendBtn.textContent = "Send Report";
    sendBtn.disabled = false;
    preview.style.display = "none";
    details.value = "";
  })
  .catch(() => {
    alert("Failed to send. Try again.");
    sendBtn.textContent = "Send Report";
    sendBtn.disabled = false;
  });
});
