import { CreateEventDialog } from '@/src/components/create-event-dialog/create-event-dialog';

export const EventListHeader = () => {
  return (
    <header className="w-full flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center px-4 w-full justify-between">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Events list
        </h2>
        <CreateEventDialog />
      </div>
    </header>
  );
};
