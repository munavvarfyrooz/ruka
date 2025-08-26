# Ruka - Business AI Calling Platform

## Overview

This is a modern React-based landing page for Ruka, a business-focused AI calling platform available at ruka.live. The application is built as a full-stack web application with a React frontend using shadcn/ui components and an Express.js backend. Ruka specializes in automating business calls including lead qualification, appointment booking, CRM integration, and follow-up calls. Users can request a demo call by providing their phone number and email to experience how Ruka can transform their sales and customer support operations.

## User Preferences

- Preferred communication style: Simple, everyday language
- AI Agent Name: Ruka (female AI assistant)
- Domain: ruka.live
- Business Focus: Enterprise calling solutions for sales, customer support, and appointment scheduling

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and API calls
- **Styling**: Tailwind CSS with custom CSS variables for theming, including dark mode support
- **Build System**: Vite with path aliases for clean imports (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Development Setup**: tsx for TypeScript execution in development
- **Error Handling**: Centralized error middleware with structured error responses
- **Request Logging**: Custom middleware for API request logging with response details

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migrations**: Drizzle Kit for database migrations and schema management
- **Development Storage**: In-memory storage implementation (MemStorage) for development/testing
- **Session Storage**: PostgreSQL session store using connect-pg-simple

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Email Subscriptions Table**: Tracks email subscriptions with timestamps
- **Call Requests Table**: Stores phone numbers and emails for callback requests
- **Schema Validation**: Zod schemas for runtime type checking and validation including international phone number validation

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL backend storage
- **Validation**: Zod schemas for input validation on both frontend and backend
- **Security**: CORS handling and credential-based authentication

### Development and Deployment
- **Development**: Hot module replacement with Vite dev server integration
- **Build Process**: Vite for frontend bundling, esbuild for backend bundling
- **Environment**: Environment-based configuration with DATABASE_URL for database connections
- **Platform Integration**: Replit-specific plugins and development tools integration

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and API caching
- **wouter**: Lightweight React routing solution
- **express**: Node.js web framework for backend API

### Database and ORM
- **drizzle-orm**: Modern TypeScript ORM for database operations
- **drizzle-kit**: Database migration and schema management tools
- **@neondatabase/serverless**: Neon Database client for serverless PostgreSQL
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI and Styling
- **@radix-ui/react-***: Complete set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Utility for constructing className strings conditionally

### Form Handling and Validation
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Form validation resolvers for various schema libraries
- **zod**: TypeScript-first schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod for schema validation

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking and compilation
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

### Additional Utilities
- **date-fns**: Modern JavaScript date utility library
- **embla-carousel-react**: Carousel component for React
- **cmdk**: Command menu component for React applications
- **lucide-react**: Beautiful and consistent icon library