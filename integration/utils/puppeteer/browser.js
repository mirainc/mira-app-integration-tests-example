import puppeteer from "puppeteer";
import { headless, isCI } from "../constants";

const browser = puppeteer.launch({
  args: [
    // https://github.com/GoogleChrome/puppeteer/issues/2548#issuecomment-390077713
    "--disable-features=site-per-process",
    // running as root in docker requires --no-sandbox flag
    isCI ? "--no-sandbox" : null
  ].filter(arg => !!arg),
  headless,
  devtools: !headless
});

beforeAll(async () => {
  // wait for browser to initialize
  const [page] = await (await browser).pages();
  // close default new tab
  await page.close();
});

afterAll(async () => {
  // clean up browser instance
  await (await browser).close();
});

export default browser;
