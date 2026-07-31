import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Users, Calendar, FileText, TrendingUp, Sliders, ShieldCheck, UserPlus, ArrowRight } from "lucide-react";

export function AdminDashboard() {
  const { students, applications, leavePolicy } = useApp();
  const navigate = useNavigate();

  const totalLeaveUsed = students.reduce((sum, student) => sum + student.usedLeave, 0);
  const totalODUsed = students.reduce((sum, student) => sum + student.usedOD, 0);
  const pendingApplications = applications.filter((app) => app.status === "pending" || app.status === "mentor_approved").length;
  const approvedApplications = applications.filter((app) => app.status === "approved").length;

  const leaveApplications = applications.filter((app) => app.type === "leave");
  const odApplications = applications.filter((app) => app.type === "od");

  return (
    <div className="space-y-8 pb-8 font-sans">
      {/* Admin Hero Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">System Admin Console</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Global statistics, leave policy configuration, and student directory management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/admin/students")}
            className="h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md px-4 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Manage Students
          </Button>
          <Button
            onClick={() => navigate("/admin/policy")}
            variant="outline"
            className="h-10 bg-white/10 hover:bg-white/20 border-white/20 text-white font-semibold text-xs rounded-xl px-4 flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            Policy Settings
          </Button>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Enrolled
              </span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-900">{students.length}</div>
              <span className="text-xs text-slate-400 font-medium">Students</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Active student registry count</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Leaves Taken
              </span>
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-900">{totalLeaveUsed}</div>
              <span className="text-xs text-slate-400 font-medium">{leaveApplications.length} requests</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium font-mono">Aggregated leave periods used</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total OD Granted
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-900">{totalODUsed}</div>
              <span className="text-xs text-slate-400 font-medium">{odApplications.length} requests</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Approved on-duty event periods</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                System Queue
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-900">{pendingApplications}</div>
              <span className="text-xs text-emerald-600 font-bold">{approvedApplications} approved</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Applications pending review</p>
          </CardContent>
        </Card>
      </div>

      {/* Policy Settings Quick Summary Card */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Current Semester Policy</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Active quotas applied across all registered students
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/policy")}
            className="rounded-xl border-slate-200 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            Edit Settings
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-blue-50/40 border border-indigo-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Max Leave / Semester
                </p>
                <p className="text-3xl font-black text-indigo-950 mt-1">
                  {leavePolicy.maxLeavePerSemester} <span className="text-xs font-medium text-slate-600">Periods</span>
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/40 border border-emerald-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Max OD / Semester
                </p>
                <p className="text-3xl font-black text-emerald-950 mt-1">
                  {leavePolicy.maxODPerSemester} <span className="text-xs font-medium text-slate-600">Periods</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Usage Overview */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Student Leave & OD Usage Monitor</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Live semester utilization percentages per student
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/students")}
            className="rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Full Student Directory <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            {students.map((student) => {
              const leavePct = Math.min(100, Math.round((student.usedLeave / leavePolicy.maxLeavePerSemester) * 100));
              const odPct = Math.min(100, Math.round((student.usedOD / leavePolicy.maxODPerSemester) * 100));

              return (
                <div key={student.id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{student.name}</h4>
                        <p className="text-xs text-slate-500 font-mono">{student.registerNumber} • {student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold self-end sm:self-auto">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Leave: {student.usedLeave} / {leavePolicy.maxLeavePerSemester}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                        OD: {student.usedOD} / {leavePolicy.maxODPerSemester}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                        <span>Leave Consumption</span>
                        <span className="text-indigo-600">{leavePct}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${leavePct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                        <span>OD Consumption</span>
                        <span className="text-emerald-600">{odPct}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${odPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}