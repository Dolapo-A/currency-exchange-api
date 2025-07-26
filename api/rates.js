import "dotenv/config";
import { currencyNames } from "./currencyNames.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
	// CORS headers
	res.setHeader("Access-Control-Allow-Credentials", true);
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
	);

	if (req.method === "OPTIONS") {
		return res.status(200).end();
	}

	try {
		const response = await fetch(
			"https://api.exchangerate-api.com/v4/latest/USD"
		);
		const data = await response.json();
		const today = data.date || new Date().toISOString().slice(0, 10);

		const ratesWithNames = Object.entries(data.rates).reduce(
			(acc, [code, rate]) => {
				acc[code] = {
					rate: rate,
					name: currencyNames[code] || code,
				};
				return acc;
			},
			{}
		);

		const rows = Object.entries(ratesWithNames).map(([code, value]) => ({
			base_currency: "USD",
			target_currency: code,
			rate: value.rate,
			currency_name: value.name,
			date: today,
		}));

		await supabase
			.from("exchange_rates")
			.upsert(rows, { onConflict: ["target_currency", "date"] });

		return res.status(200).json(ratesWithNames);
	} catch (error) {
		console.error("Error fetching exchange rates:", error);
		return res.status(200).json({
			USD: { rate: 1.0, name: "United States Dollar" },
			EUR: { rate: 0.85, name: "Euro" },
			GBP: { rate: 0.73, name: "British Pound Sterling" },
			JPY: { rate: 110.42, name: "Japanese Yen" },
		});
	}
}
