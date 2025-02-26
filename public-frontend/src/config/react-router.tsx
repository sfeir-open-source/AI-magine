import { Navigate, Route, Routes } from 'react-router';
import { EventSelectionPage } from '@/src/pages/event-selection.page';
import { EventPromptPage } from '@/src/pages/event-prompt.page';
import { AppLayout } from '@/src/components/app-layout/app-layout';
import { PromptLoadingPage } from '@/src/pages/prompt-loading.page';
import { UserImagesPage } from '@/src/pages/user-images.page';

export const ReactRouterConfig = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" Component={EventSelectionPage} />
        <Route path="/events/:eventId" Component={EventPromptPage} />
        <Route
          path="/events/:eventId/prompts/:promptId/loading"
          Component={PromptLoadingPage}
        />
        <Route
          path="/events/:eventId/users/:userId/images"
          Component={UserImagesPage}
        />
      </Routes>
    </AppLayout>
  );
};
