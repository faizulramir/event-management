# Event Management System

A modern, full-stack event management application built with Laravel 12 and React, designed for creating, managing, and organizing events with comprehensive user and role management capabilities.

## 🚀 Overview

This Event Management System provides a complete solution for event organizers to manage events, users, and permissions through an intuitive web interface. The system features a robust backend API built with Laravel 12 and a modern React frontend with TypeScript, all connected seamlessly through Inertia.js.

## ✨ Key Features

### Event Management
- **Create & Manage Events**: Full CRUD operations for events with detailed information
- **Event Scheduling**: Start and end date/time management with timezone support
- **Event Status**: Draft, Active, Cancelled, and Completed status tracking
- **Rich Text Descriptions**: WYSIWYG editor for detailed event descriptions

### User Management
- **User Registration & Authentication**
- **Role-Based Access Control**: Comprehensive permission system using Spatie Laravel Permission
- **User Profiles**: Manage user information and preferences

### Calendar & Scheduling
- **Interactive Calendar**: Visual calendar interface for event viewing
- **Event Filtering**: Filter events by status, date, and other criteria
- **Dashboard Analytics**: Overview of events, users, and system statistics

### Administrative Features
- **Role Management**: Create and manage user roles with specific permissions
- **Permission System**: Granular control over user capabilities
- **User Administration**: Manage user accounts, roles, and permissions
- **System Settings**: Configure application-wide settings

## 🛠 Technology Stack

### Backend
- **Framework**: Laravel 12 (PHP 8.3/8.4)
- **Database**: MySQL/PostgreSQL with Eloquent ORM
- **Authentication**: Laravel Sanctum for API authentication
- **Authorization**: Spatie Laravel Permission for role-based access control
- **API**: RESTful API with Laravel Resource Controllers
- **Validation**: Laravel Form Request classes for server-side validation
- **Testing**: Pest PHP for feature and unit testing

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: TailwindCSS 4.0 with custom design system
- **UI Components**: ShadCN UI component library with Radix UI primitives
- **State Management**: Inertia.js for seamless SPA experience
- **Forms**: Form with validation
- **Icons**: Lucide React icon library
- **Rich Text Editor**: Froala Editor for content creation
- **Calendar**: React Big Calendar for event visualization
- **Notifications**: Sonner for toast notifications

### Development Tools
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Version Control**: Git with conventional commits
- **Package Management**: Composer (PHP), npm (Node.js)
- **Development Server**: Laravel Artisan serve with Vite HMR
- **Database**: Laravel Migrations and Seeders

## 📁 Project Structure

```
event-management/
├── app/                          # Laravel application code
│   ├── Http/Controllers/         # API controllers
│   ├── Http/Requests/           # Form validation classes
│   ├── Models/                  # Eloquent models
│   └── Providers/               # Service providers
├── database/                    # Database files
│   ├── factories/               # Model factories
│   ├── migrations/              # Database migrations
│   └── seeders/                 # Database seeders
├── resources/                   # Frontend resources
│   ├── css/                     # Stylesheets
│   ├── js/                      # React application
│   │   ├── components/          # Reusable UI components
│   │   ├── features/            # Feature-based modules
│   │   │   ├── events/          # Event management
│   │   │   ├── users/           # User management
│   │   │   ├── roles_permissions/ # Role & permission management
│   │   │   └── calendar/        # Calendar functionality
│   │   ├── layouts/             # Page layouts
│   │   ├── pages/               # Inertia.js pages
│   │   ├── types/               # TypeScript type definitions
│   │   └── lib/                 # Utility functions
│   └── views/                   # Blade templates
├── routes/                      # Route definitions
├── tests/                       # Test files
└── config/                      # Configuration files
```

## 🚦 Getting Started

### Prerequisites
- PHP 8.3 or 8.4
- Composer
- Node.js 18+ and npm
- MySQL or PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-management
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**
   - Update `.env` with your database credentials
   - Create the database

