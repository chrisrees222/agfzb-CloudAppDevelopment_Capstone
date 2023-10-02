/**
 * Get all databases
 */

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');
const secret = {
    "COUCH_URL": "https://1c45f915-5eaa-4fcd-83a6-71f18e950b05-bluemix.cloudantnosqldb.appdomain.cloud",
    "IAM_API_KEY": "8EEYtLT3A_IdcYqbWBZnK3SCSGp1ODV8V1n0185Gyusv",
    "COUCH_USERNAME": "1c45f915-5eaa-4fcd-83a6-71f18e950b05-bluemix"
};
const database = 'dealerships';
function resolveHandler(resolve, statusCode, body) {
  resolve({
    statusCode: statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: body
  });
}

function main(params) {
  return new Promise(function (resolve, reject) {
    const authenticator = new IamAuthenticator({ apikey: secret.IAM_API_KEY });
    const cloudant = CloudantV1.newInstance({
      authenticator: authenticator
    });
    cloudant.setServiceUrl(secret.COUCH_URL);
    if ((params || {}).dealerId) {
      cloudant
        .postFind({
          db: database,
          selector: {
            dealer_id: {
              $eq: parseInt(params.dealerId)
            }
          }
        })
        .then((response) => {
          const docs = ((response || {}).result || {}).docs || [];
          if (docs.length === 0) {
            resolveHandler(resolve, 404, { rows: [] });
          } else {
            resolveHandler(resolve, 200, { rows: docs });
          }
        })
        .catch((error) => {
          resolveHandler(resolve, 500, error);
        });
    } else if ((params || {}).state) {
      cloudant
        .postFind({
          db: database,
          selector: {
            state: {
              $eq: params.state
            }
          }
        })
        .then((response) => {
          const docs = ((response || {}).result || {}).docs || [];
          if (docs.length === 0) {
            resolveHandler(resolve, 404, { rows: [] });
          } else {
            resolveHandler(resolve, 200, { rows: docs });
          }
        })
        .catch((error) => {
          resolveHandler(resolve, 500, error);
        });
    } else {
      cloudant
        .postAllDocs({
          db: database,
          includeDocs: true
        })
        .then((response) => {
          const docs = ((response || {}).result || {}).rows || [];
          if (docs.length === 0) {
            resolveHandler(resolve, 404, { rows: [] });
          } else {
            resolveHandler(resolve, 200, { rows: docs });
          }
        })
        .catch((error) => {
          resolveHandler(resolve, 500, error);
        });
    }
  });
}