const getTextContent = async elementHandle =>
  await (await (await elementHandle).getProperty("textContent")).jsonValue();

export default getTextContent;
