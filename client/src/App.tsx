import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './AuthPage';
import StatusPage from './StatusPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route: Authentication / Login */}
        <Route path="/" element={<AuthPage />} />
        
        {/* Status Dashboard Route */}
        <Route path="/appstatus" element={<StatusPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;