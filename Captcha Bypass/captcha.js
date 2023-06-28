const puppeteer = require('puppeteer');
const request = require('request-promise-native');
const poll = require('promise-poller').default;

// Dein API-Schlüssel für den Captcha-Lösungsdienst
const apiKey = 'adbc7d647ca8f20eebd39808f859aa81';

// Konfiguration für das Captcha und die Zielseite
const config = {
  sitekey: '6LdTUqEmAAAAAAe1-sUMJBC7a93qQfYPmlM7v-bs',
  pageurl: 'https://rijha.ictblj.ch/', // Ersetze es durch die URL deiner Zielseite
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

(async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    console.log(`Gehe zu ${config.pageurl}`);
    await page.goto(config.pageurl);
    // Implementiere die Schritte, um die Benutzername- und Passwortfelder auszufüllen
    // mit page.type()
    const requestId = await initiateCaptchaRequest(apiKey);
    const response = await pollForRequestResults(apiKey, requestId);
    console.log('Captcha solved:', response);
    // Implementiere den Schritt, um die gelöste Captcha-Antwort in das
    // reCAPTCHA-Eingabefeld mit page.evaluate() einzugeben
    // Abschicken des Anmeldeformulars mit page.click()
    // Beispiel: await page.evaluate(() => {
    //   const captchaResponse = document.getElementById('g-recaptcha-response');
    //   captchaResponse.value = response; // Die gelöste Captcha-Antwort
    // });
    // Beispiel: await page.click('#submit-button');
    await browser.close();
  } catch (error) {
    console.error('Es ist ein Fehler aufgetreten:', error);
  }
})();
