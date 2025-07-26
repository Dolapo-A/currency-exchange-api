import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") return res.status(200).end();

	const { currencyA, currencyB, period } = req.query;

	if (!currencyA || !currencyB || !period) {
		return res
			.status(400)
			.json({ error: "Missing currencyA, currencyB, or period" });
	}

	const daysBack = parseInt(period, 10);
	if (isNaN(daysBack)) {
		return res.status(400).json({ error: "Invalid period" });
	}

	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() - daysBack);
	const fromISO = fromDate.toISOString().slice(0, 10);

	const upperA = currencyA.toUpperCase();
	const upperB = currencyB.toUpperCase();

	try {
		// Get currency A (base) rates
		const { data: ratesA, error: errorA } = await supabase
			.from("exchange_rates")
			.select("date, rate")
			.eq("target_currency", upperA)
			.gte("date", fromISO)
			.order("date", { ascending: true });

		if (errorA) {
			console.error("Error fetching currency A:", errorA);
			return res.status(500).json({ error: "Failed to fetch currencyA data" });
		}

		// Get currency B (quote) rates
		const { data: ratesB, error: errorB } = await supabase
			.from("exchange_rates")
			.select("date, rate")
			.eq("target_currency", upperB)
			.gte("date", fromISO)
			.order("date", { ascending: true });

		if (errorB) {
			console.error("Error fetching currency B:", errorB);
			return res.status(500).json({ error: "Failed to fetch currencyB data" });
		}

		// Merge by date and calculate currencyB / currencyA for each day
		const conversionData = [];

		for (let i = 0; i < ratesA.length; i++) {
			const a = ratesA[i];
			const b = ratesB.find((rb) => rb.date === a.date);
			if (b) {
				conversionData.push({
					date: a.date,
					value: b.rate / a.rate, // How much of currencyB per 1 currencyA
				});
			}
		}

		return res.status(200).json({
			base: upperA,
			quote: upperB,
			period: daysBack,
			data: conversionData,
		});
	} catch (err) {
		console.error("Unexpected error:", err);
		return res.status(500).json({ error: "Unexpected server error" });
	}
}
