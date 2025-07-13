# TouchGrass App

A responsive React application with a modern login page and dashboard interface.

## Features

- **Responsive Design**: Mobile-first approach with beautiful UI that works on all devices
- **Login Page**: Clean, modern login form with validation
- **Dashboard**: Empty dashboard ready for your content
- **TypeScript**: Full TypeScript support for better development experience
- **React Router**: Client-side routing between pages
- **Modern Styling**: CSS with animations and hover effects

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd touchgrass
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Login
- Use any email and password to login (demo mode)
- The form validates that both fields are filled
- Successful login redirects to the dashboard

### Dashboard
- Clean, responsive dashboard layout
- Logout button in the header
- Placeholder cards ready for your content
- Mobile-optimized design

## Project Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
│   ├── LoginPage.tsx   # Login page
│   └── DashboardPage.tsx # Dashboard page
├── styles/             # CSS styles
│   └── index.css       # Main stylesheet
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS3** - Styling with responsive design

## Responsive Design

The app is fully responsive with breakpoints at:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## Customization

### Adding Content to Dashboard
Edit `src/pages/DashboardPage.tsx` to add your dashboard content.

### Styling
Modify `src/styles/index.css` to customize the appearance.

### Authentication
Replace the simple authentication logic in `src/App.tsx` with your backend integration.

## License

This project is open source and available under the [MIT License](LICENSE).