import { createBrowserRouter, RouterProvider } from 'react-router';
import { RootPage } from '@/src/pages/root.page';
import { Foo } from '@/src/components/foo';
import { EventListPage } from '@/src/pages/event-list.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: '/events',
        element: <EventListPage />,
      },
      {
        path: '/events/:id',
        element: <Foo />,
      },
    ],
  },
]);

export const ReactRouterConfig = () => {
  return <RouterProvider router={router} />;
};
