import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const sidebarData = [
  {
    title: 'Events',
    url: '/',
    items: [
      {
        title: 'See all events',
        url: '/events',
      },
      {
        title: 'Create an event',
        url: '/events/create',
      },
    ],
  },
  {
    title: 'Users',
    url: '/',
    items: [
      {
        title: 'See all users',
        url: '/users',
      },
    ],
  },
];

export const SidebarEventsList = () => {
  return sidebarData.map((item) => (
    <SidebarGroup key={item.title}>
      <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {item.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={false}>
                <a href={item.url}>{item.title}</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
};
