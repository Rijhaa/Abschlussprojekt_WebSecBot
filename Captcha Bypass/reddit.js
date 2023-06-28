const puppeteer = require('puppeteer');
const request = require('request-promise-native');
const poll = require('promise-poller').default;
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
});
const config = {
  sitekey: '6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC',
  pageurl: 'https://old.reddit.com/login',
  apiKey: 'adbc7d647ca8f20eebd39808f859aa81',
  apiSubmitUrl: 'https://2captcha.com/in.php',
  apiRetrieveUrl: 'https://2captcha.com/res.php'
};
const getUsername = function() {
  return 'RijhaaaaaaaEhhhht';
};
const getPassword = function() {
  return '12345qecz7eqdc8<B';
};
const chromeOptions = {
  excutablePath: '/Application/Google Chrome.app/Contents/Windows 11/ Google Chrome',
  headless: false,
  slowMo: 10,
  defaultViewport: null
};
(async function main() {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  console.log(`Navigate to ${config.pageurl}`);
  await page.goto(config.pageurl);
  const requestId = await initiateCaptchaRequest(config.apiKey);
  const username = getUsername();
  console.log(`Typical username ${username}`);
  await page.type('#user_reg', username)
  const password = getPassword ();
  console.log(`Typing password ${password}`);
  await page.type('#passwd_reg', password);
  await page.type ('#passwd2_reg', password);
  const response = await pollForRequestResults(config.apiKey, requestId);
  console.log(`Submitting...`);
  page.click('#register-form button[type=submit]');
})();

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function initiateCaptchaRequest(apiKey) {
  const formDate = {
    method: 'userrecaptcha',
    googlekey: config.sitekey,
    key: apiKey,
    pageurl: config.pageurl,
    json: 1
  };
  console.log(`Submitting solution request to 2captcha for ${config.pageurl}`);
  const response = await request.post(config.apiSubmitUrl, {form: formDate});
  return JSON.parse(response).request;
}

async function pollForRequestResults(key, id, retries = 30, interval = 1500, delay = 15000) {
  console.log(`Waiting for ${delay} milliseconds...`);
  await timeout(delay);
  try {
    return poll({
      taskFn: requestCaptchaResults(key, id),
      interval,
      retries
    });
  } catch (error) {
    if (Array.isArray(error) && error.includes('ERROR_WRONG_CAPTCHA_ID')) {
      console.error('The captcha ID is invalid or expired.');
      console.log('The captcha ID is invalid or expired.');
      return null;
    }
    throw error;
  }
}

function requestCaptchaResults(apiKey, requestId) {
  const url = `${config.apiRetrieveUrl}?key=${apiKey}&action=get&id=${requestId}&json=1`;
  return async function () {
    return new Promise(async function(resolve, reject){
      console.log(`Polling for response...`)
      const rawResponce = await request.get(url);
      const resp = JSON.parse(rawResponce);
      if (resp.status === 0) return reject(resp.request);
      console.log('Response received.')
      resolve(resp.request);
    });
  }
}
