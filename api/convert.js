// Mock exchange rate data - in a real app this would come from an external API
const exchangeRates = {};

// Fetch latest exchange rates from an external API
async function getExchangeRates() {
	if (Object.keys(exchangeRates).length === 0) {
		try {
			const response = await fetch(
				"https://api.exchangerate-api.com/v4/latest/USD"
			);
			const data = await response.json();
			// Store all exchange rates from the API response
			exchangeRates.USD = 1.0; // Base currency
			Object.assign(exchangeRates, data.rates); // Copy all rates from the response
			console.log("Updated exchange rates:", exchangeRates); // Log the rates for visibility
		} catch (error) {
			console.error("Error fetching exchange rates:", error);
			// Fallback to some default values if API call fails
			exchangeRates.USD = 1.0;
			exchangeRates.EUR = 0.85;
			exchangeRates.GBP = 0.73;
			exchangeRates.JPY = 110.42;
		}
	}
	return exchangeRates;
}

export default async function handler(req, res) {
	const rates = await getExchangeRates();

	if (req.url === "/api/rates") {
		return res.json(rates);
	}

	const url = new URL(req.url, `http://${req.headers.host}`);
	const amount = parseFloat(url.searchParams.get("amount"));
	const from = url.searchParams.get("from")?.toUpperCase();
	const to = url.searchParams.get("to")?.toUpperCase();

	if (!amount || !from || !to || !rates[from] || !rates[to]) {
		return res.status(400).json({ error: "Invalid parameters" });
	}

	const converted = (amount / rates[from]) * rates[to];
	return res.json({
		amount,
		from,
		to,
		result: converted,
	});
}
