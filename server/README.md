# Backend (optional sync server)

The website works **100% offline** using your browser's `localStorage`, so you do **not** need this server to start studying. Use it only when you want to sync your attempts to MongoDB Atlas and access them from multiple devices.

## Run locally

```bash
cd server
cp .env.example .env   # then edit .env with your own MongoDB URI
npm install
npm start
```

The API runs on `http://localhost:4000`.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/attempts` | List all attempts (newest first) |
| POST | `/api/attempts` | Create an attempt |
| PUT | `/api/attempts/:id` | Update an attempt |
| DELETE | `/api/attempts/:id` | Delete an attempt |

## Connect the frontend (optional)

Set `VITE_API_BASE` in a frontend `.env` file to the server URL, e.g. `VITE_API_BASE="http://localhost:4000"`, then rebuild.

## Security

- **Never** commit your real `.env`. It is already covered by `.gitignore`.
- The MongoDB password that was shared in chat is now considered compromised. Rotate it in MongoDB Atlas (Database Access -> Edit user -> Edit password) before using this server.
