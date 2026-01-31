# Dexcom OAuth Backend

This repository contains a backend service for handling OAuth authentication and data retrieval from the Dexcom API. It is designed to run on Vercel and leverages modern Node.js features.

## Features

- OAuth authentication flow for Dexcom API.
- PKCE (Proof Key for Code Exchange) implementation.
- Data retrieval endpoints for Dexcom API.
- Lightweight and serverless architecture using Vercel.

## Folder Structure

```
.
├── api/                # API endpoints
│   ├── auth/           # Authentication-related endpoints
│   ├── egvs.ts         # Endpoint for retrieving Dexcom EGV data
├── lib/                # Utility libraries
│   ├── dexcom.ts       # Dexcom API integration logic
│   ├── pkce.ts         # PKCE implementation
│   ├── state.ts        # State encoding/decoding utilities
├── .env                # Environment variables (not included in repo)
├── package.json        # Project metadata and dependencies
├── vercel.json         # Vercel configuration
```

## Prerequisites

- Node.js (v20.x or higher)
- Vercel CLI (for local development)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dexcom-oauth-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the required environment variables (e.g., `DEXCOM_CLIENT_ID`, `DEXCOM_CLIENT_SECRET`, etc.).

## Development

To run the project locally:

```bash
npx vercel dev
```

This will start a local development server using Vercel.

## Deployment

To deploy the project to Vercel:

1. Ensure you have the Vercel CLI installed:
   ```bash
   npm install -g vercel
   ```

2. Deploy the project:
   ```bash
   vercel
   ```

## Endpoints

### Authentication
- `POST /api/auth/start`: Initiates the OAuth flow.
- `GET /api/auth/callback`: Handles the OAuth callback.
- `POST /api/auth/token`: Exchanges the authorization code for an access token.

### Data Retrieval
- `GET /api/egvs`: Retrieves EGV (Estimated Glucose Value) data from the Dexcom API.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---

For any issues or contributions, feel free to open a pull request or file an issue.