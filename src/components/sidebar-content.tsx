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
import { BrainCircuit, Github, Home, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AppSidebarContent() {
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
          <SidebarMenuButton href="#" isActive>
            <Home />
            Home
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton href="#">
            <Settings />
            Settings
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="text-xs text-sidebar-foreground/70">
          <p>&copy; {new Date().getFullYear()} DocuMentor AI</p>
          <Link href="#" className="hover:text-sidebar-foreground">
            <div className="flex items-center gap-2 mt-2">
                <Github size={16}/>
                <span>View on GitHub</span>
            </div>
          </Link>
        </div>
      </SidebarFooter>
    </SidebarContent>
  );
}
