# Student Attendance & Leave Tracker

A production-ready React application for students to track attendance, manage leaves, and calculate safe bunking limits based on a 75% attendance criteria.

## Features

- **User Accounts**: Secure local-first signup and authentication.
- **Course Configuration**: Set semester dates, course name, and custom subjects.
- **Daily Routine**: Interactive calendar to mark each slot (8-10, 10-12, 1-3, 3-5) as Present, Absent, or Free.
- **Smart Calculations**:
  - Automatically excludes Sundays.
  - Supports university-declared holidays (users can add/remove).
  - Calculates current attendance % per subject.
  - **Safe Leaves**: Tells you exactly how many classes you can miss safely.
  - **Recovery Mode**: Tells you how many classes you MUST attend if you are below 75%.
- **Persistent Data**: All data is saved locally in the browser, ensuring privacy and persistence across reloads.

## Tech Stack

- **React 19**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Date-fns** (Date manipulation)
- **Lucide React** (Icons)
- **React Router** (Navigation)

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173` (or the port shown in terminal).

3. **Build for Production**
   ```bash
   npm run build
   ```
   The output will be in the `dist` folder, ready for deployment to Vercel, Netlify, or GitHub Pages.

## Usage Guide

1. **Sign Up**: Create an account on the home screen.
2. **Configure**: You will be redirected to Settings. Enter your Semester Start/End dates and Add your Subjects.
3. **Daily Tracking**: Go to the "Daily" tab. Select a date. Mark your status for each slot.
   - If a slot is "Free", it won't affect your percentage.
4. **Dashboard**: Check the Dashboard to see your aggregate attendance and "Safe Leaves".

## Deployment

To deploy to Netlify (recommended):
1. Drag and drop the `dist` folder (created after build) to Netlify Drop.
2. OR connect your GitHub repo and let Netlify auto-build using `npm run build`.

## Project Structure

- `/src/components`: Reusable UI components (Layout, ProtectedRoute).
- `/src/pages`: Main application views (Dashboard, Calendar, Settings, Login).
- `/src/context`: Auth state management.
- `/src/services`: LocalStorage persistence logic.
- `/src/utils`: Attendance calculation algorithms.
