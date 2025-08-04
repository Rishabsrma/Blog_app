# Blog Website

A full-stack blog application built with Django (backend) and Next.js (frontend). Users can register, login, create, edit, and delete blog posts with different mood categories.

## 🚀 Features

- **User Authentication**: Register and login with JWT tokens
- **Blog Posts**: Create, read, update, and delete blog posts
- **Mood Categories**: Categorize posts with emojis (💻 Tech, 🎨 Creative, 🤔 Thought)
- **User Profiles**: Custom avatars and bio
- **Responsive Design**: Built with Tailwind CSS
- **Real-time Updates**: State management with Zustand

## 🛠️ Tech Stack

### Backend

- **Django 5.2.4** - Web framework
- **PyJWT 2.8.0** - JWT authentication
- **django-cors-headers 4.3.1** - CORS handling
- **SQLite** - Database

### Frontend

- **Next.js 15.4.5** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **Zustand** - State management
- **React Icons** - Icon library

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

## 🔧 Installation & Setup

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd blog_backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**

   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Run database migrations**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (optional)**

   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd blog_frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 🔑 Test Credentials

Since the application uses registration/login system, you can create test accounts using these sample credentials:

### Sample Test User 1

- **Email**: `test@example.com`
- **Password**: `testpass123`
- **Bio**: `Test user for demo purposes`
- **Avatar**: `👨‍💻`

**Note**: You need to register these users through the application's registration form at `http://localhost:3000/register` or create them via the Django admin panel.

## 📡 API Endpoints

### Authentication

- `POST /api/register/` - User registration
- `POST /api/login/` - User login

### Posts

- `GET /api/posts/` - Get all posts (with optional filters)
- `POST /api/posts/` - Create new post (requires authentication)
- `GET /api/posts/{id}/` - Get specific post
- `PUT /api/posts/{id}/` - Update post (requires authentication & ownership)
- `DELETE /api/posts/{id}/` - Delete post (requires authentication & ownership)

### Query Parameters for Posts

- `mood` - Filter by mood (💻, 🎨, 🤔)
- `author_id` - Filter by author ID

## 🎯 Usage

1. **Start both servers** (backend on :8000, frontend on :3000)
2. **Register a new account** at `/register`
3. **Login** with your credentials at `/login`
4. **Create posts** using the "Create Post" button
5. **Browse posts** on the home page
6. **Edit/Delete** your own posts using the action buttons

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Tokens expire after 1 hour
- Tokens are stored in localStorage on the frontend
- Protected routes require valid authentication
- Users can only edit/delete their own posts

## 🎨 Mood Categories

Posts can be categorized with three mood types:

- **💻 Tech** - Technology-related posts
- **🎨 Creative** - Creative and artistic posts
- **🤔 Thought** - Thoughtful and philosophical posts

## 🚀 Available Scripts

### Backend

- `python manage.py runserver` - Start development server
- `python manage.py makemigrations` - Create database migrations
- `python manage.py migrate` - Apply database migrations
- `python manage.py createsuperuser` - Create admin user

### Frontend

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Backend Configuration

- **Database**: SQLite (default) - configured in `settings.py`
- **CORS**: Allows requests from `http://localhost:3000`
- **JWT Secret**: Uses Django's SECRET_KEY (change in production)

### Frontend Configuration

- **API Base URL**: `http://localhost:8000/api/`
- **Authentication**: JWT tokens stored in localStorage
- **Styling**: Tailwind CSS with custom configuration

## 🚨 Important Notes

- **Development Only**: Current configuration is for development
- **Security**: Change SECRET_KEY and use environment variables in production
- **Database**: Uses SQLite for simplicity (consider PostgreSQL for production)
- **CORS**: Currently allows localhost:3000 only

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for educational/demo purposes.
