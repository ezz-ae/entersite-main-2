
'use strict';
const bizSdk = require('facebook-nodejs-business-sdk');
const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;

let access_token = 'EAAP37W1MFKoBQdHbOQS3th2IjLP4PNw7i6gOFwi9jNPevxqP4YNphzUJxiWAlGIq647ObkFD6AIGoKfMi4J7eGvcDDl8vzMKaXoNa9kohM4hBMuzEQkJWXDYitsdwYMZCpaC2SzMMpsag0tjtJjLGkYOb5h8jKITno9XFcnl8ptPx9dZCeDgXN9Ph6oi7DjrSr4IXbS0pqOnkORFho';
let app_id = '1117024043144362';
let ad_account_id = 'act_1986804738524873';
let campaign_name = 'Real Estate Lead Generation';

const api = bizSdk.FacebookAdsApi.init(access_token);
const showDebugingInfo = true; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

const logApiCallResult = (apiCallName, data) => {
  console.log(apiCallName);
  if (showDebugingInfo) {
    console.log('Data:' + JSON.stringify(data));
  }
};

let fields, params;

void async function() {
  try {
    // Create an ad campaign with objective OUTCOME_TRAFFIC
    fields = [
    ];
    params = {
      'name': campaign_name,
      'objective': 'OUTCOME_TRAFFIC',
      'status': 'PAUSED',
      'special_ad_categories': ['HOUSING'],
    };
    let campaign = await (new AdAccount(ad_account_id)).createCampaign(
      fields,
      params
    );
    let campaign_id = campaign.id;

    console.log('Your created campaign is with campaign_id:' + campaign_id);

  } catch(error) {
    console.log(error);
    process.exit(1);
  }
}();