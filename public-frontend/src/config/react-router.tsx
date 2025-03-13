import { Navigate, Route, Routes } from 'react-router';
import { EventSelectionPage } from '@/src/pages/event-selection.page';
import { UserInfoFormPage } from '@/src/pages/user-info-form.page';
import { AppLayout } from '@/src/components/app-layout/app-layout';
import { ImageGenerationPage } from '@/src/pages/image-generation.page';
import { EventGalleryPage } from '@/src/pages/event-gallery.page';

export const ReactRouterConfig = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" Component={EventSelectionPage} />
        <Route path="/events/:eventId" Component={UserInfoFormPage} />
        <Route path="/events/:eventId/gallery" Component={EventGalleryPage} />
        <Route
          path="/events/:eventId/image-generation"
          Component={ImageGenerationPage}
        />
      </Routes>
    </AppLayout>
  );
};
