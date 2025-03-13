import { Event } from '@/src/domain/Event';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { LucideIcon } from 'lucide-react';

type EventsTableProps = {
  events: Event[];
  title: string;
  TitleIcon: LucideIcon;
};

export const EventsTable = ({ events, title, TitleIcon }: EventsTableProps) => {
  return (
    <div className="first:-mt-4">
      <div className="flex items-center mt-4 mb-3">
        <TitleIcon className="mr-2" />
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {title}
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Identifier</TableHead>
            <TableHead className="w-1/4">Name</TableHead>
            <TableHead className="w-1/4">Start date</TableHead>
            <TableHead className="w-1/4">End date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events?.map((event) => (
            <TableRow>
              <TableCell className="font-medium">{event.id}</TableCell>
              <TableCell>{event.name}</TableCell>
              <TableCell>
                {format(event.startDate, 'dd/MM/yyyy HH:mm')}
              </TableCell>
              <TableCell>{format(event.endDate, 'dd/MM/yyyy HH:mm')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
