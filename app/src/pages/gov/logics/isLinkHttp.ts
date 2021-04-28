export function isLinkHttp(link?: string): boolean {
  return (
    typeof link === 'string' &&
    (link.startsWith('http://') || link.startsWith('https://'))
  );
}
