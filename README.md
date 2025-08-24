# Household Profiler

A modern web application for managing profiles of household members. Built with Next.js, TypeScript, Tailwind CSS, and SQLite with Drizzle ORM.

## Features

- 📝 **Comprehensive Member Profiles**: Store detailed information including name, age/DOB, physical stats, activity levels, goals, and preferences
- 🏷️ **Dynamic Lists**: Add/remove allergens, dietary exclusions, likes, and dislikes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 💾 **Local Database**: Self-contained SQLite database with no external dependencies
- 🎨 **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- ⚠️ **Medical Disclaimer**: Appropriate disclaimers for health-related information

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Drizzle ORM
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom components with Tailwind

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm, yarn, or pnpm package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate and run database migrations**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Adding a New Member

1. Click the "Add New Member" button on the main page
2. Fill out the comprehensive form with member details:
   - **Basic Info**: Name, age/date of birth, sex
   - **Physical**: Height and weight (optional)
   - **Activity**: Choose activity level and weight goals
   - **Preferences**: Add allergens, dietary exclusions, likes, and dislikes
   - **Medical**: Optional medical notes field

### Managing Members

- **View**: All members are displayed as informative cards
- **Edit**: Click the "Edit" button on any member card
- **Delete**: Click the "Delete" button (with confirmation prompt)

### Form Features

- **Flexible Age Input**: Choose between entering date of birth or current age
- **Dynamic Lists**: Add/remove items from lists like allergens and preferences
- **Validation**: Form includes comprehensive validation for required fields
- **Responsive**: Form adapts to different screen sizes

## Database Schema

The app uses a single table `household_members` with the following fields:

- `id` - Primary key
- `name` - Member name (required)
- `role` - Household role: 'dad', 'mom', 'child', 'grandparent', 'family_member', 'roommate', 'other' (required)
- `dateOfBirth` - ISO date string (optional)
- `age` - Age in years (optional, alternative to DOB)
- `sex` - 'male', 'female', or 'other' (required)
- `height` - Height in inches (calculated from feet + inches input) (optional)
- `weight` - Weight in pounds (optional)
- `activityLevel` - Activity level (required)
- `allergens` - JSON array of allergens
- `exclusions` - JSON array of dietary exclusions
- `likes` - JSON array of food likes
- `dislikes` - JSON array of food dislikes
- `medications` - JSON array of medications
- `incomeSources` - JSON array of income source objects with source and amount
- `medicalNotes` - Optional medical notes
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Important Notes

⚠️ **Medical Disclaimer**: This application is for informational purposes only and is not intended to provide medical advice. Always consult with qualified healthcare professionals for medical concerns.

## License

This project is open source and available under the MIT License.
