import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import SignIn from './SignIn';
import ProtectedRoute from './ProtectedRoute';
import { Analytics } from '@vercel/analytics/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<App />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>
); 