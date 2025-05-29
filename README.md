# PersonalityBankPro

A full-stack application to create and analyze personality assessments using Node.js, Express, React, and OpenAI.

## Prerequisites
- Node.js 20+
- PostgreSQL database

## Quick Start
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy the example environment file and update the values
   ```bash
   cp .env.example .env
   ```
3. Push the database schema and seed sample data
   ```bash
   npm run db:push
   npm run seed
   ```
4. Start the development server
   ```bash
   npm run dev
   ```
   The app will be available on [http://localhost:5000](http://localhost:5000).

## Environment Variables
- `DATABASE_URL` – connection string for your Postgres database
- `OPENAI_API_KEY` – API key for OpenAI features

## Build for Production
```bash
npm run build
npm start
```
