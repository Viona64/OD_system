import { useApp } from "../context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Bell, CheckCircle2, Clock, Sparkles } from "lucide-react";

export function Notifications() {
  const { notifications, markNotificationRead } = useApp();

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const handleMarkAsRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleMarkAllAsRead = () => {
    unreadNotifications.forEach((n) => markNotificationRead(n.id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8 font-sans">
      <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Notifications</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Stay updated on application decisions and system alerts
              </CardDescription>
            </div>
          </div>

          {unreadNotifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="rounded-xl border-slate-200 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Mark all as read
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Unread Section */}
            {unreadNotifications.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Unread Alerts</h3>
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadNotifications.length} New
                  </span>
                </div>

                <div className="space-y-2.5">
                  {unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 bg-indigo-50/60 border border-indigo-200/80 rounded-2xl flex items-start justify-between gap-4 hover:border-indigo-300 transition-all"
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse mt-1.5 shrink-0" />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900 leading-snug">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {notification.date}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="h-8 text-xs font-semibold text-indigo-600 hover:bg-indigo-100/60 rounded-lg shrink-0"
                      >
                        Dismiss
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Read Section */}
            {readNotifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Earlier Notifications</h3>
                <div className="space-y-2">
                  {readNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl flex items-start gap-3.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-700">{notification.message}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{notification.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {notifications.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No notifications yet</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Whenever mentors approve or update your requests, notifications will appear here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
