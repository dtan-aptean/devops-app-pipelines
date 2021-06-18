FROM cypress/included:7.5.0 as base

WORKDIR /src

COPY ./cypress ./cypress
COPY ./cypress.json ./cypress.json

RUN npm install typescript puppeteer cypress-file-upload axios cypress-mochawesome-reporter mocha

ENTRYPOINT ["cypress", "run"] 