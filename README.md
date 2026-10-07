# 💰 FinPulse

A personal finance dashboard built with React + Vite. Track income and expenses, visualize spending by category, and manage your transactions — all stored locally in the browser with `localStorage`, so your data persists across refreshes.

## ✨ Features

- **Dashboard overview** — at-a-glance balance, income, and expense summary cards
- **Expense breakdown** — category donut chart powered by Recharts
- **Reports view** — deeper spending analysis and trends over time
- **Transaction management** — add, edit, and delete transactions via a slide-out drawer
- **Currency conversion** — switch between ₦, $, €, £, and ₹ with real-life conversion rates applied to existing entries
- **Dark / light theme switcher** — toggle from the sidebar or header, with your preference remembered
- **Single-instance toast notifications** — clean, non-stacking feedback for every action
- **Sidebar navigation** — Dashboard, Reports, and Settings views
- **Responsive layout** for desktop and mobile screens
- **Animated transaction list** and polished UI feedback via Framer Motion

## 💡 Amount Behavior

- Use a positive amount for income
- Use a negative amount for expense

The app automatically shows the expense total as a positive number in the summary cards while keeping the transaction logic intact.

## 🌐 Live Demo

[Check it live here](https://yussa-reactexpensetracker.vercel.app/)

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Git (for cloning the repository)
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YussaMoney/react-expense-tracker.git
cd react-expense-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` — Start the local Vite development server
- `npm run build` — Create a production build
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint across the project

## 🛠️ Tech Stack

- React 19
- Vite 8
- Recharts
- Framer Motion
- Font Awesome Icons
- Lucide React
- React Hot Toast
- ESLint

## 📁 Project Structure

```text
finPulse/
├── public/                          # Static assets
├── src/
│   ├── assets/                      # Static images and shared assets
│   ├── components/
│   │   ├── ExpenseCategoryDonut.jsx # Category breakdown chart
│   │   ├── RecentTransactionsTable.jsx
│   │   ├── ReportsView.jsx          # Reports & analytics tab
│   │   ├── SettingsView.jsx         # Currency, theme, and data settings
│   │   ├── Sidebar.jsx              # Navigation and live balance
│   │   ├── TopRowCards.jsx          # Summary cards
│   │   └── TransactionDrawer.jsx    # Add/edit transaction form
│   ├── data/                        # Categories, icons, and sample transactions
│   ├── utils/                       # Formatting, currency conversion, and transaction helpers
│   ├── App.jsx                      # Main application logic
│   └── style.css                    # Global styles
├── index.html                       # HTML entry file
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite config
└── README.md                        # Project documentation
```

## 🤝 Contributing

Contributions are welcome. If you would like to improve the app, feel free to open an issue or submit a pull request.

## 👤 Author

**Azeez Yusuf O.**

- GitHub: [@YussaMoney](https://github.com/YussaMoney)
- X: [@Yussassiph](https://x.com/Yussassiph)
- LinkedIn: [@YussaMoney](https://www.linkedin.com/in/yussamoney)

## 📧 Contact

For questions or feedback, open a GitHub issue or connect via WhatsApp: [@Yussassiph](https://wa.me/2348078773063).

---

Built with ❤️ using React and Vite.
