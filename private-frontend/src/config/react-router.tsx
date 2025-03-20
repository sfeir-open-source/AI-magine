import { Navigate, Route, Routes } from 'react-router';
import { EventListPage } from '@/src/pages/event-list.page';
import { EventDetailPage } from '@/src/pages/event-detail.page';
import { CreateEventPage } from '@/src/pages/create-event.page';

export const ReactRouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="/events" Component={EventListPage} />
      <Route path="/events/create" Component={CreateEventPage} />
      <Route path="/events/:eventId" Component={EventDetailPage} />
    </Routes>
  );
};
