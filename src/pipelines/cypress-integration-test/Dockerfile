FROM cypress/included:5.0.0 as base

WORKDIR /src

COPY ./cypress ./cypress
COPY ./cypress.json ./cypress.json

RUN npm install typescript

ENTRYPOINT ["cypress", "run"] 