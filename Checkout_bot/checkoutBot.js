// Importieren der erforderlichen Module
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Definieren der Hauptfunktion als asynchrone Funktion
var finishline = async function () {
  // Starten des Browser-Instances
  const browser = await puppeteer.launch({ headless: false, slowMo: 10 });
  const page = await browser.newPage();

  // Setzen des User-Agents
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36');

  // Öffnen einer bestimmten Seite
  await page.goto('https://www.finishline.com/store/product/mens-nike-air-force-1-low-casual-shoes/prod795980?styleId=CW2288&colorId=111');


  // Warten für eine bestimmte Zeit
  await page.waitForTimeout(100000);

  // Klicken auf einen Button mit einem bestimmten Attributwert
  await page.click("button[data-size='8.0']");
  await page.waitForTimeout(5000);

  // Klicken auf ein Element mit einer bestimmten ID
  await page.click('#buttonAddToCart');

  // Warten für eine bestimmte Zeit
  await page.waitForTimeout(5000);

  // Warten auf das Erscheinen eines bestimmten Selektors und Klicken darauf
  await page.waitForSelector("a.button.expanded.mb-2.js-cart-proceed-btn");
  await page.click("a.button.expanded.mb-2.js-cart-proceed-btn");

  // Warten für eine bestimmte Zeit
  await page.waitForTimeout(5000);

  // Eingeben von Text in Textfelder mit bestimmten IDs
  await page.type("input[name='firstName']", 'Rijha');
  await page.type('#shippingLastName', 'Ehtsham');
  await page.type('#shippingAddress1', 'Teststrasse 1');
  await page.type('#shippingCity', 'Zuerich');
  await page.select('#shippingState', 'AK');
  await page.type('#shippingZip', '21224');
  await page.type('#shippingPhone', '553-321-2323');
  await page.type('#email', 'rijhaehtsham1@gmail.com');

  // Warten für eine bestimmte Zeit
  await page.waitForTimeout(5000);

  // Klicken auf einen Button mit einem bestimmten Attributwert
  await page.click("button[type='submit']", btn => btn.click());

  // Warten für eine bestimmte Zeit
  await page.waitForTimeout(5000);

  // Eingeben von Text in Textfelder mit bestimmten IDs
  await page.type('#billingCardNumber', '4539714410847600');
  await page.waitForTimeout(200);
  await page.select('#billingExpirationMonth', '05');
  await page.waitForTimeout(200);
  await page.select('#billingExpirationYear', '2027');
  await page.waitForTimeout(200);
  await page.select('#billingSecurityCode', '948');
  await page.waitForTimeout(200);

  // Versuch, auf ein Element mit einer bestimmten ID zu klicken und Fehlerbehandlung
  try {
    await page.click('#billingContinnueButton', btn => btn.click());
  } catch (ex) {
    await page.click("button[id='billingContinueButton']", btn => btn.click());
  }

  // Warten für eine bestimmte Zeit
  await page.waitFor(200);

  // Klicken auf ein Element mit einer bestimmten ID
  await page.click("button[id='submitOrder']", btn => btn.click());
}();
