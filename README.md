# Calendar Cleanup

A powerful tool to clean up and organize your Google Calendar. Remove unwanted events, declutter your schedule, and save time with automated calendar management.

## SEO Guidelines

This project includes the following SEO optimizations:

### Metadata

The metadata in `src/app/layout.tsx` includes:

- SEO-friendly title and description
- Keywords targeting calendar cleanup and organization
- Open Graph and Twitter card metadata for social sharing
- Canonical URL and robots directives

### Structured Data

JSON-LD structured data is implemented on the homepage to help search engines understand:

- The application type and category
- Features and benefits
- Rating information

### SEO-Friendly Content

The homepage includes:

- Keyword-rich headings and content
- Clear feature descriptions
- Step-by-step instructions
- Semantic HTML structure

### Technical SEO

- robots.txt file to guide search engine crawlers
- sitemap.xml for improved indexing
- Mobile-friendly responsive design

## SEO Keyword Strategy

Primary keywords targeted:

- Google Calendar cleanup
- Clean up Google Calendar
- Organize Google Calendar
- Google Calendar management tool
- Delete Google Calendar events

Secondary keywords:

- Calendar decluttering service
- Remove duplicate calendar events
- Google Calendar organization app
- Calendar cleanup automation
- Simplify Google Calendar

## Future SEO Improvements

Consider implementing:

1. Blog section with keyword-targeted articles
2. User testimonials with structured data
3. FAQ section with FAQ schema markup
4. Performance optimizations for Core Web Vitals
5. Backlink strategy to improve domain authority

## Features

- Sign in with your Google account
- View your upcoming calendar events
- Select events individually or all at once
- Delete selected events with a single click

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Google Cloud Platform account with Calendar API enabled

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/calendar-cleanup.git
cd calendar-cleanup
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a Google Cloud Platform project:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the Google Calendar API
   - Create OAuth 2.0 credentials (Web application type)
   - Add authorized redirect URIs:
     - http://localhost:3000/api/auth/callback/google (for development)
     - https://your-production-domain.com/api/auth/callback/google (for production)

4. Create a `.env.local` file based on the example:

```bash
cp .env.local.example .env.local
```

5. Update the `.env.local` file with your Google credentials and a random string for NEXTAUTH_SECRET:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=random_string_for_jwt_encryption
```

### Running the Application

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click "Sign in with Google" and authorize the application
2. View your upcoming calendar events
3. Select events you want to delete (individually or using "Select All")
4. Click "Delete Selected" to remove the events from your calendar

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js, React, and TypeScript
- Uses the Google Calendar API for event management
