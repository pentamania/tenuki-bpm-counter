import TempoCounter from "./TempoCounter.js";
const removeAllChildren = (el) => {
  while (el.children.length) {
    el.removeChild(el.children[0]);
  }
};

// service workerのセットアップ
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then((registration) => {
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
    })
    .catch((err) => {
      console.log("ServiceWorker registration failed: ", err);
    });
}

// main
window.addEventListener("DOMContentLoaded", (e) => {
  const counter = new TempoCounter();
  const bpmOutputEl = document.getElementById("bpm-output");
  const predictedBpmOutputEl = document.getElementById("bpm-output-predicted");
  const beater = document.getElementById("beater");
  const countLogArea = document.getElementById("count-log-list");
  const resetBtn = document.getElementById("reset-btn");
  let resetFlag = false;

  const _tapReaction = () => {
    beater.classList.add("scaledown");

    // 計測
    const deltaTime = counter.count((bpm) => {
      bpmOutputEl.innerHTML = bpm.toFixed(2);
    });

    // 時間差分ログを表示
    const li = document.createElement("li");
    li.innerText = deltaTime.toFixed(2) + " ms";
    countLogArea.prepend(li);
  };

  const _resetState = () => {
    counter.clear();
    bpmOutputEl.innerText = 0;
    removeAllChildren(countLogArea);
    resetFlag = false;
    console.log("reset");
  };

  /**
   * event handlers
   */
  const keyDownHandler = (e) => {
    // Shift + Space で計測
    if (e.shiftKey) {
      // 必要に応じてリセット
      if (resetFlag) _resetState();

      beater.classList.add("shiftPressed");
      // beater.classList.add('heart');

      if (e.keyCode === 32) {
        // if (e.code === "Space") {
        e.preventDefault();
        _tapReaction();
      }
    }
  };

  const keyUpHandler = (e) => {
    beater.classList.remove("scaledown");
    if (!e.shiftKey) {
      beater.classList.remove("shiftPressed");
      resetFlag = true;
      // _resetState();
    }
  };

  // mouseでカウント
  const mouseDownHandler = (e) => {
    e.preventDefault();
    _tapReaction();
    resetFlag = true;
  };

  const mouseUpHandler = (e) => {
    beater.classList.remove("scaledown");
  };

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  bpmOutputEl.addEventListener("mousedown", mouseDownHandler, false);
  bpmOutputEl.addEventListener("mouseup", mouseUpHandler, false);
  resetBtn.addEventListener("click", _resetState, false);
});
