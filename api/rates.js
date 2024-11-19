export default async function handler(req, res) {
	const exchangeRates = {};

	try {
		const response = await fetch(
			"https://api.exchangerate-api.com/v4/latest/USD"
		);
		const data = await response.json();
		exchangeRates.USD = 1.0;
		Object.assign(exchangeRates, data.rates);
		return res.status(200).json(exchangeRates);
	} catch (error) {
		console.error("Error fetching exchange rates:", error);
		// Fallback rates
		exchangeRates.USD = 1.0;
		exchangeRates.EUR = 0.85;
		exchangeRates.GBP = 0.73;
		exchangeRates.JPY = 110.42;
		return res.status(200).json(exchangeRates);
	}
}
