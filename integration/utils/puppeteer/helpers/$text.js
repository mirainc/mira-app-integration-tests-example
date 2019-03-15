const $text = async (page, text) => {
  const elements = await page.$x(`//*[contains(text(), '${text}')]`);
  return elements[0];
};

export default $text;
