# Hackathon Tasks Client

Vanilla JavaScript client for the sibling `hackathon-api` repository.

## Run

Start the API first:

```bash
cd ../hackathon-api
uvicorn app.main:app --reload
```

Then serve this client:

```bash
python3 -m http.server 5173
```

Open `http://localhost:5173`.

The API base URL is configured in `app.js` as `http://localhost:8000`.
