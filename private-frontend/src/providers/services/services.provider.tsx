import React, { PropsWithChildren } from 'react';
import { ServiceProviderProps } from '@/src/providers/services/services.types';
import { ServicesContext } from '@/src/providers/services/services.context';

export const ServicesProvider = ({
  children,
  ...props
}: PropsWithChildren<ServiceProviderProps>) => {
  return (
    <ServicesContext.Provider value={props}>
      {children}
    </ServicesContext.Provider>
  );
};
