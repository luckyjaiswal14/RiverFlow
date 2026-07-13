# Riverflow 🌊

A full-stack developer Q&A community platform, inspired by Stack Overflow. Built with Next.js (App Router), Tailwind CSS, TypeScript, and Appwrite (BaaS).

## Features

- **User Authentication**: Secure Sign-Up, Log-In, and Logout flows via Appwrite Authentication.
- **Questions & Answers**: Users can ask, browse, and answer questions.
- **Voting System**: Upvote and downvote questions and answers to curate the best content.
- **Reputation (Gamification)**: Users earn reputation points through community interactions.
- **Tags & Search**: Organize questions by tags for easy discovery.
- **Leaderboard**: See the top contributors on the Users page.
- **Modern UI**: Fully responsive, dark-mode native design built with Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js 15+ (App Router), React, Tailwind CSS
- **Backend & Database**: Appwrite (Authentication, Databases, User Preferences)
- **State Management**: Zustand
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn or pnpm
- An [Appwrite](https://appwrite.io/) Cloud account (or self-hosted instance)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/stackoverflow-appwrite.git
   cd stackoverflow-appwrite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update `.env` with your Appwrite credentials:
     - `NEXT_PUBLIC_APPWRITE_ENDPOINT`: Usually `https://cloud.appwrite.io/v1`
     - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`: Find this in your Appwrite Project Settings.
     - `APPWRITE_API_KEY`: Generate an API key in Appwrite with permissions for `users.read`, `databases.read`, `databases.write`, etc.

4. **Initialize Appwrite Database (First Run Only)**
   - Start the development server. The `src/models/server/dbSetup.ts` will automatically initialize your collections, indexes, and attributes.
   ```bash
   npm run dev
   ```
   - Once initialized, you'll see a success message in your server console.

5. **Run the App**
   - Visit `http://localhost:3000` to start exploring Riverflow!

## Deployment (Vercel)

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Add the Environment Variables:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `APPWRITE_API_KEY`
5. Click **Deploy**. Vercel will automatically detect Next.js and build your app.

## Contributing
Contributions, issues and feature requests are welcome!

## Author
Lucky Jaiswal
