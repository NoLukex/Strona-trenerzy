<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run the trainer website locally

This repository contains one reusable website template for many personal trainers.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Generate all trainer profiles from CSV:
   `python scripts/generate_client_profiles.py`
3. Run the app:
   `npm run dev`

## Notes

- Forms are ready for production flow, but in draft mode they store submissions locally.
- To send leads to your backend later, set `VITE_LEAD_WEBHOOK_URL` in `.env.local`.
- You can preview a specific trainer with `?trainer=<slug>` or `/t/<slug>`.
- For Vercel per-client deployment set `VITE_CLIENT_SLUG=<slug>` in project env vars.
