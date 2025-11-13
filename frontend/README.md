# Frontend - Role-Based Auth App

This is the frontend application built with Next.js 16, React, and Tailwind CSS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

- **Authentication**: Login and signup pages with form validation
- **Dashboard**: Item management with CRUD operations
- **Role-Based Access**: Different views for users and admins
- **Search & Pagination**: Search items and navigate through pages
- **Modern UI**: Responsive design with Tailwind CSS

## Project Structure

```
frontend/
├── app/
│   ├── dashboard/     # Dashboard page with item management
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   ├── layout.js       # Root layout
│   ├── page.js         # Home page
│   └── globals.css     # Global styles
├── lib/
│   └── api.js          # API client functions
└── package.json
```

