// Em apps/web/src/App.jsx

import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div>
      <nav className="absolute top-0 left-0 w-full p-4 bg-transparent z-10">
        <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
          FinPlan
        </Link>
      </nav>

      <main className="pt-20"> 
        <Routes>
          {/* ... suas rotas continuam as mesmas ... */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;