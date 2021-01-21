import { getParser } from 'bowser';

describe('browserslist', () => {
  test.each([
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36',
  ])('should be user agent is chrome (%s)', (userAgent: string) => {
    const browser = getParser(userAgent);
    expect(
      browser.satisfies({
        chrome: '>60',
      }),
    ).toBeTruthy();
  });
});
