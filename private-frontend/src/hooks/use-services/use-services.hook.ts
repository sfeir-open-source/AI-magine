import { UseServices } from '@/src/hooks/use-services/use-services.types';
import { useContext } from 'react';
import { ServicesContext } from '@/src/providers/services/services.context';

export const useServices = (): UseServices => {
  const context = useContext(ServicesContext);
  if (!context?.eventsService) {
    throw new Error('eventsService is not defined');
  }
  return {
    eventsService: context.eventsService,
  };
};
