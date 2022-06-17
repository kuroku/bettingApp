const betfair = require('betfair');
const axios = require('axios');
const moment = require('moment')
const { BETFAIR_USERNAME = 'michellefreitez', BETFAIR_PASSWORD = 'Noure.82146', BETFAIR_API_KEY = 'fMMh5IT8tMgTdEup' } = process.env 
const session = new betfair.BetfairSession(BETFAIR_API_KEY);

const config = (data) => ({
  method: 'post',
  url: 'https://api.betfair.com/exchange/betting/json-rpc/v1',
  headers: { 
    'Content-Type': 'application/json', 
    'X-Application': BETFAIR_API_KEY, 
    'X-Authentication': global.betfaitTokenSession, 
  },
  data : data,
	validateStatus: () => true
})

const listMarketBook = (marketIds) => {
	const data = JSON.stringify({
		"jsonrpc": "2.0",
		"method": "SportsAPING/v1.0/listMarketBook",
		"id": 1,
		"params": {
			"marketIds": marketIds,
		}
	});
	return axios(config(data))
}

const listMarketCatalogue = (items = 20, sort = 'MINIMUM_TRADED') => {
	const dateFrom = new Date()
	const dateTO = moment(dateFrom, "DD-MM-YYYY").add(1, 'days')
	const data = JSON.stringify({
		"jsonrpc": "2.0",
		"method": "SportsAPING/v1.0/listMarketCatalogue",
		"id": 1,
		"params": {
			"filter": {
				"eventTypeIds": [
					"1"
				],
				"marketTypeCodes": [
					"MATCH_ODDS",
					"HALF_TIME"
				],
				"marketStartTime": {
					"from": dateFrom.toISOString(),
					"to": dateTO.toISOString()
				}
			},
			sort,
			"maxResults": `${items}`,
			"marketProjection": [
				"RUNNER_METADATA",
				"COMPETITION",
				"MARKET_START_TIME",
				"MARKET_DESCRIPTION",
				"RUNNER_DESCRIPTION"
			]
		}
	});
	return axios(config(data))
}

const listRunnerBook = (marketId, selectionId) => {
	var data = JSON.stringify({
		"jsonrpc": "2.0",
		"method": "SportsAPING/v1.0/listRunnerBook",
		"id": 1,
		"params": {
			"locale": "en",
			marketId,
			selectionId,
			"partitionMatchedByStrategyRef": true,
			"priceProjection": {
				"priceData": [
					"EX_BEST_OFFERS"
				]
			},
			"orderProjection": "ALL"
		}
	});
	
	return axios(config(data))
}

const startBot = async () => {
	session.login(BETFAIR_USERNAME,BETFAIR_PASSWORD, function(err, user) {
		if (err) {
			return console.error(err)
		}
		console.log(`Betfair is running with session ${session.sessionKey}, duration: ${user.duration}s`);
		global.betfaitTokenSession = session.sessionKey

		const timeOut = setTimeout(() => {
			clearTimeout(timeOut)
			console.log('Befair is restarting token session');
			startBot()
		}, user.duration * 1000)
	})
}

const bet = {
	startBot,
	listMarketCatalogue,
	listRunnerBook,
	listMarketBook
}

module.exports = bet

//LUm+tJCrUeGwH6zWgzp0GcfF2CJCv1J0kDMRWzO2bIY=