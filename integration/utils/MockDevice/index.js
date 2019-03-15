import EventEmitter from "events";
import promiseEvent from "../promiseEvent";
import newPage from "../puppeteer/newPage";
import { PLAY, PRESENTATION } from "./actions/control";
import { PRESENTATION_COMPLETE, PRESENTATION_READY } from "./actions/lifecycle";
import {
  handleMessageScript,
  injectIframeScript,
  setIframeSrcScript,
  postMessageToIframeScript
} from "./scripts";
import staticServer from "./staticServer";

const fullScreenWindowStyles = [
  "body { margin: 0; }",
  "iframe { border: 0; width: 100%; height:100%; }"
].join("");

class MockDevice extends EventEmitter {
  constructor() {
    super();
    this.page = null;
    this.server = null;
    this.connected = false;
  }

  connect = async () => {
    if (this.connected) return;

    // emit postmessage events from app
    const handleMessage = ({ type, payload }) => this.emit(type, payload);
    await this.page.exposeFunction("handleMessage", handleMessage);
    await this.page.evaluateOnNewDocument(handleMessageScript);

    // open empty page and inject empty iframe;
    await this.page.goto("data:text/html,");
    await this.page.addStyleTag({ content: fullScreenWindowStyles });
    await this.page.evaluate(injectIframeScript);

    this.connected = true;
  };

  start = async () => {
    if (this.page) await this.close();
    this.page = await newPage();
    await this.connect();
  };

  stop = async () => {
    if (!this.page) return;
    await this.page.close();
    this.page = null;
  };

  startServer = async pathname => {
    if (this.server) await this.stopServer();
    await new Promise(resolve => {
      // listen on any unused port, which can be retrieved with server.address().port
      // https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback
      this.server = staticServer(pathname).listen(resolve);
    });
  };

  stopServer = async () => {
    await this.server.close();
    this.server = null;
  };

  get serverHostname() {
    return `http://127.0.0.1:${this.server.address().port}`;
  }

  get app() {
    const [frame] = this.page.mainFrame().childFrames();
    return frame;
  }

  load = async pathToApp => {
    if (!this.connected) await this.connect();
    if (this.app) await this.unload();

    // serve app as static website
    await this.startServer(pathToApp);

    // point iframe to hosted app
    const appLoaded = promiseEvent(this, "init");
    await this.page.evaluate(setIframeSrcScript, this.serverHostname);
    await appLoaded;
  };

  unload = async () => {
    if (!this.app) return;
    await this.page.evaluate(setIframeSrcScript, "");
    if (this.server) await this.stopServer();
  };

  sendMessage = async (type, payload) => {
    // simulator builds will filter postmessage based on source === 'mira-simulator'
    // remove this once we stop depending on simulator builds
    // https://github.com/mirainc/mira-kit/blob/98f77a7/packages/mira-simulator/src/createMessenger.js#L9
    const source = "mira-simulator";

    await this.page.evaluate(
      postMessageToIframeScript,
      { type, payload, source },
      `*`
    );
  };

  play = async () => {
    await this.sendMessage(PLAY);
  };

  setPresentation = async application_vars => {
    await this.sendMessage(PRESENTATION, { application_vars });
  };

  waitForMessage = (eventName, predicate) => {
    return promiseEvent(this, eventName, predicate);
  };

  waitForPresentationReady = () => {
    return this.waitForMessage(PRESENTATION_READY);
  };

  waitForPresentationComplete = () => {
    return this.waitForMessage(PRESENTATION_COMPLETE);
  };
}

export default MockDevice;
