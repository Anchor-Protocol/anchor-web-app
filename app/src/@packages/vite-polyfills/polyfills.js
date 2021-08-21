import * as buffer from 'buffer';
import process from './process-es6';

window.Buffer = buffer.Buffer;
window.process = process;