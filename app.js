const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let model;
let tooltip = document.getElementById("tooltip");

canvas.addEventListener("mousemove", (event) => {
  handleTooltip(event);
});

canvas.addEventListener("mouseout", () => {
  hideTooltip();
});

async function loadModel() {
  model = await cocoSsd.load();
  console.log("Model loaded");
  detectFrame(video, model);
}

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      video.srcObject = stream;
      video.addEventListener("loadeddata", loadModel);
    });
}

async function detectFrame(video, model) {
  const predictions = await model.detect(video);
  renderPredictions(predictions);
  requestAnimationFrame(() => {
    detectFrame(video, model);
  });
}

function renderPredictions(predictions) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 4;
  ctx.font = "24px Arial";
  ctx.fillStyle = "green";

  predictions.forEach((prediction) => {
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    const width = prediction.bbox[2];
    const height = prediction.bbox[3];
    ctx.rect(x, y, width, height);
    ctx.stroke();
    ctx.fillText(prediction.class, x, y - 10);
  });
}

function handleTooltip(event) {
  // ... existing tooltip handling code ...
}

function hideTooltip() {
  // ... existing tooltip hiding code ...
}

async function captureEnvironment() {
  // Create a Potree viewer
  const viewer = new Potree.Viewer(document.getElementById("canvas"));

  // Configure the viewer
  viewer.setEDLEnabled(false);
  viewer.setFOV(60);
  viewer.setPointBudget(1_000_000);
  viewer.loadSettingsFromURL();

  // Load a 3D point cloud
  const pointCloudUrl = "path/to/your/pointcloud/cloud.js";
  const response = await Potree.XHRFactory.createXMLHttpRequest();
  response.open("GET", pointCloudUrl, false);
  response.send(null);

  const properties = JSON.parse(response.responseText);
  const pointCloud = Potree.createPointCloud(properties, pointCloudUrl);

  // Add the point cloud to the viewer
  viewer.scene.addPointCloud(pointCloud);
  viewer.fitToScreen();
}

startVideo();
