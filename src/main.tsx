
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import React from 'react'; // Explicitly import React

// Ensure we're using React.createElement for JSX
createRoot(document.getElementById("root")!).render(<App />);
