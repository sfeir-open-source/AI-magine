import { UseServices } from '@/src/hooks/use-services/use-services.types';
import { useContext } from 'react';
import { ServicesContext } from '@/src/providers/services/services.context';

export const useServices = (): UseServices => {
  const context = useContext(ServicesContext);
  if (!context?.sfeirEventsService) {
    throw new Error('sfeirEventsService is not defined');
  }
  return {
    sfeirEventsService: context.sfeirEventsService,
  };
};
