import { currencyNames } from './currencyNames';

export default async function handler(req, res) {
	// CORS headers
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	);

	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	try {
		const response = await fetch(
			"https://api.exchangerate-api.com/v4/latest/USD"
		);
		const data = await response.json();
		
		const ratesWithNames = Object.entries(data.rates).reduce((acc, [code, rate]) => {
			acc[code] = {
				rate: rate,
				name: currencyNames[code] || code
			};
			return acc;
		}, {});

		return res.status(200).json(ratesWithNames);
	} catch (error) {
		console.error("Error fetching exchange rates:", error);
		return res.status(200).json({
			USD: { rate: 1.0, name: "United States Dollar" },
			EUR: { rate: 0.85, name: "Euro" },
			GBP: { rate: 0.73, name: "British Pound Sterling" },
			JPY: { rate: 110.42, name: "Japanese Yen" }
		});
	}
}
