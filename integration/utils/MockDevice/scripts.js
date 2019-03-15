// scripts that get stringified and evaluated in puppeteer page execution context

export const handleMessageScript = () => {
  window.addEventListener(
    "message",
    event => window.handleMessage(event.data),
    false
  );
};

export const injectIframeScript = () => {
  if (window.iframe) document.body.removeChild(window.iframe);
  const iframe = document.createElement("iframe");
  iframe.id = "iframe";
  document.body.appendChild(iframe);
  window.iframe = iframe;
};

export const setIframeSrcScript = src => {
  window.iframe.src = src;
};

export const postMessageToIframeScript = (message, targetOrigin) => {
  window.iframe.contentWindow.postMessage(message, targetOrigin);
};
