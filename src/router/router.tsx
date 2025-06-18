import { createBrowserRouter } from 'react-router-dom';
import Signin from '../pages/Auth/Signin';
import MainLayout from '../pages/Dashboard/MainLayout';
import Home from '../pages/Dashboard/Home';
import ResetRequest from '../pages/Auth/ResetRequest';
import NewsManager from '../pages/NewsManager';
import EventManager from '../pages/EventManager';

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
      {
        path: '/news',
        element: <NewsManager />,
      },
      {
        path: '/event',
        element: <EventManager />, // Placeholder for Event Page
      }
    ],
  },
]);

export default router;
