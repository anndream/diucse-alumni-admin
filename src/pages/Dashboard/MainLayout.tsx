import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
