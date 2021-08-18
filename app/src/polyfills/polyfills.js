import * as buffer from 'buffer';
import ResizeObserver from 'resize-observer-polyfill';
import process from './process-es6';

window.Buffer = buffer.Buffer;
window.process = process;

if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = ResizeObserver;
}
