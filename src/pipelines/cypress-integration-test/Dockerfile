FROM cypress/included:5.1.0 as base

WORKDIR /src

COPY ./cypress ./cypress
COPY ./cypress.json ./cypress.json

RUN npm install typescript puppeteer cypress-file-upload

ENTRYPOINT ["cypress", "run"] 