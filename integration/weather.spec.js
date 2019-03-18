import path from "path";
import MockDevice from "mira-mock-device";
import $exists from "./utils/puppeteer/$exists";
import $text from "./utils/puppeteer/$text";
import getTextContent from "./utils/puppeteer/getTextContent";

// set test timeout to 20 seconds (default is 5 seconds)
jest.setTimeout(20 * 1000);

const appPreviewDir = path.resolve(__dirname, "../static/preview");

const mockDevice = new MockDevice();

let app;

const startMockDevice = async () => {
  await mockDevice.start();
};

const stopMockDevice = async () => {
  await mockDevice.stop();
};

const loadApp = async () => {
  await mockDevice.load(appPreviewDir);
  ({ app } = mockDevice);
};

const unloadApp = async () => {
  await mockDevice.unload();
  app = undefined;
};

beforeAll(startMockDevice);
beforeEach(loadApp);
afterEach(unloadApp);
afterAll(stopMockDevice);

describe("weather app", () => {
  it("should show the current weather in given city", async () => {
    // always create event listeners **before** you fire events that you care about
    const presentationReady = mockDevice.waitForPresentationReady();

    // set up preconditions
    await mockDevice.setPresentation({
      city: "Waterloo, CA",
      units: "metric",
      duration: 5
    });

    // always wait for presentation ready before calling play
    await presentationReady;

    // send lifecycle events
    await mockDevice.play();

    // wait for 5 seconds so you can see the app
    // useful for visually inspecting a test while it's running
    await app.waitFor(5000);

    // select elements in the page using puppeteer API
    const cityElement = await $exists(app, ".city");
    const conditionElement = await $exists(app, ".condition");

    // assert some expectations
    const cityText = await getTextContent(cityElement);
    const conditionText = await getTextContent(conditionElement);
    expect(cityText).toEqual(expect.stringMatching("Waterloo"));
    expect(conditionText).toEqual(expect.stringMatching(/(sunny|cloudy)/));
  });

  it("should call onError handler on error", async () => {
    // test sad paths too
    await mockDevice.setPresentation({
      city: "Not found",
      units: "Not found",
      duration: 5
    });

    expect(await $text(app, "Sorry, unable to display this content."));
  });

  it("should call onComplete handler after given duration", async () => {
    const presentationReady = mockDevice.waitForPresentationReady();
    const presentationComplete = mockDevice.waitForPresentationComplete();

    await mockDevice.setPresentation({
      city: "Vancouver, CA",
      units: "metric",
      duration: 5
    });

    await presentationReady;

    await mockDevice.play();

    // should resolve after 5 seconds
    await presentationComplete;
  });

  it("should animate on play", async () => {
    const presentationReady = mockDevice.waitForPresentationReady();

    await mockDevice.setPresentation({
      city: "San Francisco, US",
      units: "imperial",
      duration: 5
    });

    await presentationReady;

    let animatingElement = await app.$(".animate");
    expect(animatingElement).toBeNull();

    await mockDevice.play();

    animatingElement = await app.$(".animate");
    expect(animatingElement).not.toBeNull();
  });
});
