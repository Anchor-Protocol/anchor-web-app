export function bytesHelperText(invalidStatus: 'less' | 'much' | undefined) {
  return invalidStatus === 'less'
    ? 'Too Short'
    : invalidStatus === 'much'
    ? 'Too Long'
    : undefined;
}
