var getMedian = (arr)=> {
  var clone = arr.slice();
  clone.sort((a, b)=> a - b);
  const half = clone.length / 2 | 0;
  if (clone.length%2 === 0) {
    // even
    return (clone[half-1] + clone[half]) / 2;
  } else {
    // odd
    return clone[half];
  }
}
var calcAverage = (arr)=> {
  return arr.reduce((a, b)=> a+b, 0) / arr.length;
}

/**
 * @class TempoCounter
 */
export default class TempoCounter {
  get deltaLogs() {return this._deltaLogs;}

  constructor() {
    this._past = 0;
    // this._bpm = 0;
    this._deltaLogs = [];
    this._elapsedTime = 0;
    this._beatCount = 0;
  }

  _logDelta(delta) {
    this._deltaLogs.unshift(delta);
  }

  count(cb) {
    let delta = 0;

    if (!this._past) {
      // start timer
      this._past = performance.now();
    } else {
      // update timer
      let now = performance.now();
      delta = now - this._past;
      this._logDelta(delta);
      this._past = now;
      this._elapsedTime += delta;
      this._beatCount++;

      // callback
      if (cb && typeof(cb) === 'function')
        cb(this.bpm);
    }

    return delta;
  }

  // 時間差分全データの平均から
  getBpmByAverage() {
    const avg = calcAverage(this._deltaLogs);
    return 60000 / avg; // 60 / avg*1000
  }

  // 中央値から計算
  getBpmByMedian() {
    return 60000 / getMedian(this._deltaLogs);
  }

  // 経過時間と拍数から計算
  getBpmByElapsedTime() {
    const t = this._elapsedTime / this._beatCount;
    return 60000 / t;
  }

  get bpm() { return this.getBpmByElapsedTime(); }
  // get bpm() { return this.getBpmByMedian(); }
  // get bpm() { return this.getBpmByAverage(); }

  clear() {
    this._deltaLogs = [];
    // this._bpm = 0;
    this._past = 0;
    this._elapsedTime = 0;
    this._beatCount = 0;
  }
}
