import { EventTarget, Event } from 'event-target-shim';

export class TimerEvent extends Event {
  static TIMER_END: string = 'TIMER_END';
}

export class SingleTimer extends EventTarget {
  private _started: boolean = false;
  private _paused: boolean = false;
  private _remain: number;
  private _intervalId: number = -1;
  private _lastTime: number = 0;

  get remain(): number {
    return this._remain;
  }

  constructor(timeout: number, private readonly interval: number = 100) {
    super();

    this._remain = timeout;
  }

  start = () => {
    if (this._started) return;

    this._lastTime = Date.now();
    this._intervalId = setInterval(this.intervalCallback, this.interval) as any;
    this._started = true;
  };

  stop = () => {
    if (!this._started) return;

    if (this._intervalId > -1) clearInterval(this._intervalId);
    this._intervalId = -1;
    this._started = false;
  };

  pause = () => {
    if (!this._started || this._paused) return;

    clearInterval(this._intervalId);
    this._intervalId = -1;
    this._paused = true;
  };

  resume = () => {
    if (!this._started || !this._paused) return;

    this._lastTime = Date.now();
    this._intervalId = setInterval(this.intervalCallback, this.interval) as any;
    this._paused = false;
  };

  private intervalCallback = () => {
    const currentTime: number = Date.now();
    const nextRemain: number = this._remain - (currentTime - this._lastTime);

    if (nextRemain <= 0) {
      this.dispatchEvent(new TimerEvent(TimerEvent.TIMER_END));
      clearInterval(this._intervalId);
      this._intervalId = -1;
    } else {
      this._remain = nextRemain;
      this._lastTime = currentTime;
    }
  };
}
