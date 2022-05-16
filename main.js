import ffmpeg_run from ffmpeg_asm
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
  log: true,
});
console.log("Hello");
localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

const webcam = document.getElementById('webcam');
const recordBtn = document.getElementById('record');
const startRecording = () => {
  const rec = new MediaRecorder(webcam.srcObject);
  const chunks = [];
  
  recordBtn.textContent = 'Stop Recording';
  recordBtn.onclick = () => {
    rec.stop();
    recordBtn.textContent = 'Start Recording';
    recordBtn.onclick = startRecording;
  }

  rec.ondataavailable = e => chunks.push(e.data);
  rec.onstop = async () => {
    transcode(new Uint8Array(await (new Blob(chunks)).arrayBuffer()));
  };
  rec.start();
};

(async () => {
  webcam.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  await webcam.play();
  recordBtn.disabled = false;
  recordBtn.onclick = startRecording;
})();

const transcode = async (webcamData) => {
  const message = document.getElementById('message');
  const name = 'record.webm';
  message.innerHTML = 'Loading ffmpeg-core.js';
  await ffmpeg.load();
  message.innerHTML = 'Start transcoding';
  ffmpeg.FS('writeFile', name, await fetchFile(webcamData));
  await ffmpeg.run('-i', name,  'output.mp4');
  message.innerHTML = 'Complete transcoding';
  const data = ffmpeg.FS('readFile', 'output.mp4');

  const video = document.getElementById('output-video');
  video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}