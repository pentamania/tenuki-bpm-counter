/**
 * @class TempoCounter
 */
export default class TempoCounter {
  get bpm() {return this._bpm;}
  get deltaLogs() {return this._deltaLogs;}

  constructor() {
    this._past = 0;
    this._bpm = 0;
    this._deltaLogs = [];
  }

  _logDelta(delta) {
    // this._deltaLogs.push(delta);
    this._deltaLogs.unshift(delta);
  }

  count(cb) {
    if (!this._past) {
      this._past = performance.now();
      this._logDelta(0);
    } else {
      let now, delta, sum, avg;
      now = performance.now();

      delta = now - this._past;
      this._logDelta(delta);
      this._past = now;

      // 差分の平均を得てbpm計算
      sum = this._deltaLogs.reduce((x,y)=> { return x + y; });
      avg = sum / this._deltaLogs.length;
      // this._bpm = (60 / avg*1000);
      this._bpm = (60000 / avg);

      // callback
      if (cb && typeof(cb) === 'function') cb(this._bpm);
    }
  }

  clear() {
    this._deltaLogs = [];
    this._bpm = 0;
    this._past = 0;
  }
}
