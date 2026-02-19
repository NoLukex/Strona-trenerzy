# Vercel deploy for all trainers

## 1) Prepare profiles

Run once after updating CSV:

```bash
python scripts/generate_client_profiles.py
```

This generates all client profiles in `klienci/*/profile.ts` and updates `data/trainerProfiles.ts`.

## 2) Choose client slug

Use a slug from `clients_deploy_queue.csv`.

Example:

`trener-personalny-bydgoszcz-nicolas-marysiak`

## 3) Create Vercel project per client

- Project name: `trener-<slug>`
- Build command: `npm run build`
- Output directory: `dist`

## 4) Set environment variable in Vercel

Set:

- `VITE_CLIENT_SLUG=<slug>`

Optional:

- `VITE_LEAD_WEBHOOK_URL=<your_webhook_url>`

## 5) Deploy

After env var is set, deploy the project.

Each client gets isolated URL and sees only their own version.
