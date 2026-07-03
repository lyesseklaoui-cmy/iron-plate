// ==============================
// IRON PLATE - FULL APP v3
// Multi Exercise Timer Version
// ==============================

// ---------- WORKOUT DATA ----------
const days = {
  mon: {
    label: "MON",
    tag: "strength",
    tagLabel: "STRENGTH + METCON",
    blocks: [
      {
        title: "Warm-up",
        time: "10 min",
        exercises: [
          { name: "Row or run in place", detail: "500m" },
          { name: "Air squats", detail: "10 reps" },
          { name: "Arm circles", detail: "10 each direction" }
        ]
      },
      {
        title: "Strength",
        time: "20 min",
        exercises: [
          { name: "Back Squat", detail: "5x5 increasing weight" }
        ]
      }
    ]
  },

  tue: {
    label: "TUE",
    tag: "mobility",
    tagLabel: "MOBILITY DAY",
    blocks: [
      {
        title: "Mobility Flow",
        time: "30 min",
        exercises: [
          { name: "Hip flexor stretch", detail: "2 min each side" },
          { name: "90/90 hip stretch", detail: "2 min each side" }
        ]
      }
    ]
  },

  wed: {
    label: "WED",
    tag: "strength",
    tagLabel: "STRENGTH + METCON",
    blocks: [
      {
        title: "Strength",
        time: "20 min",
        exercises: [
          { name: "Deadlift", detail: "5x5 increasing weight" }
        ]
      },
      {
        title: "Metcon",
        time: "15 min",
        exercises: [
          { name: "Kettlebell swings", detail: "21-15-9" },
          { name: "Box jumps", detail: "21-15-9" }
        ]
      }
    ]
  },

  thu: {
    label: "THU",
    tag: "rest",
    tagLabel: "REST",
    blocks: [
      {
        title: "Recovery",
        time: "",
        exercises: [
          { name: "Light activity or rest", detail: "walk, stretch, recover" }
        ]
      }
    ]
  },

  fri: {
    label: "FRI",
    tag: "strength",
    tagLabel: "STRENGTH + METCON",
    blocks: [
      {
        title: "Strength",
        time: "20 min",
        exercises: [
          { name: "Overhead Press", detail: "5x5 increasing weight" }
        ]
      },
      {
        title: "Metcon",
        time: "12 min AMRAP",
        exercises: [
          { name: "Burpees", detail: "5 reps" },
          { name: "Dumbbell rows", detail: "10 reps" }
        ]
      }
    ]
  },

  sat: {
    label: "SAT",
    tag: "mobility",
    tagLabel: "MOBILITY DAY",
    blocks: [
      {
        title: "Mobility Flow",
        time: "30 min",
        exercises: [
          { name: "Couch stretch", detail: "1 min each side" },
          { name: "Cat-cow", detail: "10 reps" }
        ]
      }
    ]
  },

  sun: {
    label: "SUN",
    tag: "rest",
    tagLabel: "FULL REST",
    blocks: [
      {
        title: "Recovery",
        time: "",
        exercises: [
          { name: "Full rest", detail: "no training" }
        ]
      }
    ]
  }
};

// ---------- STATE ----------
let currentDay = "mon";
let checkedState = JSON.parse(localStorage.getItem("ironplate-checks") || "{}");

// ---------- MULTI TIMERS ----------
let timers = {}; 
// key: "mon-0-0"

function getTimer(key){
  if(!timers[key]){
    timers[key] = {
      duration: 180,
      remaining: 180,
      running: false,
      interval: null
    };
  }
  return timers[key];
}

function formatTime(sec){
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0");
}

// ---------- CHECKBOX ----------
function toggleCheck(key){
  checkedState[key] = !checkedState[key];
  localStorage.setItem("ironplate-checks", JSON.stringify(checkedState));
  render();
}

// ---------- TIMER CONTROLS ----------
function startTimer(key){
  const t = getTimer(key);
  if(t.running) return;

  t.running = true;

  t.interval = setInterval(()=>{
    t.remaining--;

    if(t.remaining <= 0){
      clearInterval(t.interval);
      t.running = false;
      t.remaining = 0;
      alert("DONE ⏱ " + key);
    }

    updateTimerUI(key);
  },1000);
}

function pauseTimer(key){
  const t = getTimer(key);
  t.running = false;
  clearInterval(t.interval);
}

function resetTimer(key){
  const t = getTimer(key);
  pauseTimer(key);
  t.remaining = t.duration;
  updateTimerUI(key);
}

function setTimer(key, min){
  const t = getTimer(key);
  t.duration = min * 60;
  t.remaining = t.duration;
  pauseTimer(key);
  render();
}

function updateTimerUI(key){
  const el = document.getElementById("timer-" + key);
  if(el){
    el.textContent = formatTime(getTimer(key).remaining);
  }
}

// ---------- NAV ----------
function renderNav(){
  const nav = document.getElementById("dayNav");
  nav.innerHTML = "";

  Object.keys(days).forEach(k=>{
    const b = document.createElement("button");
    b.textContent = days[k].label;
    if(k === currentDay) b.classList.add("active");

    b.onclick = ()=>{
      currentDay = k;
      render();
    };

    nav.appendChild(b);
  });
}

// ---------- RENDER ----------
function render(){
  renderNav();

  const main = document.getElementById("main");
  const day = days[currentDay];

  let html = `<div class="day-tag">${day.tagLabel}</div>`;

  day.blocks.forEach((block, bi)=>{
    html += `
      <div class="block">
        <div class="block-head">
          <h2>${block.title}</h2>
          <span>${block.time}</span>
        </div>
    `;

    block.exercises.forEach((ex, ei)=>{
      const key = currentDay + "-" + bi + "-" + ei;
      const done = checkedState[key];

      const t = getTimer(key);

      html += `
        <div class="exercise ${done ? "done":""}">
          
          <div class="check ${done ? "checked":""}" onclick="toggleCheck('${key}')"></div>

          <div class="ex-info">
            <div class="ex-name">${ex.name}</div>
            <div class="ex-detail">${ex.detail}</div>

            <div class="mini-timer">
              <span id="timer-${key}">${formatTime(t.remaining)}</span>

              <button onclick="startTimer('${key}')">▶</button>
              <button onclick="pauseTimer('${key}')">⏸</button>
              <button onclick="resetTimer('${key}')">↻</button>
            </div>

            <div class="timer-presets">
              <button onclick="setTimer('${key}',1)">1m</button>
              <button onclick="setTimer('${key}',3)">3m</button>
              <button onclick="setTimer('${key}',5)">5m</button>
            </div>

          </div>
        </div>
      `;
    });

    html += `</div>`;
  });

  main.innerHTML = html;

  // refresh timers display
  Object.keys(timers).forEach(updateTimerUI);
}

// expose
window.toggleCheck = toggleCheck;
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.setTimer = setTimer;

// init
render();