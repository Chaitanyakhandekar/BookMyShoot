# PhotoBook - Photographer & Videographer Booking Platform

A comprehensive MERN stack web application for connecting clients with professional photographers and videographers. Users can browse profiles, send booking requests, manage appointments, and leave reviews.

## 🚀 Features

### For Clients
- **Browse Photographers**: Search and filter photographers by location, specialization, and ratings
- **View Portfolios**: Explore photographer galleries and previous work
- **Book Sessions**: Send booking requests with event details and requirements
- **Track Bookings**: Manage and monitor booking status and communications
- **Leave Reviews**: Rate and review photographers after completed sessions

### For Photographers
- **Profile Management**: Create comprehensive profiles with portfolios and pricing
- **Availability Management**: Set working hours and block unavailable dates
- **Booking Management**: Accept/reject booking requests and communicate with clients
- **Portfolio Showcase**: Upload and organize work samples by categories

### For Admins
- **User Management**: Monitor and manage user accounts
- **Photographer Verification**: Approve and verify photographer profiles
- **Booking Oversight**: Monitor all platform bookings and transactions
- **Analytics Dashboard**: View platform statistics and performance metrics

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, React Router, React Query
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer, Cloudinary (for image storage)
- **Email**: Nodemailer
- **State Management**: React Context API
- **Styling**: Tailwind CSS with custom components

## 📁 Project Structure

```
PhotoWeb/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware (auth, error handling)
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Express server setup
│   ├── uploads/            # File upload storage
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── styles/         # CSS and styling
│   │   └── utils/          # Utility functions
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/photographer_booking
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📊 Database Models

### User Model
- Basic user information (name, email, password)
- Role-based access (user, photographer, admin)
- Profile details and authentication

### Photographer Model
- Extended profile for photographers
- Business information and specializations
- Portfolio, pricing, and availability
- Rating and review aggregation

### Booking Model
- Event details and requirements
- Status tracking and payment information
- Communication history
- Cancellation policies

### Review Model
- Rating and feedback system
- Verified reviews linked to completed bookings
- Aspect-based ratings (communication, quality, etc.)

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Photographers
- `GET /api/photographers` - Get all photographers (with filters)
- `GET /api/photographers/:id` - Get photographer by ID
- `POST /api/photographers/profile` - Create photographer profile
- `PUT /api/photographers/profile/:id` - Update photographer profile

### Bookings
- `POST /api/bookings` - Create booking request
- `GET /api/bookings` - Get user's bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/photographer/:id` - Get photographer reviews

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/photographers/pending` - Pending verifications
- `PUT /api/admin/photographers/:id/verify` - Verify photographer

## 🎨 Frontend Features

### Components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Protected Routes**: Authentication-based route protection
- **Real-time Updates**: Dynamic content updates
- **Form Validation**: Client-side validation with error handling

### Pages
- **Home**: Landing page with feature highlights
- **Photographer Listing**: Search and filter photographers
- **Photographer Detail**: Portfolio and booking interface
- **Booking Form**: Detailed booking request form
- **Dashboard**: User/photographer management panel
- **Admin Panel**: Platform administration tools

## 🔧 Development

### Backend Development
```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Start production server
npm start
```

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred platform (Heroku, DigitalOcean, AWS)
3. Configure MongoDB Atlas for production database
4. Set up Cloudinary for image storage

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, AWS S3)
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- Backend Developer: [Your Name]
- Frontend Developer: [Your Name]
- UI/UX Designer: [Your Name]

## 📞 Support

For support, email [your-email@example.com] or join our Slack channel.

---

**PhotoBook** - Connecting moments with memories 📸
# BookMyShoot
