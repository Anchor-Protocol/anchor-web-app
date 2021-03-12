import fastdom from 'fastdom';

export function auditMeasure(fn: () => void): () => void {
  let called = false;

  function execute() {
    fn();
    called = false;
  }

  function trigger() {
    if (!called) {
      called = true;
      fastdom.measure(execute);
    }
  }

  return trigger;
}
