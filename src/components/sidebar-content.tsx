// src/components/sidebar-content.tsx
'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { BrainCircuit, Github, Home, History, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { type View } from '@/app/page';

type AppSidebarContentProps = {
  view: View;
  setView: (view: View) => void;
};

export default function AppSidebarContent({
  view,
  setView,
}: AppSidebarContentProps) {
  return (
    <SidebarContent>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-sidebar-primary" size={24} />
          <h2 className="font-headline text-lg font-semibold text-sidebar-foreground">
            DocuMentor AI
          </h2>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setView('main')}
            isActive={view === 'main'}
          >
            <Home />
            Home
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setView('history')}
            isActive={view === 'history'}
          >
            <History />
            History
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setView('settings')}
            isActive={view === 'settings'}
          >
            <Settings />
            Settings
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="text-xs text-sidebar-foreground/70">
          <p>&copy; {new Date().getFullYear()} DocuMentor AI</p>
          <Link href="https://github.com/firebase/studio-doc-mentor" target="_blank" className="hover:text-sidebar-foreground">
            <div className="flex items-center gap-2 mt-2">
              <Github size={16} />
              <span>View on GitHub</span>
            </div>
          </Link>
        </div>
      </SidebarFooter>
    </SidebarContent>
  );
}
