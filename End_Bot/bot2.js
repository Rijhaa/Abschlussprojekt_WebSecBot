// Importieren der erforderlichen Module
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const request = require('request-promise-native');
const poll = require('promise-poller').default;

puppeteer.use(StealthPlugin());

// Dein API-Schlüssel für den Captcha-Lösungsdienst
const apiKey = 'adbc7d647ca8f20eebd39808f859aa81';

// Konfiguration für das Captcha und die Zielseite
const config = {
  sitekey: '6LdTUqEmAAAAAAe1-sUMJBC7a93qQfYPmlM7v-bs',
  pageurl: 'https://www.offspring.co.uk/view/product/offspring_catalog/2,20/x8qVNsFtXd',
  apiSubmitUrl: 'https://2captcha.com/in.php',
  apiRetrieveUrl: 'https://2captcha.com/res.php'
};

// Funktion, um die Anfrage zur Captcha-Lösung zu initiieren
async function initiateCaptchaRequest(apiKey) {
  const formData = {
    method: 'userrecaptcha',
    googlekey: config.sitekey,
    key: apiKey,
    pageurl: config.pageurl,
    json: 1
  };
  const response = await request.post(config.apiSubmitUrl, { form: formData });
  return JSON.parse(response).request;
}


// Funktion, um den Captcha-Lösungsdienst nach der Antwort abzufragen
async function pollForRequestResults(apiKey, requestId, retries = 30, interval = 1500, delay = 15000) {
  await timeout(delay);
  try {
    return await poll({
      taskFn: requestCaptchaResults(apiKey, requestId),
      interval,
      retries
    });
  } catch (error) {
    if (Array.isArray(error) && error.includes('ERROR_WRONG_CAPTCHA_ID')) {
      console.error('Die Captcha-ID ist ungültig oder abgelaufen.');
      return null;
    }
    throw error;
  }
}

// Funktion, um die Captcha-Lösungsantwort abzurufen
function requestCaptchaResults(apiKey, requestId) {
  const url = `${config.apiRetrieveUrl}?key=${apiKey}&action=get&id=${requestId}&json=1`;
  return async function () {
    const rawResponse = await request.get(url);
    const response = JSON.parse(rawResponse);
    if (response.status === 0) {
      throw new Error('Captcha-Lösung läuft noch.');
    }
    return response.request;
  };
}

// Timeout-Hilfsfunktion
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async function offspring() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    console.log(`Gehe zu ${config.pageurl}`);
    await page.goto(config.pageurl);

    // Prüfen, ob das Captcha existiert
    const captchaExists = await page.$('#g-recaptcha-response') !== null;

    if (captchaExists) {
      // Implementiere die Schritte, um das Captcha zu lösen und die Captcha-Antwort zu erhalten
      const requestId = await initiateCaptchaRequest(apiKey);
      const response = await pollForRequestResults(apiKey, requestId);
      console.log('Captcha solved:', response);

      // Implementiere den Schritt, um die gelöste Captcha-Antwort in das reCAPTCHA-Eingabefeld einzugeben
      await page.evaluate(response => {
        document.querySelector('#g-recaptcha-response').value = response;
      }, response);

      // Warten für eine bestimmte Zeit
      await page.waitForTimeout(2000);
    }

    // Klicken auf das Element mit der ID "onetrust-accept-btn-handler"
    await page.waitForSelector('#onetrust-accept-btn-handler');
    await page.click('#onetrust-accept-btn-handler');
    

    // Warten für eine bestimmte Zeit
    await page.waitForTimeout(2000);

    await page.waitForSelector('button.close');
    await page.click('button.close');

    // Klicken auf das Kombinationsfeld für die Schuhgröße
    await page.waitForSelector('button#selectSize');
    await page.click('button#selectSize');

    // Warten auf das Erscheinen der Schuhgrößenoptionen
      await page.waitForSelector('#productSizes');

      // Klicken auf die gewünschte Schuhgröße
      await page.evaluate(() => {
        const sizeOption = document.querySelector('li[data-value="045"]');
        sizeOption.click();
      });


      // Warten für eine bestimmte Zeit (z.B. um den Warenkorb zu überprüfen)
await page.waitForTimeout(2000);

// Klick auf den Button
await page.waitForSelector('#ajaxAdd');
await page.click('#ajaxAdd');

// Warten, um sicherzustellen, dass die Aktion abgeschlossen ist
await page.waitForSelector('.spc-mode-tile.js-deliveryMode[data-name*="Standard UK Delivery"]');

// Lieferung auswählen
const deliveryOptions = await page.$$('.spc-mode-tile.js-deliveryMode[data-name*="Standard UK Delivery"]');
if (deliveryOptions.length > 0) {
  // Das erste Element auswählen
  const deliveryOption = deliveryOptions[0];
  await deliveryOption.click();
  console.log('Das Element wurde angeklickt.');
  // Hier kannst du weitere Aktionen nach dem Klick durchführen
} else {
  console.log('Das Element wurde nicht gefunden.');
}


// E-Mail eingeben
await page.waitForSelector('#deliveryEmail');
await page.type('#deliveryEmail', 'rijhaehtsham1@gmail.com');

