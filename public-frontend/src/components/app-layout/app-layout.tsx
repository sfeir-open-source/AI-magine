import { TypographyH1 } from '@/src/components/typography/h1';
import { PropsWithChildren } from 'react';
import { NavLink } from 'react-router';

export const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full h-full">
      <div className="w-full mx-auto py-4 px-3 flex flex-col">
        <NavLink to="/events" className="shrink-0">
          <TypographyH1 className="text-center mb-4">SF≡IR GENΛI</TypographyH1>
        </NavLink>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
