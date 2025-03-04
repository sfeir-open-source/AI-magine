import { TypographyH1 } from '@/src/components/typography/h1';
import { PropsWithChildren } from 'react';
import { NavLink } from 'react-router';

export const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full h-full">
      <div className="max-w-lg w-full mx-auto py-4 px-3">
        <NavLink to="/events">
          <TypographyH1 className="text-center mb-4">SF≡IR GENΛI</TypographyH1>
        </NavLink>
        {children}
      </div>
    </div>
  );
};
