const $exists = async (page, selector) => {
  const element = await page.$(selector);
  expect(element).not.toBeNull();
  return element;
};

export default $exists;
