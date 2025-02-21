import { Navigate, Route, Routes } from 'react-router';
import { EventSelectionPage } from '@/src/pages/event-selection.page';
import { EventPromptPage } from '@/src/pages/event-prompt.page';

export const ReactRouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="/events" Component={EventSelectionPage} />
      <Route path="/events/:eventId" Component={EventPromptPage} />
    </Routes>
  );
};
