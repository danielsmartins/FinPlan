import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main>

        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
