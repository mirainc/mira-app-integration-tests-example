import browser from "./browser";

const newPage = async () => {
  const page = await (await browser).newPage();
  await page.setViewport({ width: 1200, height: 800 });
  return page;
};

export default newPage;