// Titel wählen
await page.evaluate(() => {
  const radioButton = document.querySelector('input[name="titleCode"][value="miss"]');
  if (radioButton) {
    radioButton.click();
    console.log('Das Radio-Button-Element wurde ausgewählt.');
  } else {
    console.log('Das Radio-Button-Element wurde nicht gefunden.');
  }
});

// Vornamen eingeben 
await page.evaluate(() => {
  const firstNameInput = document.getElementById('deliveryFirstName');
  if (firstNameInput) {
    firstNameInput.value = 'Rijha'; 
    console.log('Das Eingabefeld für den Vornamen wurde bearbeitet.');
  } else {
    console.log('Das Eingabefeld für den Vornamen wurde nicht gefunden.');
  }
});

// Nachname eingeben
await page.evaluate(() => {
  const lastNameInput = document.getElementById('deliveryLastName');
  if (lastNameInput) {
    lastNameInput.value = 'Ehtsham'; 
    console.log('Das Eingabefeld für den Nachnamen wurde bearbeitet.');
  } else {
    console.log('Das Eingabefeld für den Nachnamen wurde nicht gefunden.');
  }
});

// Telefonnummer eingeben
await page.evaluate(() => {
  const mobileNumberInput = document.getElementById('deliveryMobileNumber');
  if (mobileNumberInput) {
    mobileNumberInput.focus(); 
    mobileNumberInput.value = '+447496821242'; 
    console.log('Das Eingabefeld für die Telefonnummer wurde bearbeitet.');
  } else {
    console.log('Das Eingabefeld für die Telefonnummer wurde nicht gefunden.');
  }
});

// Postcode eingeben
await page.evaluate(() => {
  const postcodeInput = document.getElementById('deliveryPostcodeLookup');
  if (postcodeInput) {
    postcodeInput.value = 'E11 1PD5'; 
    console.log('Das Eingabefeld für die Postleitzahl wurde bearbeitet.');
  } else {
    console.log('Das Eingabefeld für die Postleitzahl wurde nicht gefunden.');
  }
});

// Adresse finden
await page.waitForSelector('button.btn.btn-secondary.btn-fluid.h-space-20.js-postcodeLookupButton');
await page.evaluate(() => {
  const findAddressButton = document.querySelector('button.btn.btn-secondary.btn-fluid.h-space-20.js-postcodeLookupButton');
  if (findAddressButton) {
    findAddressButton.click();
    console.log('Der Knopf "Find address" wurde gedrückt.');
  } else {
    console.log('Der Knopf "Find address" wurde nicht gefunden.');
  }
});


// Adresse wählen
await page.waitForSelector('button[data-id="deliverypostcodeLookupAddresses"]');
await page.evaluate(() => {
  const selectAddressButton = document.querySelector('button[data-id="deliverypostcodeLookupAddresses"]');
  if (selectAddressButton) {
    selectAddressButton.click();
    console.log('Der Knopf "Select your address" wurde gedrückt.');
  } else {
    console.log('Der Knopf "Select your address" wurde nicht gefunden.');
  }
});


await page.waitForXPath('//span[contains(text(), "Flat 5, Eagle Court, Hermon Hill, London, E11 1PD")]');
const element = await page.$x('//span[contains(text(), "Flat 5, Eagle Court, Hermon Hill, London, E11 1PD")]');
if (element.length > 0) {
  await element[0].click();
  console.log('Das Element wurde ausgewählt.');
} else {
  console.log('Das Element wurde nicht gefunden.');
}

// Mit der Bestellung fortfahren
await page.waitForSelector('button.btn.btn-primary.btn-fluid.h-space-30.js-submitBtn.js-continueToPaymentBtn');
await page.waitForTimeout(1000); // Warte 1 Sekunde
await page.click('button.btn.btn-primary.btn-fluid.h-space-30.js-submitBtn.js-continueToPaymentBtn');
console.log('Der Knopf "Continue to payment" wurde geklickt.');



// Zahlart "Gift Card" wählen
const giftCardElement = await page.waitForXPath("//div[contains(@class, 'spc-mode-tile__name') and contains(text(), 'Gift Card')]", { visible: true, timeout: 5000 });

// Klicke auf das gefundene Element
await giftCardElement.click();



// Benachrichtigungen ablehnen
const labelElement = await page.waitForXPath('//span[contains(text(), "I do not want to sign up to OFFSPRING Mobile Text Alerts")]/ancestor::label');
await labelElement.click();

// Bestellung fortfahren
await page.waitForSelector('button.btn.btn-primary.btn-fluid.hover-opacity.btn--payment.js-formPaymentBtn');

// Klicke auf den Button
await page.click('button.btn.btn-primary.btn-fluid.hover-opacity.btn--payment.js-formPaymentBtn');


// Warte auf das Eingabefeld für die Geschenkkartennummer
await page.waitForSelector("input[name='giftCardNumber']");

// Gib die Nummer ein
await page.type("input[name='giftCardNumber']", '821471241723998');

// Warte auf das Eingabefeld für die Geschenkkarten-PIN-Nummer
await page.waitForSelector("input[name='giftCardPinNumber']");

// Gib die Nummer ein
await page.type("input[name='giftCardPinNumber']", '1234');


await page.evaluate(() => {
  const button = document.querySelector("input[name='checkBalance']");
  button.click();
});





  } catch (error) {
    console.error('Fehler beim Ausführen des Skripts:', error);
  }
  })();