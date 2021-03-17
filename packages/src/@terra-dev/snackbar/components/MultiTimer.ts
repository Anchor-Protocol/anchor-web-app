import { EventTarget } from 'event-target-shim';

export class MultiTimer extends EventTarget {
  private remains: Map<() => void, number> = new Map();
  private started: boolean = false;
  private intervalId: number = -1;
  private paused: boolean = false;
  private lastTime: number = Date.now();

  constructor(private readonly interval: number = 100) {
    super();
  }

  start = (timeout: number, callback: () => void) => {
    this.remains.set(callback, timeout);

    if (!this.started) {
      this.lastTime = Date.now();
      this.intervalId = setInterval(this.intervalLoop, this.interval) as any;
      this.started = true;
    }
  };

  stop = (callback: () => void) => {
    if (this.remains.has(callback)) {
      this.remains.delete(callback);

      if (this.remains.size <= 0) {
        if (this.intervalId > -1) clearInterval(this.intervalId);
        this.intervalId = -1;
        this.started = false;
      }
    }
  };

  stopAll = () => {
    if (!this.started) return;

    this.remains.clear();

    if (this.intervalId > -1) clearInterval(this.intervalId);
    this.intervalId = -1;
    this.started = false;
  };

  pause = () => {
    if (!this.started || this.paused) return;

    clearInterval(this.intervalId);
    this.intervalId = -1;
    this.paused = true;
  };

  resume = () => {
    if (!this.started || !this.paused) return;

    this.lastTime = Date.now();
    this.intervalId = setInterval(this.intervalLoop, this.interval) as any;
    this.paused = false;
  };

  private intervalLoop = () => {
    const currentTime: number = Date.now();

    for (const [callback, remain] of this.remains) {
      const nextRemain: number = remain - (currentTime - this.lastTime);

      if (nextRemain <= 0) {
        // dispatch
        callback();
        this.remains.delete(callback);
      } else {
        this.remains.set(callback, nextRemain);
      }
    }

    this.lastTime = Date.now();

    if (this.remains.size <= 0) {
      if (this.intervalId > -1) clearInterval(this.intervalId);
      this.intervalId = -1;
      this.started = false;
    }
  };
}
