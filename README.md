# Campus Notifications App

A modern notification management web application built using Next.js, TypeScript, Material UI, and Axios.

## Features

- View all campus notifications
- Filter notifications by category
- Priority Inbox for important notifications
- API integration using Axios
- Backend proxy route implementation
- Logging middleware integration
- Responsive UI with Material UI

## Tech Stack

- Next.js 16
- React
- TypeScript
- Material UI
- Axios

## Running the Project

Clone the repository

Install dependencies:

npm install

Start the development server:

npx next dev

Open in browser:

http://localhost:3000

## API Integration

The app uses a backend proxy route to communicate with the evaluation API and avoid browser CORS issues.

Proxy route used:

app/api/notifications/route.ts

## Logging Middleware

A custom logger utility was implemented for handling API logs and request tracking.

## Note

During final testing, the provided evaluation API token started returning:

401 - invalid authorization token


The frontend, middleware integration, proxy routing, filtering, pagination, and overall application functionality were completed successfully.

## Author

Akshay Reddy Velugati

