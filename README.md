# Currency Converter API

## Overview

The Currency Converter API provides real-time currency conversion and exchange rate information. It allows users to convert amounts between different currencies and retrieve the latest exchange rates along with full currency names.

## Features

- **Currency Conversion**: Convert an amount from one currency to another.
- **Exchange Rates**: Retrieve the latest exchange rates for various currencies.
- **Full Currency Names**: Get the full names of currencies alongside their codes.

## Endpoints

### 1. Get Exchange Rates

**Endpoint**: `/api/rates`  
**Method**: `GET`

**Description**: Retrieves the latest exchange rates for all supported currencies.

**Response**:

```json
{
	"USD": {
		"rate": 1.0,
		"name": "United States Dollar"
	},
	"EUR": {
		"rate": 0.85,
		"name": "Euro"
	}
}
```

### 2. Convert Currency

**Endpoint**: `/api/convert`  
**Method**: `GET`

**Query Parameters**:

- `amount`: The amount of money to convert (required).
- `from`: The currency code to convert from (required).
- `to`: The currency code to convert to (required).

**Example Request**:

```
GET /api/convert?amount=100&from=USD&to=EUR
```

**Response**:

```json
{
	"amount": 100,
	"result": 85.23,
	"from": {
		"code": "USD",
		"name": "United States Dollar",
		"rate": 1.0
	},
	"to": {
		"code": "EUR",
		"name": "Euro",
		"rate": 0.8523
	}
}
```

## CORS Support

The API supports Cross-Origin Resource Sharing (CORS), allowing it to be accessed from web applications hosted on different domains.

## Error Handling

The API provides meaningful error messages for invalid requests. Common error responses include:

- **400 Bad Request**: Returned when required parameters are missing or invalid.
- **500 Internal Server Error**: Returned when there is an issue with the server or fetching exchange rates.

## Installation

To run the API locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Dolapo-A/currency-converter-api.git
   cd currency-converter-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   vercel dev
   ```

4. Access the API at:
   - `http://localhost:3000/api/rates`
   - `http://localhost:3000/api/convert`

## Deployment

The API is deployed on Vercel. You can access the live version at:

```
https://currency-exchange-api-eight.vercel.app/
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
