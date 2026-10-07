# 💰 FinPulse

A full-stack personal finance dashboard. Track income and expenses, see your spending by category, and manage transactions from any device. The React + Vite frontend talks to an Express API, which stores everything in MongoDB.

## 🌐 Live Demo

[finpulse-teal.vercel.app](https://finpulse-teal.vercel.app)

## ✨ Features

- **Dashboard overview**: balance, income, expense and transaction-count cards
- **Expense breakdown**: category donut chart powered by Recharts
- **Reports view**: deeper spending analysis
- **Transaction management**: add, edit and delete transactions from a slide-out drawer, with an Income/Expense switch
- **Persistent storage**: transactions are saved in MongoDB, so they survive refreshes and show up on every device
- **Search, filter and sort**: by description, category, date or amount, with pagination
- **Currency conversion**: switch between ₦, $, €, £ and ₹, with stored amounts converted at real-life rates
- **Dark / light theme**: toggle from the sidebar, header or settings; your choice is remembered
- **Toast notifications**: one clean, non-stacking message per action
- **Responsive layout**: works on desktop, tablet and phone

## 🛠️ Tech Stack

**Frontend**

- React 19 + Vite 8
- Recharts
- Framer Motion
- Lucide React and Font Awesome icons
- React Hot Toast

**Backend**

- Node.js + Express 5
- MongoDB Atlas + Mongoose
- dotenv and cors

**Hosting**

- Vercel: the frontend as a static site, the backend as a serverless function

## 🚀 Running Locally

### Prerequisites

- Node.js 18 or higher, and npm
- A MongoDB Atlas cluster (the free tier is enough) and its connection string

### 1. Clone the repository

```bash
git clone https://github.com/YussaMoney/finPulse.git
cd finPulse
```

### 2. Start the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
# Optional: restrict which site can call the API. If unset, any origin is allowed.
CORS_ORIGIN=http://localhost:5173
```

Then run:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Visit `http://localhost:5000/api/health` to check it's up.

> In MongoDB Atlas, go to **Network Access** and allow your IP address, or `0.0.0.0/0` for development. Otherwise the connection will be refused.

### 3. Start the frontend

In a second terminal, from the project root:

```bash
npm install
cp .env.example .env
npm run dev
```

`.env` holds a single variable:

```env
VITE_API_URL=http://localhost:5000/api
```

Open `http://localhost:5173` in your browser.

## 🔌 API Endpoints

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| GET    | `/api/health`           | Health check             |
| GET    | `/api/transactions`     | List all, newest first   |
| POST   | `/api/transactions`     | Create a transaction     |
| PUT    | `/api/transactions/:id` | Update a transaction     |
| DELETE | `/api/transactions/:id` | Delete a transaction     |

A transaction looks like this:

```json
{
  "description": "Grocery Run",
  "amount": -12000,
  "category": "Food"
}
```

Positive amounts are income and negative amounts are expenses. MongoDB adds `_id`, `createdAt` and `updatedAt` automatically.

## ☁️ Deploying to Vercel

The repo is deployed as **two Vercel projects** that both import this repository.

| Project  | Root Directory | Environment variables                                             |
| -------- | -------------- | ----------------------------------------------------------------- |
| Backend  | `backend`      | `MONGODB_URI`, and `CORS_ORIGIN` set to the frontend's URL         |
| Frontend | `./` (root)    | `VITE_API_URL` set to the backend's URL followed by `/api`         |

- `backend/api/index.js` wraps the Express app as a serverless function, and `backend/vercel.json` sends every request to it.
- `CORS_ORIGIN` must match the frontend's URL exactly, including `https://` and with no trailing slash.
- `VITE_` variables are built into the frontend code, so after changing one you need to redeploy the frontend.
- Every push to `main` redeploys both projects automatically.

## 📦 Available Scripts

**Frontend** (project root)

- `npm run dev`: start the Vite development server
- `npm run build`: create a production build
- `npm run preview`: preview the production build locally
- `npm run lint`: run ESLint

**Backend** (`backend/`)

- `npm run dev`: start the API with nodemon (auto-restarts on save)
- `npm start`: start the API with Node

## 📁 Project Structure

```text
finPulse/
├── backend/
│   ├── api/
│   │   └── index.js          # Vercel serverless entry point
│   ├── config/
│   │   └── db.js             # MongoDB connection (cached for serverless)
│   ├── models/
│   │   └── Transaction.js    # Mongoose schema
│   ├── routes/
│   │   └── transactions.js   # CRUD endpoints
│   ├── app.js                # Express app (middleware + routes)
│   ├── index.js              # Local dev server entry point
│   └── vercel.json           # Sends all requests to the serverless function
├── public/                   # Static assets
├── src/
│   ├── api/
│   │   └── transactions.js   # Frontend API client (fetch wrappers)
│   ├── components/           # Dashboard, charts, table, drawer, settings
│   ├── data/                 # Categories, icons, sample transactions
│   ├── utils/                # Formatting and currency conversion helpers
│   ├── App.jsx               # Main application logic and state
│   └── style.css             # Global styles and themes
├── .env.example              # Frontend environment template
├── index.html
├── package.json
└── vite.config.js
```

## 🤝 Contributing

Contributions are welcome. Feel free to open an issue or submit a pull request.

## 👤 Author

**Azeez Yusuf O.**

- GitHub: [@YussaMoney](https://github.com/YussaMoney)
- X: [@Yussassiph](https://x.com/Yussassiph)
- LinkedIn: [@YussaMoney](https://www.linkedin.com/in/yussamoney)

## 📧 Contact

For questions or feedback, open a GitHub issue or connect via WhatsApp: [@Yussassiph](https://wa.me/2348078773063).

---

Built with ❤️ using React, Express and MongoDB.
