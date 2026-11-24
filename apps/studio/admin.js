(() => {
  const button = document.getElementById("liveSwitch");
  const tokenInput = document.getElementById("token");
  const message = document.getElementById("message");
  let status = { state: "connecting", live: false };
  tokenInput.value = sessionStorage.getItem("loop-admin-token") || "";
  document.getElementById("saveToken").onclick = () => {
    sessionStorage.setItem("loop-admin-token", tokenInput.value.trim());
    message.textContent = "Token saved for this browser tab.";
    message.className = "";
  };

  function paint() {
    const state = document.getElementById("state");
    state.textContent = status.state;
    state.className = `state${status.live ? " live" : ""}`;
    document.getElementById("status").textContent = status.live
      ? "Live on Amazon IVS · FFmpeg is sending the looping source"
      : status.state === "starting" ? "Starting the AWS broadcast worker…" : status.state === "stopping" ? "Stopping the broadcast…" : status.state === "error" ? "The broadcast stopped with an error" : "Replay is playing from S3 through CloudFront";
    button.setAttribute("aria-checked", String(status.live || status.state === "starting"));
    button.disabled = ["connecting", "starting", "stopping"].includes(status.state);
    button.setAttribute("aria-label", status.live ? "Stop live broadcast" : "Start live broadcast");
  }

  async function refresh() {
    try {
      const response = await fetch("/api/status");
      status = await response.json();
      if (!response.ok) throw new Error(status.error || "Status request failed");
      message.textContent = status.error || "";
      message.className = status.error ? "error" : "";
      paint();
    } catch (error) {
      status = { state: "error", live: false };
      message.textContent = error.message;
      message.className = "error";
      paint();
    }
  }

  button.onclick = async () => {
    const token = tokenInput.value.trim() || sessionStorage.getItem("loop-admin-token");
    if (!token) { message.textContent = "Enter the admin token from .env.local first."; message.className = "error"; return; }
    button.disabled = true;
    message.textContent = "Sending broadcast command…";
    message.className = "";
    try {
      const response = await fetch("/api/admin/live", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ live: !status.live && status.state !== "starting" }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Broadcast command failed");
      status = result;
      message.textContent = status.state === "starting" ? "Broadcast worker starting. IVS playback will appear when it is live." : "Replay mode restored.";
      paint();
    } catch (error) {
      message.textContent = error.message;
      message.className = "error";
      button.disabled = false;
    }
    refresh();
  };

  refresh();
  setInterval(refresh, 10000);
})();
