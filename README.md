# PayPlan MVP 💰

A modern web application that helps couples and households effortlessly track shared expenses, manage recurring subscriptions, and maintain financial transparency.

## 🎯 Project Overview

PayPlan simplifies household financial management by allowing users to:
- Create or join households for shared expense tracking
- Log expenses manually or automatically via MPESA/bank message integration
- Monitor household totals and individual contributions
- Manage recurring subscriptions and services
- Track reimbursements and settlements

## ✨ Key Features

### Core MVP Features
- **User Authentication**: Secure signup/login with household management
- **Expense Tracking**: CRUD operations for expenses linked to users and households
- **Dashboard Analytics**: Visual overview of totals, contributions, and spending patterns
- **MPESA/Bank Integration**: Automatic expense import from financial messages
- **Reimbursement Tracking**: Mark payments as settled or pending

### Optional Stretch Features
- **Recurring Services**: Manage subscriptions and recurring bills
- **Smart Notifications**: Payment reminders and due date alerts
- **Export Functionality**: Generate CSV/PDF reports
- **Advanced Filtering**: Search by user, category, date range

## 🚀 Tech Stack

- **Frontend**: Next.js (React framework)
- **Backend**: Node.js/Express (API routes)
- **Database**: PostgreSQL/MongoDB (your choice)
- **Authentication**: JWT or NextAuth.js
- **Styling**: Tailwind CSS
- **Charts**: Recharts or Chart.js



## 🛣️ API Routes

### Authentication
```
POST   /api/auth/signup      - User registration
POST   /api/auth/login       - User authentication
GET    /api/auth/me          - Get current user info
POST   /api/auth/logout      - User logout
```

### Households
```
POST   /api/household        - Create new household
POST   /api/household/join   - Join existing household
GET    /api/household/:id    - Get household details & members
PUT    /api/household/:id    - Update household info
```

### Expenses
```
GET    /api/expenses         - List expenses (with filters)
POST   /api/expenses         - Create new expense
GET    /api/expenses/:id     - Get specific expense
PUT    /api/expenses/:id     - Update expense
DELETE /api/expenses/:id     - Delete expense
POST   /api/expenses/auto    - Auto-import from MPESA/Bank
```

### Categories
```
GET    /api/categories       - List all categories
POST   /api/categories       - Create new category
PUT    /api/categories/:id   - Update category
DELETE /api/categories/:id   - Delete category
```

### Services (Optional)
```
GET    /api/services         - List all services
POST   /api/services         - Create new service
PUT    /api/services/:id     - Update service
DELETE /api/services/:id     - Delete service
GET    /api/services/upcoming - Get upcoming payments
```

## 📱 Page Structure

### Core Pages

| Route | Purpose | Key Features |
|-------|---------|--------------|
| `/` or `/dashboard` | Main overview | Household totals, individual contributions, spending charts |
| `/household` | Household management | Create/join household, view members |
| `/expenses` | Expense management | List, filter, CRUD operations, mark reimbursed |
| `/expenses/new` | Add expense | Manual entry or auto-import form |
| `/login` `/signup` | Authentication | User registration and login forms |

### Optional Pages

| Route | Purpose | Key Features |
|-------|---------|--------------|
| `/service` | Subscription management | Recurring services, bills, subscriptions |
| `/upcoming` | Payment planning | Calendar view of upcoming payments |
| `/history` | Transaction history | Past payments, export functionality |

## 🎨 User Journey

### 1. **Dashboard** (`/`)
- **View**: Greeting, household totals, individual contributions, category breakdowns
- **Actions**: Quick navigation, scan totals, check balances

### 2. **Service Management** (`/service`)
- **View**: Grid of active services, next due dates, category labels
- **Actions**: Add/edit/delete services, manage recurring costs

### 3. **Upcoming Payments** (`/upcoming`)
- **View**: Calendar/list of due payments, color-coded urgency
- **Actions**: Mark as paid, filter by category/date

### 4. **Expense History** (`/history`)
- **View**: Timeline of past payments, reimbursement status
- **Actions**: Filter, export, track settlements

### 5. **Household Setup** (`/household`)
- **View**: Create/join options, member list, contributions
- **Actions**: Invite members, manage household settings

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Database (PostgreSQL/MongoDB)
- MPESA API credentials (for auto-import)

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd payplan-mvp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Configure your database and API keys
# DATABASE_URL=your_database_connection_string
# NEXTAUTH_SECRET=your_secret_key
# MPESA_API_KEY=your_mpesa_api_key

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/payplan

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# MPESA Integration
MPESA_API_KEY=your_mpesa_api_key
MPESA_API_SECRET=your_mpesa_secret

# Bank Integration (if applicable)
BANK_API_KEY=your_bank_api_key
```

## 📈 Development Priorities

### Phase 1 (Core MVP)
- [ ] User authentication system
- [ ] Household creation and joining
- [ ] Basic expense CRUD operations
- [ ] Dashboard with totals and contributions
- [ ] Simple MPESA/bank import simulation

### Phase 2 (Enhanced Features)
- [ ] Recurring services management
- [ ] Advanced filtering and search
- [ ] Reimbursement tracking
- [ ] Category management

### Phase 3 (Stretch Goals)
- [ ] Real MPESA/bank API integration
- [ ] Notification system
- [ ] Export functionality (CSV/PDF)
- [ ] Mobile responsiveness optimization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support, please open an issue on GitHub or contact [your-email@example.com].

---

*Built with ❤️ for better household financial management*