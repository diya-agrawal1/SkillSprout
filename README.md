# SkillSprout

A full stack two-sided marketplace that helps parents discover and enroll their children in skill-based activities — painting, music, dance, coding, sports, drama and more.

> **Status:** In active development. Frontend complete. Backend API built, deployment in progress.

---

## 📸 Pages

| Page | Description |
|---|---|
| Homepage | Hero with search, activity categories, how-it-works section |
| Browse Classes | Filter sidebar (category, age, price, mode, rating) + class cards grid |
| Class Detail | Instructor profile, schedule table, reviews, enroll card |
| Login / Signup | Role-based auth (parent vs instructor), password strength meter |
| Instructor Dashboard | Overview stats, class management, student list, earnings breakdown |

---

## ⚙️ Tech Stack

**Frontend**
- HTML5, CSS3, Vanilla JavaScript
- Google Fonts (Fredoka + Work Sans)
- Responsive design with CSS Grid and Flexbox

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens) for authentication
- bcryptjs for password hashing
- REST API architecture

---

## 🗂️ Project Structure

```
skillsprout/
├── frontend/
│   ├── index.html          # Homepage
│   ├── browse.html         # Browse Classes page
│   ├── class-detail.html   # Class Detail page
│   ├── login.html          # Login + Signup (tabbed)
│   ├── dashboard.html      # Instructor Dashboard
│   └── *.css / *.js        # Page-specific styles and scripts
│
├── backend/
│   ├── server.js           # Express app entry point
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   ├── User.js         # User schema (parent + instructor)
│   │   ├── Class.js        # Class listing schema
│   │   └── Enrollment.js   # Enrollment + Review schemas
│   ├── routes/
│   │   ├── auth.js         # POST /signup, POST /login, GET /me
│   │   ├── classes.js      # CRUD for class listings
│   │   ├── enrollments.js  # Enroll, view, cancel
│   │   └── reviews.js      # Submit and fetch reviews
│   └── middleware/
│       └── auth.js         # JWT protect + instructorOnly middleware
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/login` | Login and get token | Public |
| GET | `/api/auth/me` | Get logged in user profile | Protected |

### Classes
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/classes` | Browse all classes (with filters) | Public |
| GET | `/api/classes/:id` | Get single class details | Public |
| POST | `/api/classes` | Create a new class | Instructor only |
| PUT | `/api/classes/:id` | Update a class | Instructor only |
| DELETE | `/api/classes/:id` | Delete a class | Instructor only |
| GET | `/api/classes/instructor/my-classes` | Get instructor's own classes | Instructor only |

### Enrollments
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/enrollments` | Enroll in a class | Parent only |
| GET | `/api/enrollments/my` | Get my enrollments | Protected |
| DELETE | `/api/enrollments/:id` | Cancel enrollment | Protected |

### Reviews
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/reviews/:classId` | Get reviews for a class | Public |
| POST | `/api/reviews` | Submit a review | Parent only |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or above)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/skillsprout.git
cd skillsprout
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file inside the `backend/` folder
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and go to `http://localhost:5000`

---

## ✨ Features

- **Two user roles** — parents browse and enroll, instructors list and manage classes
- **Advanced filtering** — filter by category, age group, price range, mode (online/offline) and rating
- **JWT Authentication** — secure login with token-based sessions
- **Password security** — bcrypt hashing, never stored in plain text
- **Role-based access** — instructors can only edit their own classes
- **Auto rating updates** — class average rating recalculates automatically when a review is submitted
- **Responsive design** — works on desktop, tablet and mobile

---

## 🛣️ Roadmap

- [x] Frontend — all 5 pages complete
- [x] Backend API — auth, classes, enrollments, reviews
- [ ] Connect frontend forms to backend API using fetch()
- [ ] Seed database with sample classes
- [ ] Deploy backend on Render
- [ ] Deploy frontend on Vercel
- [ ] Add image upload for class listings (Cloudinary)
- [ ] Add payment integration (Razorpay)

---

## 👩‍💻 Author

**Diya** — 3rd Year B.Tech CSE Student

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
