const puppeteer = require('puppeteer');
const request = require('request-promise-native');
const poll = require('promise-poller').default;
const apiKey = 'adbc7d647ca8f20eebd39808f859aa81';

const config = {
sitekey: '6LezxKEmAAAAAHZ6hV7YrxPJgTiFyQfS4pRML2ja',
pageurl: 'https://joerg.ictblj.ch',
apiSubmitUrl: 'https://2captcha.com/in.php',
apiRetrieveUrl: 'https://2captcha.com/res.php'
};
// Funktion zum Initiieren der Captcha-Lösungsanfrage
async function initiateCaptchaRequest(apiKey) {
const formData = {
method: 'userrecaptcha',
googlekey: config.sitekey,
key: apiKey,
pageurl: config.pageurl,
json: 1
};
const response = await request.post(config.apiSubmitUrl, { form: formData
});
return JSON.parse(response).request;
}
// Funktion zum Überprüfen der Captcha-Lösungsergebnisse
async function pollForRequestResults(apiKey, requestId, retries = 30, interval
= 1500, delay = 15000) {
await timeout(delay);
try {
return await poll({
taskFn: requestCaptchaResults(apiKey, requestId),
interval,
retries
});
} catch (error) {
if (Array.isArray(error) && error.includes('ERROR_WRONG_CAPTCHA_ID')) {
console.error('The captcha ID is invalid or expired.');
return null;
}
throw error;
}
}
// Funktion zum Abrufen der Captcha-Lösungsergebnisse
function requestCaptchaResults(apiKey, requestId) {
const url =
`${config.apiRetrieveUrl}?key=${apiKey}&action=get&id=${requestId}&json=1`;
return async function () {
const rawResponse = await request.get(url);
const response = JSON.parse(rawResponse);
if (response.status === 0) {
throw new Error('Captcha solving in progress');
Rijha Ehtsham Dokumentation Abschlussprojekt WebSecBot 07.06.2023
26
}
return response.request;
};
}
// Timeout-Hilfsfunktion
function timeout(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}
(async function main() {
const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();
console.log(`Navigate to ${config.pageurl}`);
await page.goto(config.pageurl);
const requestId = await initiateCaptchaRequest(apiKey);
const response = await pollForRequestResults(apiKey, requestId);
console.log('Captcha solved:', response);
await browser.close();
})();
