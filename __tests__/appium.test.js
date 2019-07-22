import wd from 'wd';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const PORT = 4723;
const config = {
  platformName: 'iOS',
  platformVersion: '11.4',
  deviceName: 'iPhone X',
  app: './ios/build/WebServerSpike/Build/Products/Debug-iphonesimulator/WebServerSpike.app' // relative to root of project
};
const driver = wd.promiseChainRemote('localhost', PORT);

beforeAll(async () => {
  await driver.init(config);
  await driver.sleep(2000); // wait for app to load
})

test('appium renders', async () => {
  expect(await driver.hasElementByAccessibilityId('webView')).toBe(true);
  expect(await driver.hasElementByAccessibilityId('notthere')).toBe(false);
});