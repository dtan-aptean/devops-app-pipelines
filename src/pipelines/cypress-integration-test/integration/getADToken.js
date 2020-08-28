const fs = require('fs');
const puppeteer = require('puppeteer');
const util = require('util');
var replace = require("replace-in-file");

const readFile = util.promisify(fs.readFile);

const getAdToken = function(config) {
    console.log(`Logging in ${config.email} at ${config.appURI}`);
    return puppeteer.launch({ headless: true }).then(async browser => {
        try {
            const page = await browser.newPage();

            await page.goto(config.appURI);

            await page.waitFor(3000);
            await page.click('input[id=logonIdentifier]');
            await page.type('input[id=logonIdentifier]', config.email, {
                delay: 50
            });

            await page.waitFor(500);
            await page.click('input[name=Password]');
            await page.waitFor(500);
            await page.type('input[name=Password]', config.password, {
                delay: 50
            });
            await page.waitFor(500);

            await page.click('button[id=next]');
            await page.waitForSelector('.jwtHeader', { visible: true, delay: 3000 });

            const headerElement = await page.$(".jwtHeader");
            const headerText = await page.evaluate(element => element.innerText, headerElement);
            const claimsElement = await page.$(".jwtClaims");
            const claimsText = await page.evaluate(element => element.innerText, claimsElement);
            const signatureElement = await page.$(".jwtSignature");
            const signatureText = await page.evaluate(element => element.innerText, signatureElement);

            const token = headerText + '.' + claimsText + '.' + signatureText;

            const options = {
                files: '*.json',
                from: /--BEARER_TOKEN--/g,
                to: token,
            };

            try {
                replace.sync(options);
            }
            catch (error) {
                console.error('Error occurred:', error);
            }

            browser.close();
        } catch (error) {
            console.log(error);
            browser.close();
        }
    });
};

const loginUser = function() {
    Promise.resolve().then(async() => {
        let config = await readFile('./ad-token-config.json', 'utf-8')
            .then(file => JSON.parse(file))
            .catch(e => {
                console.log('Could not load ad-token-config.json');
            })

        getAdToken(config);
    });
};

const main = () => {
    loginUser();
};

module.exports = {
    getAdToken: getAdToken,
    loginUser: loginUser
};

main();