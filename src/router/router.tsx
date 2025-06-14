import { createBrowserRouter } from 'react-router-dom';
import Signin from '../pages/Auth/Signin';
import MainLayout from '../pages/Dashboard/MainLayout';
import Home from '../pages/Dashboard/Home';
import ResetRequest from '../pages/Auth/ResetRequest';

const router = createBrowserRouter([
  {
     path: '/',
     element: <MainLayout />,
     children: [
     {
          path: '/',
          element: <Home />,
     },
      {
          path: '/signin',
          element: <Signin />,
      },
      {
          path: '/reset-request',
          element: <ResetRequest />,
      },
    ],
  },
]);

export default router;
