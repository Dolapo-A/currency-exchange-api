const currencyNames = {
	USD: "United States Dollar",
	EUR: "Euro",
	GBP: "British Pound Sterling",
	JPY: "Japanese Yen",
	AUD: "Australian Dollar",
	CAD: "Canadian Dollar",
	CHF: "Swiss Franc",
	CNY: "Chinese Yuan",
	INR: "Indian Rupee",
	NZD: "New Zealand Dollar",
	// Add more currencies as needed
};

export default async function handler(req, res) {
	// Set CORS headers
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	);

	// Handle OPTIONS request for CORS preflight
	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	try {
		const response = await fetch(
			"https://api.exchangerate-api.com/v4/latest/USD"
		);
		const data = await response.json();
		
		// Transform the rates to include currency names
		const ratesWithNames = Object.entries(data.rates).reduce((acc, [code, rate]) => {
			acc[code] = {
				rate: rate,
				name: currencyNames[code] || code // Fallback to code if name not found
			};
			return acc;
		}, {});

		return res.status(200).json(ratesWithNames);
	} catch (error) {
		console.error("Error fetching exchange rates:", error);
		// Fallback rates with names
		return res.status(200).json({
			USD: { rate: 1.0, name: "United States Dollar" },
			EUR: { rate: 0.85, name: "Euro" },
			GBP: { rate: 0.73, name: "British Pound Sterling" },
			JPY: { rate: 110.42, name: "Japanese Yen" }
		});
	}
}
