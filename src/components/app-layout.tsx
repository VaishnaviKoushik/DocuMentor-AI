// src/components/app-layout.tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';
import SidebarContent from '@/components/sidebar-content';
import { type View } from '@/app/page';

type AppLayoutProps = {
  children: React.ReactNode;
  view: View;
  setView: (view: View) => void;
};

export default function AppLayout({ children, view, setView }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent view={view} setView={setView} />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
