import React, { useCallback, useContext, useEffect, memo } from 'react';
import {
  School,
  ChartPie,
  BookOpen,
  Settings2,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Wallet,
  CreditCard,
  Clock,
  House,
  CalendarDays,
  NotebookPen,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import getInitials from '@/helpers/get-initials';
import { Link, useNavigate } from 'react-router-dom';
import useLogout from '@/hooks/useLogout';
import Context from '@/context/context';
import _ from 'lodash';

const data = {
  navMain: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      url: '#',
      icon: ChartPie,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: '#/dashboard/overview',
        },
        {
          title: 'Analytics',
          url: '/dashboard',
        },
      ],
    },

    {
      id: 'subjects',
      title: 'Subjects',
      url: '#',
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: 'Subjects List',
          url: '/my-subjects',
        },
        {
          title: 'Enrollments',
          url: '/my-subjects/enrollments',
        },
      ],
    },
    {
      id: 'attendance',
      title: 'Attendance',
      url: '#',
      icon: Clock,
      isActive: true,
      items: [
        {
          title: 'Attendance List',
          url: '/my-attendance/attendance-list',
        },
        {
          title: 'Attendance Calendar',
          url: '/my-attendance/attendance-calendar',
        },
      ],
    },
    {
      id: 'homework',
      title: 'Homework',
      url: '#',
      icon: NotebookPen,
      isActive: true,
      items: [
        {
          title: 'My Homework List',
          url: '/my-homeworks',
        },
      ],
    },
  ],
  quickAccess: [
    {
      name: 'Attendance Calendar',
      url: '/my-attendance/attendance-calendar',
      icon: CalendarDays,
    },
    {
      name: 'Syllabus',
      url: '/boards',
      icon: School,
    },
    {
      name: 'Home Page',
      url: '/',
      icon: House,
    },
  ],
};

const StudentSidebar = ({ user, children }) => {
  const logoutFunction = useLogout();
  const navigate = useNavigate();

  const {
    notificationState: { fetchNotificationsAction, notifications },
    sidebarState: { isSidebarOpen, navMainStudent, changeNavMainStudentAction },
  } = useContext(Context);

  useEffect(() => {
    if (!notifications) {
      fetchNotificationsAction();
    }
  }, []);

  const changeNavMainStudentGroupFunction = useCallback(
    (id) => {
      let value = navMainStudent[id];
      let updateState = _.cloneDeep(navMainStudent);
      updateState[id] = !value;
      changeNavMainStudentAction(updateState);
    },
    [navMainStudent]
  );

  return (
    <SidebarProvider open={isSidebarOpen}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <School className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Edu Excellence Tutorial</span>
                    <span className="truncate text-xs">Student Portal</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  // defaultOpen={item.isActive}
                  open={navMainStudent[item?.id] ?? false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      asChild
                      onClick={() => changeNavMainStudentGroupFunction(item.id)}
                    >
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem?.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={subItem?.url}>
                                <span>{subItem?.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
            <SidebarMenu>
              {data.quickAccess.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="rounded-lg">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="rounded-lg">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.name}</span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/settings/my-profile')}>
                      <Settings2 />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Wallet />
                      Subscription
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logoutFunction()}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default memo(StudentSidebar);