6. **Setup Google reCAPTCHA v3**
   
   **Step 1: Create reCAPTCHA Keys**
   1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   2. Click "Create" or "+" to add a new site
   3. Fill in the form:
      - **Label**: Your project name (e.g., "Event Management System")
      - **reCAPTCHA type**: Select "reCAPTCHA v3"
      - **Domains**: Add your domains:
        - `localhost` (for development)
        - `127.0.0.1` (for development)
        - `yourdomain.com` (for production)
   4. Accept the reCAPTCHA Terms of Service
   5. Click "Submit"
   
   **Step 2: Get Your Keys**
   After creating the site, you'll receive:
   - **Site Key** (Public key - safe to expose in frontend)
   - **Secret Key** (Private key - keep secure on server)
   
   **Step 3: Configure Environment Variables**
   Update your `.env` file with the keys:
   ```env
   # Google reCAPTCHA v3
   VITE_GOOGLE_RECAPTCHA_SITE_KEY=your_site_key_here
   RECAPTCHA_SITE_KEY=your_site_key_here
   RECAPTCHA_SECRET_KEY=your_secret_key_here
   ```
   
   **Important Security Notes:**
   - Never commit your actual `.env` file to version control
   - The `RECAPTCHA_SECRET_KEY` should never be exposed to the frontend
   - Use different keys for development and production environments

7. **Run migrations and seeders**
   ```bash
   php artisan migrate --seed
   ```

8. **Start development servers**
   ```bash
   composer run dev
   ```
   This will start Laravel server, queue worker, and Vite development server concurrently.

### Development Commands

- **Start development**: `composer run dev`
- **Build for production**: `npm run build`
- **Run tests**: `php artisan test`
- **Code formatting**: `npm run format`
- **Type checking**: `npm run types`

## 🏗 Architecture

### Backend Architecture
- **MVC Pattern**: Clean separation of concerns with Models, Views, and Controllers
- **Service Layer**: Complex business logic extracted into dedicated Service classes
- **Repository Pattern**: Data access abstraction for testability
- **Form Requests**: Centralized validation logic
- **Resource Controllers**: RESTful API endpoints with consistent structure
- **Eloquent Relationships**: Proper model relationships and query scopes

### Frontend Architecture
- **Feature-Based Structure**: Self-contained modules under `features/` directory
- **Component Composition**: Reusable UI components with consistent design system
- **Type Safety**: Full TypeScript coverage with strict type checking
- **Inertia.js Integration**: Server-side routing with client-side navigation
- **Responsive Design**: Mobile-first approach with TailwindCSS

### Database Design
- **Users**: Authentication and profile management
- **Events**: Core event data with relationships
- **Roles & Permissions**: Flexible authorization system
- **Proper Indexing**: Optimized queries for performance

## 🔒 Security Features

- **Authentication**
- **Authorization**: Role-based access control with granular permissions
- **CSRF Protection**: Built-in Laravel CSRF protection
- **SQL Injection Prevention**: Eloquent ORM with parameter binding
- **XSS Protection**: Input sanitization and output escaping
- **Secure Headers**: Security headers for production deployment
- **Google Recaptcha**: Extra layer of security

## 📊 Key Models & Relationships

### Event Model
- Belongs to User (creator)
- Has UUID for public identification
- Status management (draft, active, cancelled, completed)
- Public/private visibility control
- Capacity management with max_attendees

### User Model
- Has many Events (as creator)
- Role-based permissions via Spatie package
- UUID for secure identification
- Email verification system

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with ShadCN UI
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching capability
- **Accessibility**: ARIA labels and keyboard navigation support
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and validation feedback

## 📈 Performance Optimizations

- **Vite Build System**: Fast development and optimized production builds
- **Code Splitting**: Automatic code splitting for optimal loading
- **Database Indexing**: Proper database indexes for query performance
- **Caching**: Laravel caching for improved response times
- **Asset Optimization**: Minified CSS and JavaScript in production

## 🧪 Testing

- **Backend Testing**: Pest PHP for feature and unit tests
- **Test Coverage**: Comprehensive test suite for critical functionality
- **Database Testing**: In-memory SQLite for fast test execution

## 📝 Contributing

1. Follow PSR-12 coding standards for PHP
2. Use Airbnb/Prettier style guides for TypeScript/JavaScript
3. Write tests for new features
4. Use conventional commit messages
5. Ensure all linting and type checking passes
