# 💰 FinVault — Finance Dashboard UI

A modern, interactive finance dashboard built with **React + TypeScript**. Track income, expenses, and spending patterns through beautiful visualizations and intuitive design.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)

---

## ✨ Features

### 📊 Dashboard Overview
- **Summary Cards**: Total Balance, Income, Expenses, and Savings Rate with animated entry
- **Balance Trend Chart**: Area chart visualizing income vs expenses over time
- **Spending Breakdown**: Interactive donut chart with category legend
- **Recent Transactions**: Quick-access list of latest financial activity

### 💳 Transactions Section
- **Full Transaction Table**: Sortable and filterable data view
- **Advanced Filtering**: Search, type filter, category filter, date range, and sort options
- **CRUD Operations**: Add, edit, and delete transactions (admin role)
- **Export**: Download transactions as CSV or JSON

### 🔐 Role-Based UI (RBAC Simulation)
- **Admin Role**: Can add, edit, and delete transactions
- **Viewer Role**: Read-only access to all data
- Switch roles via the sidebar dropdown for demonstration

### 📈 Insights Section
- **Key Metrics**: Average income/expense per transaction, savings rate, income/expense ratio
- **Monthly Comparison**: Bar chart comparing income vs expenses by month
- **Insight Cards**: Highest spending category, top income source, month-over-month changes, best performing month
- **Category Breakdown**: Visual bar breakdown of all expense categories

### 🎨 Design & UX
- **Dark & Light Mode**: Toggle seamlessly between themes
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Card slide-ups, page transitions, chart animations, bar growth effects
- **Collapsible Sidebar**: Save screen space on smaller displays
- **Empty State Handling**: Graceful display when no data matches filters

### ⚡ Optional Enhancements (Implemented)
- ✅ Dark Mode
- ✅ Data Persistence (localStorage)
- ✅ Animations & Transitions
- ✅ Export (CSV & JSON)
- ✅ Advanced Filtering & Sorting

---

## 🛠 Tech Stack

| Technology     | Purpose                    |
|---------------|----------------------------|
| React 19      | UI Framework               |
| TypeScript    | Type Safety                |
| Vite 8        | Build Tool & Dev Server    |
| Recharts      | Chart Visualizations       |
| Lucide React  | Icon Library               |
| Vanilla CSS   | Styling (Custom Properties)|
| Context + useReducer | State Management   |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd dashboard-ui

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard/         # Dashboard overview components
│   │   ├── Dashboard.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── BalanceTrend.tsx
│   │   ├── SpendingBreakdown.tsx
│   │   └── RecentTransactions.tsx
│   ├── Transactions/      # Transaction management
│   │   ├── Transactions.tsx
│   │   ├── TransactionFilters.tsx
│   │   └── TransactionForm.tsx
│   ├── Insights/          # Financial insights
│   │   └── Insights.tsx
│   └── Layout/            # App shell
│       ├── Sidebar.tsx
│       └── Header.tsx
├── context/
│   └── AppContext.tsx      # Global state (Context + useReducer)
├── data/
│   └── mockData.ts        # 60+ mock transactions
├── types/
│   └── index.ts           # TypeScript interfaces
├── utils/
│   └── helpers.ts         # Utility functions
├── App.tsx                 # Root component
├── App.css                 # Layout styles
├── index.css               # Design tokens & global styles
└── main.tsx                # Entry point
```

---

## 🎯 State Management Approach

The app uses **React Context + useReducer** for centralized state management:

- **Transactions**: Full CRUD with mock data seeding
- **Filters**: Search, type, category, date range, and sort
- **Role**: Admin/Viewer toggle
- **Theme**: Dark/Light with CSS custom properties
- **Persistence**: Auto-saves to localStorage (transactions, role, theme, active view)

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout                         |
|------------|--------------------------------|
| > 1200px   | Full sidebar, 4-column cards   |
| 768-1200px | Full sidebar, 2-column cards   |
| < 768px    | Collapsed sidebar, 1-column    |

---

## 🎨 Design Decisions

- **Dark-first design**: Optimized for readability with subtle borders and glows
- **CSS Custom Properties**: Enables theming without JS overhead
- **BEM-like naming**: Consistent, readable class names
- **Animation strategy**: Entry animations for engagement, hover effects for interactivity
- **Modular CSS**: Each component has its own stylesheet

---

## 📄 License

MIT License - feel free to use this project for learning or submissions.
