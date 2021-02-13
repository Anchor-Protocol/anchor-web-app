import puppeteer from 'puppeteer';

(async () => {
  // chromium debugging port
  // @see https://www.jetbrains.com/help/webstorm/run-debug-configuration-node-js-remote-debug.html
  // @see https://github.com/microsoft/vscode-chrome-debug#attach
  const remoteDebuggingPort: number = +(process.env.INSPECT_CHROME ?? 9222);

  const port: number = +(process.env.PORT ?? 3000);

  const browser = await puppeteer.launch({
    userDataDir: process.env.CHROMIUM_USER_DATA_DEBUG,
    headless: false,
    defaultViewport: null,
    args: [
      '--start-fullscreen',
      `--remote-debugging-port=${remoteDebuggingPort}`,
    ],
    ignoreDefaultArgs: ['--disable-extensions'],
    devtools: true,
  });

  const [page] = await browser.pages();
  await page.goto(`http://localhost:${port}`);

  //await page.waitForFunction(
  //  `document.querySelector('#app h1').innerHTML === 'Hello World!'`,
  //  {
  //    timeout: 1000 * 60,
  //    polling: 1000 * 3,
  //  },
  //);

  // if you want to start with another situation
  // you can make another script file like this script file
  // and, add the made script to the scripts section of package.json
})();
