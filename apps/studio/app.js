const names = ["The art of a slower morning", "Everyday objects, reimagined"];
const modal = document.getElementById("modal"),
  video = document.getElementById("media");
function openPlayer(i) {
  document.getElementById("title").textContent = names[i];
  document.querySelector(".video").className = "video t" + (i + 1);
  modal.classList.add("show");
  video.play().catch(() => toast("Press play to start the preview"));
}
function closePlayer() {
  modal.classList.remove("show");
  video.pause();
}
async function pip() {
  try {
    if (document.pictureInPictureElement) await document.exitPictureInPicture();
    else if (document.pictureInPictureEnabled)
      await video.requestPictureInPicture();
    else toast("Picture-in-Picture is unavailable in this browser");
  } catch (e) {
    toast("Start video playback, then try PiP again");
  }
}
function toast(s) {
  let t = document.getElementById("toast");
  t.textContent = s;
  t.style.display = "block";
  setTimeout(() => (t.style.display = "none"), 2200);
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !document.pictureInPictureElement) closePlayer();
});
document.querySelectorAll("nav a").forEach(
  (a) =>
    (a.onclick = () => {
      document
        .querySelectorAll("nav a")
        .forEach((x) => x.classList.remove("active"));
      a.classList.add("active");
      toast(a.textContent + " collection selected");
    }),
);
document.querySelectorAll(".thumb button").forEach((b, i) => {
  if (i === 2)
    b.onclick = () => toast("Reminder set for Color, confidence & you");
});
document.querySelectorAll(".controls").forEach(
  (x) =>
    (x.onclick = (e) => {
      if (e.target.textContent.includes("⛶"))
        document.querySelector(".player").requestFullscreen?.();
    }),
);
document.querySelectorAll(".chat input").forEach(
  (i) =>
    (i.onkeydown = (e) => {
      if (e.key === "Enter" && i.value.trim()) {
        let p = document.createElement("p");
        p.textContent = "You: " + i.value;
        i.before(p);
        i.value = "";
      }
    }),
);
