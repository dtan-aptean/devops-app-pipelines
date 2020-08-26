var crypto = require("crypto");  
const fs = require('fs');
const util = require('util');
const got = require('got');

const readFile = util.promisify(fs.readFile);
  
function getAuthorizationToken(verb, resourceType, resourceId, date, masterKey) {  
  var key = new Buffer.from(masterKey, "base64");  

  var text = (verb || "").toLowerCase() + "\n" +   
             (resourceType || "").toLowerCase() + "\n" +   
             (resourceId || "") + "\n" +   
             date.toLowerCase() + "\n" +   
             "" + "\n";  

  var body = new Buffer.from(text, "utf8");  
  var signature = crypto.createHmac("sha256", key).update(body).digest("base64");  
  var MasterToken = "master";   
  var TokenVersion = "1.0";  

  return encodeURIComponent("type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + signature);  
}  

function cleanUpPaymentRequests(config) {
  config.date = new Date().toUTCString();
  config.authToken = getAuthorizationToken("POST", "docs", "dbs/ezpay-api-svc/colls/data-projections", config.date, config.cosmosDbKey);
  
  const client = got.extend({
    hooks: {
      beforeRequest: [
        options => {
          options.headers = {
            'x-ms-documentdb-isquery': "true",
            'Content-Type': 'application/query+json',
            'Authorization': options.config.authToken,
            'x-ms-date': options.config.date,
            'x-ms-version': '2018-12-31'
          }
        }
      ]
    },
    method: 'POST',
    json: { 
      'query': 'SELECT c.id FROM c WHERE c.owner.tenantId = @tenantId AND c.type = @model', 
      'parameters': [ 
        { 'name': '@tenantId', 'value': config.tenantId }, 
        { 'name': '@model', 'value': 'Aptean.CommonTech.EzPay.Models.v1.PaymentRequest' } 
      ] 
    }
  });

  (async () => {
    var url = config.cosmosDbUrl + '/dbs/ezpay-api-svc/colls/data-projections/docs';
    try {
      const responseJson = await client(url, {config});
      var response = JSON.parse(responseJson.body);

      console.log("Found " + response._count + " payment requests.");

      // Need to delete each document individually.
      response.Documents.forEach(element => {
        deletePaymentRequest(config, element.id);        
      });
    }
    catch (error) {
      if (error.response && error.response.body) {
        console.log(error.response.body);
      }
      else {
        console.log(error);
      }
    }    
  })();
}

function deletePaymentRequest(config, paymentRequestId) {
  config.date = new Date().toUTCString();
  config.authToken = getAuthorizationToken("DELETE", "docs", "dbs/ezpay-api-svc/colls/data-projections/docs/" + paymentRequestId, config.date, config.cosmosDbKey);
  
  const client = got.extend({
    hooks: {
      beforeRequest: [
        options => {
          options.headers = {
            'x-ms-documentdb-isquery': "true",
            'Content-Type': 'application/query+json',
            'Authorization': options.config.authToken,
            'x-ms-date': options.config.date,
            'x-ms-version': '2018-12-31',
            'x-ms-documentdb-partitionkey': '["Aptean.CommonTech.EzPay.Models.v1.PaymentRequest"]'
          }
        }
      ]
    },
    method: 'DELETE'
  });

  (async () => {
    var url = config.cosmosDbUrl + '/dbs/ezpay-api-svc/colls/data-projections/docs/' + paymentRequestId;
    try {
      const response = await client(url, {config});
      console.log("Deleted payment request with id: " + element.id);
    }
    catch (error) {
      if (error.response && error.response.body) {
        console.log(error.response.body);
      }
      else {
        console.log(error);
      }
    }    
  })();
}

const main = () => {
  Promise.resolve().then(async() => {
    let config = await readFile('./cleanUp-config.json', 'utf-8')
      .then(file => JSON.parse(file))
      .catch(e => {
          console.log('Could not load cleanUp-config.json');
      })

      cleanUpPaymentRequests(config);
  });
};

main();