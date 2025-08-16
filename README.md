# Flodiary - Menstrual Cycle Tracking App

A comprehensive menstrual cycle tracking and prediction application with user authentication and cycle management.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Cycle Tracking**: Log menstrual cycles with symptoms, flow intensity, and notes
- **Cycle Statistics**: View average cycle length, regularity score, and predictions
- **Profile Management**: Update personal information and preferences
- **Real-time Data**: Live synchronization with backend API
- **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Authentication**: JWT token management
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **CORS**: Enabled for cross-origin requests
- **Logging**: Morgan

## Prerequisites

- Node.js 18+ 
- MongoDB database
- Backend API running (flodiary-api)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd flodiary
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Note**: Make sure your backend API is running on the specified URL. If your backend is running on a different port or URL, update the `NEXT_PUBLIC_API_URL` accordingly.

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Backend API Requirements

Ensure your backend API (flodiary-api) is running and provides the following endpoints:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

### Cycle Tracking
- `POST /api/cycles` - Add new cycle
- `GET /api/cycles` - Get user cycles
- `GET /api/cycles/:id` - Get specific cycle
- `PUT /api/cycles/:id` - Update cycle
- `DELETE /api/cycles/:id` - Delete cycle
- `GET /api/cycles/stats` - Get cycle statistics

### Prediction
- `POST /api/prediction/predict` - Predict next cycle
- `GET /api/prediction/health` - Health check
- `GET /api/prediction/model-info` - Model information

## Project Structure

```
flodiary/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (main)/            # Protected main app pages
│   │   └── (setup)/           # Setup pages
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   └── CycleTracker.jsx  # Cycle tracking component
│   ├── contexts/             # React contexts
│   │   ├── AuthContext.jsx   # Authentication context
│   │   └── CycleContext.jsx  # Cycle data context
│   └── lib/                  # Utility functions
│       ├── api.js           # API service layer
│       └── utils.js         # Helper functions
├── public/                   # Static assets
└── package.json
```

## Key Components

### Authentication Context (`src/contexts/AuthContext.jsx`)
Manages user authentication state, login/logout functionality, and token management.

### Cycle Context (`src/contexts/CycleContext.jsx`)
Handles cycle data, statistics, and cycle-related operations.

### API Service (`src/lib/api.js`)
Centralized API communication layer with error handling and authentication.

### Protected Route (`src/components/ProtectedRoute.jsx`)
Ensures only authenticated users can access protected pages.

### Cycle Tracker (`src/components/CycleTracker.jsx`)
Main component for adding, editing, and viewing menstrual cycles.

## Usage

### 1. User Registration/Login
- Navigate to `/register` to create a new account
- Navigate to `/login` to sign in
- Authentication tokens are automatically managed

### 2. Cycle Tracking
- Go to `/symptoms` to track your menstrual cycles
- Add cycle start/end dates, symptoms, flow intensity, and notes
- View cycle history and statistics

### 3. Profile Management
- Visit `/profile` to update personal information
- View cycle statistics and predictions
- Manage account settings

### 4. Dashboard
- Access `/dashboard` for an overview of your cycle data
- View recent cycles and upcoming predictions

## API Integration

The frontend automatically integrates with your backend API using the configured `NEXT_PUBLIC_API_URL`. All API calls include:

- Automatic JWT token inclusion in headers
- Error handling and user feedback
- Loading states and optimistic updates
- Real-time data synchronization

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding New Features

1. **New API Endpoints**: Add methods to `src/lib/api.js`
2. **New Context**: Create context files in `src/contexts/`
3. **New Components**: Add to `src/components/`
4. **New Pages**: Create in appropriate route group in `src/app/`

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify backend is running
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Ensure CORS is properly configured on backend

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify backend authentication endpoints

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for missing environment variables
   - Verify all imports are correct

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
