import $text from "./$text";

const $textExists = (page, text) => {
  const element = $text(page, text);
  expect(element).not.toBeNull();
  return element;
};

export default $textExists;
