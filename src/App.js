import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  const basename = process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : '/';

  return (
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
