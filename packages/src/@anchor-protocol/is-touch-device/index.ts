export function isTouchDevice(): boolean {
  try {
    return (
      'ontouchstart' in document.documentElement ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  } catch (error) {
    console.error(error);
    return false;
  }
}
