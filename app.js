emailjs.init("MJzgZh1FY-5o66gnS");

const video = document.getElementById("camera");
const preview = document.getElementById("preview");
const captureBtn = document.getElementById("captureBtn");
const sendBtn = document.getElementById("sendBtn");

let canvas = document.createElement("canvas");
let imageBase64 = "";
let userLocation = "";

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });
        video.srcObject = stream;
    } catch (e) {
        alert("Camera permission denied. Please allow camera access.");
    }
}

// Capture Photo
captureBtn.addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    imageBase64 = canvas.toDataURL("image/png");
    preview.src = imageBase64;
    preview.style.display = "block";
});

// Get location
function getLocation() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve(`https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`);
            },
            () => resolve("Location not shared"),
            { enableHighAccuracy: true }
        );
    });
}

// Send Email
sendBtn.addEventListener("click", async () => {
    if (!imageBase64) {
        alert("Please capture a photo first!");
        return;
    }

    userLocation = await getLocation();

    const details = document.getElementById("details").value;

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        details: details,
        image: imageBase64,
        location: userLocation
    })
    .then(() => {
        alert("Report sent successfully!");
    })
    .catch(err => {
        alert("Failed to send report.");
        console.error(err);
    });
});

startCamera();
