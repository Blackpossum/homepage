// targeted dom elements
const themeToggle = document.getElementById("theme-toggle");
const wireframeToggle = document.getElementById("wireframe-toggle");
const layerWire = document.getElementById("layer-wire");
const wireframeInner = document.getElementById("wireframe-inner");
const cursorRing = document.getElementById("cursor-ring");
const cursorDot = document.getElementById("cursor-dot");
const cursorHint = document.getElementById("cursor-hint");

function applyTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  themeToggle.checked = isDark;
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

const wireframeNotes = [
  "designer note: maybe give this section more space",
  "designer note: this block looks too serious, better not let joker read this or he will say 'why so serious?'😒",
  "designer note: add a little orange accent here, or other color, wait.. im not good at colors :v",
  "designer note: align this copy to the grid",
  "designer note: did we remember mobile padding?"
];

// function handler
function buildWireframeBlocks() {
  if (!wireframeInner) return;

  const blocks = document.querySelectorAll(".resume__block");
  wireframeInner.innerHTML = "";

  blocks.forEach((block, index) => {
    const rect = block.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const wrapper = document.createElement("div");
    wrapper.className = `wf-block ${index % 3 === 0 ? "wf-accent" : index % 3 === 1 ? "wf-name" : "wf-green"}`;
    wrapper.style.top = `${rect.top}px`;
    wrapper.style.left = `${rect.left}px`;
    wrapper.style.width = `${rect.width}px`;
    wrapper.style.height = `${rect.height}px`;

    const heading = block.querySelector("h1, h2, h3");
    const label = document.createElement("span");
    label.className = "wf-label";
    label.textContent = heading ? heading.textContent.trim().split("\n")[0] : `Section ${index + 1}`;

    wrapper.appendChild(label);
    wireframeInner.appendChild(wrapper);
  });

  const noteOffsets = [
    { top: 140, left: 32, note: wireframeNotes[0] },
    { top: 330, left: 520, note: wireframeNotes[1] },
    { top: 540, left: 40, note: wireframeNotes[2] },
    { top: 720, left: 450, note: wireframeNotes[3], small: true }
  ];

  noteOffsets.forEach(({ top, left, note, small }) => {
    const noteEl = document.createElement("div");
    noteEl.className = `wf-note${small ? " wf-note-small" : ""}`;
    noteEl.textContent = note;
    noteEl.style.top = `${top}px`;
    noteEl.style.left = `${left}px`;
    wireframeInner.appendChild(noteEl);
  });

  const egg = document.createElement("div");
  egg.className = "wf-egg";
  egg.textContent = "wireframe view";
  egg.style.top = `${window.innerHeight - 130}px`;
  egg.style.left = "24px";
  wireframeInner.appendChild(egg);
}

function applyWireframe(isOn) {
  if (!layerWire || !wireframeToggle) return;
  layerWire.classList.toggle("hidden", !isOn);
  document.body.classList.toggle("wireframe-off", !isOn);
  wireframeToggle.textContent = isOn ? "to boring right?, try this then :Boom it's On" : "to boring right?, try this then : Off";
  localStorage.setItem("wireframe", isOn ? "on" : "off");

  if (isOn) {
    buildWireframeBlocks();
  } else {
    if (cursorRing) cursorRing.style.left = "-300px";
    if (cursorDot) cursorDot.style.left = "-300px";
    if (cursorHint) cursorHint.style.left = "-300px";
    if (layerWire) layerWire.style.clipPath = "circle(0px at -300px -300px)";
  }
}

function scheduleWireframeRefresh() {
  if (!layerWire || layerWire.classList.contains("hidden")) return;
  window.requestAnimationFrame(buildWireframeBlocks);
}

function updateCursor(x, y) {
  if (layerWire) {
    layerWire.style.clipPath = `circle(160px at ${x}px ${y}px)`;
  }

  if (cursorRing) {
    cursorRing.style.left = `${x}px`;
    cursorRing.style.top = `${y}px`;
  }

  if (cursorDot) {
    cursorDot.style.left = `${x}px`;
    cursorDot.style.top = `${y}px`;
  }

  if (cursorHint) {
    cursorHint.style.left = `${x + 24}px`;
    cursorHint.style.top = `${y + 24}px`;
  }
}

function setCursorState(state) {
  if (!cursorRing || !cursorHint) return;

  if (state === "hover") {
    cursorRing.style.transform = "translate(-50%, -50%) scale(1.55)";
    cursorRing.style.borderColor = "rgba(255, 154, 0, 0.95)";
    cursorHint.textContent = "open";
  } else {
    cursorRing.style.transform = "translate(-50%, -50%) scale(1)";
    cursorRing.style.borderColor = "";
    cursorHint.textContent = "ready";
  }
}

// event listener
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  const savedWireframe = localStorage.getItem("wireframe");

  if (savedTheme === "dark") {
    applyTheme(true);
  }

  applyWireframe(savedWireframe !== "off");
});

window.addEventListener("resize", scheduleWireframeRefresh);
window.addEventListener("scroll", scheduleWireframeRefresh);

window.addEventListener("pointermove", event => {
  updateCursor(event.clientX, event.clientY);
});

window.addEventListener("pointerleave", () => {
  if (cursorRing) cursorRing.style.left = "-300px";
  if (cursorDot) cursorDot.style.left = "-300px";
  if (cursorHint) cursorHint.style.left = "-300px";
  if (layerWire) layerWire.style.clipPath = "circle(0px at -300px -300px)";
});

window.addEventListener("pointerover", event => {
  const target = event.target.closest("a, button, input, textarea, [role=\"button\"]");
  if (target) {
    setCursorState("hover");
  }
});

window.addEventListener("pointerout", event => {
  const related = event.relatedTarget;
  if (!related || !related.closest || !related.closest("a, button, input, textarea, [role=\"button\"]")) {
    setCursorState("default");
  }
});

themeToggle.addEventListener("change", e => {
  applyTheme(e.target.checked);
});

if (wireframeToggle) {
  wireframeToggle.addEventListener("click", () => {
    const isActive = !layerWire.classList.contains("hidden");
    applyWireframe(!isActive);
  });
}
