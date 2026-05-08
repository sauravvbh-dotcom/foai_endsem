# SpacePulse Dashboard

SpacePulse is a production-ready, full-stack frontend dashboard built with React, Vite, and Tailwind CSS. It features real-time ISS tracking, a global news hub, and an integrated AI chatbot to assist users with dashboard data.

## Features

- **ISS Live Tracking**: Real-time coordinates mapped via Leaflet.js, automated speed calculation, active astronaut directory, and a historical speed chart (last 15 readings).
- **News Dashboard**: Top headlines across various categories (Technology, Science, Space, etc.) using NewsAPI. Contains search, sort, category filtering, and an interactive distribution chart.
- **AI Chatbot**: Context-aware AI assistant powered by the `Mistral-7B-Instruct` model through the Hugging Face inference API. Strictly restricted to answering based on the provided dashboard data (ISS and News).
- **Modern UI**: Full responsive design with Dark/Light mode support, skeleton loaders, subtle animations (Framer Motion), and toast notifications.

## Tech Stack

- **Frontend Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Mapping**: Leaflet.js & react-leaflet
- **Charts**: Recharts
- **API Calls**: Axios
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner
- **AI Integration**: @huggingface/inference

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd foai-endsem
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your API keys to the `.env` file:
   - `VITE_NEWS_API_KEY`: Get from [NewsAPI](https://newsapi.org/) or [NewsAPI.ai](https://newsapi.ai/)
   - `VITE_AI_TOKEN`: Get your Access Token from [Hugging Face](https://huggingface.co/)

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Deployment

The app is configured for seamless deployment to Netlify.

**Steps:**
1. Commit your code and push it to a GitHub/GitLab repository.
2. Log in to [Netlify](https://www.netlify.com/).
3. Click **Add new site** > **Import an existing project** and select your repository.
4. Netlify should automatically detect Vite. Make sure the build settings are:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Go to **Advanced build settings** or **Environment variables** and add your keys:
   - `VITE_NEWS_API_KEY`
   - `VITE_AI_TOKEN`
6. Click **Deploy site**.

*(Note: A `public/_redirects` file is included in the project to ensure React Router works smoothly on Netlify without throwing 404 errors on refresh.)*
