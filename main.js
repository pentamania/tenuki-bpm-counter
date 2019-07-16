import TempoCounter from './TempoCounter.js'
const DELTA_LOG_DISPLAY_NUM = 8;

window.addEventListener('DOMContentLoaded', (e)=> {

  const counter = new TempoCounter();
  const bpmOutputEl = document.getElementById('bpm-output');
  const beater = document.getElementById('beater');
  const countLogArea = document.getElementById('count-log-list');
  const resetBtn = document.getElementById('reset-btn');
  let resetFlag = false;

  const _tapReaction = ()=> {
    beater.classList.add('scaledown');
    counter.count((bpm)=> {
      bpmOutputEl.innerHTML = bpm.toFixed(2);
    });

    // deltaログを表示
    var li = document.createElement('li');
    li.innerText = counter.deltaLogs[0].toFixed(2) + " ms";
    countLogArea.appendChild(li);
    if (countLogArea.children.length > DELTA_LOG_DISPLAY_NUM) {
      countLogArea.removeChild(countLogArea.children[0]);
    };
  }

  const _resetState = ()=> {
    counter.clear();
    bpmOutputEl.innerText = 0;
    while (countLogArea.children.length) {
      countLogArea.removeChild(countLogArea.children[0]);
    }
    resetFlag = false;
    console.log("reset");
  };

  /**
   * event handlers
   */
  const keyDownHandler = (e)=> {
    if (e.shiftKey) {
      // Shift + Space で計測
      if (resetFlag) _resetState();
      beater.classList.add('shiftPressed');
      // beater.classList.add('heart');
      if (e.keyCode === 32) {
      // if (e.code === "Space") {
        e.preventDefault();
        _tapReaction();
      }
    }
  }
  const keyUpHandler = (e)=>{
    beater.classList.remove('scaledown');
    if (!e.shiftKey) {
      beater.classList.remove('shiftPressed');
      resetFlag = true;
      // _resetState();
    }
  }
  // mouseでカウント
  const mouseDownHandler = (e)=> {
    e.preventDefault();
    _tapReaction();
    resetFlag = true;
  };

  const mouseUpHandler = (e)=> {
    beater.classList.remove('scaledown');
  };

  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
  bpmOutputEl.addEventListener('mousedown', mouseDownHandler, false);
  bpmOutputEl.addEventListener('mouseup', mouseUpHandler, false);
  resetBtn.addEventListener('click', _resetState, false);
})
