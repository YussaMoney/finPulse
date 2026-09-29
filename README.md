# 💰 React Expense Tracker

A lightweight React + Vite expense tracker for managing income and spending in one place. Transactions are stored in the browser with `localStorage`, so entries remain available after refresh.

## ✨ Features

- Add, edit, and delete transactions
- Track income and expenses with a live summary
- Filter transactions by category
- Search transactions by description
- Sort by newest, oldest, highest amount, lowest amount, or alphabetically
- Responsive layout for desktop and mobile screens
- Animated transaction list and polished UI feedback

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
- Framer Motion
- Font Awesome Icons
- Lucide React
- React Hot Toast
- ESLint

## 📁 Project Structure

```text
react-expense-tracker/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Static images and shared assets
│   ├── components/          # UI components
│   ├── data/                # Categories, icons, and motion variants
│   ├── utils/               # Formatting helpers
│   ├── App.jsx              # Main application logic
│   └── style.css            # Global styles
├── index.html               # HTML entry file
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite config
└── README.md                # Project documentation
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
