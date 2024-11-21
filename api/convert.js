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

const currencyNames = {
	USD: "United States Dollar",
	EUR: "Euro",
	GBP: "British Pound Sterling",
	JPY: "Japanese Yen",
	AUD: "Australian Dollar",
	CAD: "Canadian Dollar",
	CHF: "Swiss Franc",
	CNY: "Chinese Yuan",
	HKD: "Hong Kong Dollar",
	NZD: "New Zealand Dollar",
	SEK: "Swedish Krona",
	KRW: "South Korean Won",
	SGD: "Singapore Dollar",
	NOK: "Norwegian Krone",
	MXN: "Mexican Peso",
	INR: "Indian Rupee",
	RUB: "Russian Ruble",
	ZAR: "South African Rand",
	TRY: "Turkish Lira",
	BRL: "Brazilian Real",
	TWD: "Taiwan New Dollar",
	DKK: "Danish Krone",
	PLN: "Polish Złoty",
	THB: "Thai Baht",
	IDR: "Indonesian Rupiah",
	HUF: "Hungarian Forint",
	CZK: "Czech Koruna",
	ILS: "Israeli New Shekel",
	CLP: "Chilean Peso",
	PHP: "Philippine Peso",
	AED: "United Arab Emirates Dirham",
	COP: "Colombian Peso",
	SAR: "Saudi Riyal",
	MYR: "Malaysian Ringgit",
	RON: "Romanian Leu",
};

export default async function handler(req, res) {
	// Set CORS headers
	res.setHeader("Access-Control-Allow-Credentials", true);
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
	);

	// Handle OPTIONS request for CORS preflight
	if (req.method === "OPTIONS") {
		return res.status(200).end();
	}

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
