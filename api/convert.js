import { currencyNames } from './currencyNames';

export default async function handler(req, res) {
	// Set CORS headers
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
		const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
		const data = await response.json();
		const rates = data.rates;

		const url = new URL(req.url, `http://${req.headers.host}`);
		const amount = parseFloat(url.searchParams.get("amount"));
		const from = url.searchParams.get("from")?.toUpperCase();
		const to = url.searchParams.get("to")?.toUpperCase();

		if (!amount || !from || !to || !rates[from] || !rates[to]) {
			return res.status(400).json({ 
				error: "Invalid parameters",
				message: "Please provide valid amount, source currency, and target currency"
			});
		}

		const converted = (amount / rates[from]) * rates[to];
		
		return res.status(200).json({
			amount,
			result: converted,
			from: {
				code: from,
				name: currencyNames[from] || from,
				rate: rates[from]
			},
			to: {
				code: to,
				name: currencyNames[to] || to,
				rate: rates[to]
			}
		});

	} catch (error) {
		console.error('Error:', error);
		return res.status(500).json({ 
			error: "Conversion failed",
			message: "Unable to perform currency conversion"
		});
	}
}