import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ClerkProvider} from "@clerk/clerk-react";
import { ThemeProvider } from './context/ThemeContext.jsx';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ClerkProvider>
)
