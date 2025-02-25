import { EventsList } from '@/src/components/events-list';
import i18n from '@/src/config/i18n';
import { Container } from '@/src/components/container';
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel, SidebarHeader,
  SidebarInset,
  SidebarMenu, SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Outlet } from 'react-router';
import {Logo} from "@/src/components/logo";
import {TypographyH1} from "@/src/components/typography";

export const HomePage = () => {
  return (
    <Container>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarGroup className={'flex flex-row items-center justify-between'}>
                  <Logo height={48} width={48} />
                  <TypographyH1 style={{fontSize: '2rem'}}>{i18n.t('common.appName')}</TypographyH1>
              </SidebarGroup>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarGroup>
              <SidebarGroupLabel>
                {i18n.t('common.sidebar.events.label')}
              </SidebarGroupLabel>
              <EventsList />
            </SidebarGroup>
          </SidebarMenu>
        </Sidebar>
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </Container>
  );
};
