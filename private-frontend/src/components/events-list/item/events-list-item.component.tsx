import { EventsListItemProps } from '@/src/components/events-list/item/events-list-item.props';
import { Link } from 'react-router';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export const EventsListItem = ({
  id,
  name,
  startDate,
  endDate,
}: EventsListItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={`/events/${id}`}>
          <div className={'w-full'}>
            <p className={"font-bold"}>{name}</p>
            <p className={'text-xs text-right text-gray-400'}>
              ({startDate.toLocaleDateString()} -&gt; {endDate.toLocaleDateString()})
            </p>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
