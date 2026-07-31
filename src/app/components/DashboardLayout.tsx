import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  CalendarPlus,
  FileCheck2,
  History,
  Users,
  Sliders,
  Bell,
  LogOut,
  GraduationCap,
  Menu,
  X,
  ChevronRight,
  UserCheck,
  ShieldAlert,
  UserCog,
} from "lucide-react";
import { Button } from "./ui/button";

export function DashboardLayout() {
  const { userRole, currentUser, setUserRole, setCurrentUser, notifications } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!userRole) {
      navigate("/");
    }
  }, [userRole, navigate]);

  // Close mobile navigation on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    navigate("/");
  };

  const getNavigationItems = () => {
    switch (userRole) {
      case "student":
        return [
          { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
          { icon: CalendarPlus, label: "Apply Leave", path: "/student/apply-leave" },
          { icon: FileCheck2, label: "Apply OD", path: "/student/apply-od" },
          { icon: History, label: "Application History", path: "/student/history" },
          { icon: Bell, label: "Notifications", path: "/student/notifications" },
        ];
      case "mentor":
        return [
          { icon: LayoutDashboard, label: "Dashboard", path: "/mentor" },
          { icon: Bell, label: "Notifications", path: "/mentor/notifications" },
        ];
      case "hod":
        return [
          { icon: LayoutDashboard, label: "Dashboard", path: "/hod" },
          { icon: Bell, label: "Notifications", path: "/hod/notifications" },
        ];
      case "admin":
        return [
          { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
          { icon: Users, label: "Manage Students", path: "/admin/students" },
          { icon: Sliders, label: "Leave Policy", path: "/admin/policy" },
          { icon: Bell, label: "Notifications", path: "/admin/notifications" },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === "/student" || path === "/mentor" || path === "/hod" || path === "/admin") {
      return "Overview Dashboard";
    }
    
    const titleMap: { [key: string]: string } = {
      "apply-leave": "Apply for Leave",
      "apply-od": "Apply for On-Duty (OD)",
      "history": "Application History",
      "upload-proof": "Upload OD Proof Document",
      "notifications": "System Notifications",
      "approval": "Review Application Request",
      "students": "Manage Students Directory",
      "policy": "Semester Leave Policy Settings",
    };
    
    const segment = path.split("/").filter(Boolean).pop() || "";
    const baseSegment = segment.split("/")[0];
    
    return titleMap[baseSegment] || segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "student":
        return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case "mentor":
        return <UserCheck className="w-5 h-5 text-emerald-400" />;
      case "hod":
        return <UserCog className="w-5 h-5 text-purple-400" />;
      case "admin":
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      default:
        return null;
    }
  };

  const getRoleBadgeStyle = () => {
    switch (userRole) {
      case "student":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "mentor":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "hod":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "admin":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-800 text-slate-400";
    }
  };

  const getNotificationPath = () => {
    if (userRole === "mentor") return "/mentor/notifications";
    if (userRole === "hod") return "/hod/notifications";
    if (userRole === "admin") return "/admin/notifications";
    return "/student/notifications";
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                LeavePortal <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">v2.0</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Academic Portal</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Role Banner */}
        <div className="px-4 py-3 mx-4 mt-4 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {getRoleIcon()}
            <div>
              <span className="text-xs text-slate-400 block font-medium">Active Mode</span>
              <span className="text-xs font-semibold text-white capitalize">{userRole} Portal</span>
            </div>
          </div>
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeStyle()}`}>
            {userRole}
          </span>
        </div>

        {/* Main Nav Items */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Navigation Menu
          </p>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isNotification = item.label === "Notifications";

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isNotification && unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
                {isActive && (
                  <div className="w-1.5 h-6 bg-white rounded-full absolute -left-1 top-1/2 -translate-y-1/2 hidden lg:block" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white text-sm shadow-xs">
              {currentUser?.name ? currentUser.name.charAt(0) : userRole?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser?.name || `${userRole?.charAt(0).toUpperCase()}${userRole?.slice(1)} Account`}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {currentUser?.registerNumber || currentUser?.email || `${userRole}@college.edu`}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span className="capitalize">{userRole} Portal</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-indigo-600 font-semibold">{getPageTitle()}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* Quick Actions Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(getNotificationPath())}
              className="relative rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>

            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200">
                {currentUser?.name.charAt(0) || userRole?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-slate-900 leading-none">
                  {currentUser?.name || `${userRole?.charAt(0).toUpperCase()}${userRole?.slice(1)}`}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 capitalize font-medium">
                  {userRole} Account
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Main Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-fade-in max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}