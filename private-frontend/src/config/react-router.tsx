import { Route, Routes } from 'react-router';
import { HomePage } from '@/src/pages/home.page';

export const ReactRouterConfig = () => {
  return (
    <Routes>
      <Route path="/" index={true} Component={HomePage} />
    </Routes>
  );
};
