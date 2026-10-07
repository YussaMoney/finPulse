# 💰 FinPulse

A full-stack personal finance dashboard. Track income and expenses, see your spending by category, and manage transactions from any device. The React + Vite frontend talks to an Express API, which stores everything in MongoDB.

## 🌐 Live Demo

[finpulse-teal.vercel.app](https://finpulse-teal.vercel.app)

## ✨ Features

- **User accounts**: sign up and sign in; each user sees only their own transactions
- **Dashboard overview**: balance, income, expense and transaction-count cards
- **Expense breakdown**: category donut chart powered by Recharts
- **Reports view**: deeper spending analysis
- **Transaction management**: add, edit and delete transactions from a slide-out drawer, with an Income/Expense switch
- **Persistent storage**: transactions are saved in MongoDB, so they survive refreshes and show up on every device
- **Search, filter and sort**: by description, category, date or amount, with pagination
- **Currency conversion**: switch between ₦, $, €, £ and ₹, with stored amounts converted at real-life rates; your choice is saved on your account, so it follows you across devices
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
- bcryptjs (password hashing) and jsonwebtoken (sign-in tokens)
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

Copy `backend/.env.example` to `backend/.env` and fill it in:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
# Long random string used to sign login tokens. The server won't start without it.
JWT_SECRET=<random string>
# Optional: restrict which site can call the API. If unset, any origin is allowed.
CORS_ORIGIN=http://localhost:5173
```

Generate a `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
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

**Auth**

| Method | Endpoint             | Description                                  |
| ------ | -------------------- | -------------------------------------------- |
| POST   | `/api/auth/register` | Create an account → returns `token` + `user` |
| POST   | `/api/auth/login`    | Sign in → returns `token` + `user`           |
| GET    | `/api/auth/me`       | The signed-in user                           |

**Transactions**: every route needs an `Authorization: Bearer <token>` header and only ever touches the signed-in user's data.

| Method | Endpoint                    | Description                                         |
| ------ | --------------------------- | --------------------------------------------------- |
| GET    | `/api/transactions`         | List all, newest first                              |
| POST   | `/api/transactions`         | Create a transaction                                |
| PUT    | `/api/transactions/:id`     | Update a transaction                                |
| DELETE | `/api/transactions/:id`     | Delete a transaction                                |
| DELETE | `/api/transactions`         | Delete all of your transactions                     |
| POST   | `/api/transactions/sample`  | Replace your data with demo transactions            |
| POST   | `/api/transactions/convert` | Convert every amount to `{ "to": "$" }` and save it |

`GET /api/health` needs no token.

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
| Backend  | `backend`      | `MONGODB_URI`, `JWT_SECRET`, and `CORS_ORIGIN` set to the frontend's URL |
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
│   ├── middleware/
│   │   └── auth.js           # Verifies the sign-in token on protected routes
│   ├── models/
│   │   ├── Transaction.js    # Transaction schema (owned by a user)
│   │   └── User.js           # User schema (hashed password, currency)
│   ├── routes/
│   │   ├── auth.js           # Register, login, current user
│   │   └── transactions.js   # Per-user CRUD, bulk and convert endpoints
│   ├── scripts/
│   │   └── assign-orphans.js # One-off: give pre-account data to a user
│   ├── utils/                # Currency rates, demo data
│   ├── app.js                # Express app (middleware, routes, error handler)
│   ├── index.js              # Local dev server entry point
│   └── vercel.json           # Sends all requests to the serverless function
├── public/                   # Static assets
├── src/
│   ├── api/
│   │   ├── client.js         # Shared fetch wrapper (adds token, handles 401)
│   │   ├── auth.js           # Sign-in API calls
│   │   └── transactions.js   # Transaction API calls
│   ├── components/           # Auth screen, dashboard, charts, table, drawer, settings
│   ├── data/                 # Categories and icons
│   ├── utils/                # Formatting helpers
│   ├── App.jsx               # Session gate: sign-in screen or dashboard
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
