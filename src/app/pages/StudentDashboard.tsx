import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  PlusCircle,
  Upload,
  Sparkles,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export function StudentDashboard() {
  const { currentUser, applications, leavePolicy } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const studentApplications = applications.filter(
    (app) => app.registerNumber === currentUser.registerNumber
  );

  const recentApplications = studentApplications.slice(-5).reverse();

  const leaveRemaining = Math.max(0, leavePolicy.maxLeavePerSemester - currentUser.usedLeave);
  const odRemaining = Math.max(0, leavePolicy.maxODPerSemester - currentUser.usedOD);

  const leaveUsagePct = Math.min(100, Math.round((currentUser.usedLeave / leavePolicy.maxLeavePerSemester) * 100));
  const odUsagePct = Math.min(100, Math.round((currentUser.usedOD / leavePolicy.maxODPerSemester) * 100));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      case "mentor_approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Clock className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            Pending HOD Approval
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Mentor Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-8 font-sans">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,#818cf8,transparent)] opacity-25 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-black text-white shadow-inner">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 border border-indigo-400/30 text-indigo-200">
                  <Sparkles className="w-3 h-3 text-indigo-300" /> Active Semester
                </span>
                <span className="text-xs text-indigo-200 font-mono font-medium">
                  {currentUser.registerNumber}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Welcome back, {currentUser.name}!
              </h2>
              <p className="text-indigo-200 text-xs sm:text-sm mt-1">
                {currentUser.email} • Computer Science & Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto">
            <Button
              onClick={() => navigate("/student/apply-leave")}
              className="flex-1 md:flex-initial h-11 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              Apply Leave
            </Button>
            <Button
              onClick={() => navigate("/student/apply-od")}
              className="flex-1 md:flex-initial h-11 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Apply OD
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Leave */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Leave Quota
              </span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-900">
                {leavePolicy.maxLeavePerSemester}
              </div>
              <span className="text-xs text-slate-400 font-medium">Periods / Sem</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Max allowed leave limit</p>
          </CardContent>
        </Card>

        {/* Leave Remaining */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Leave Balance
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-900">
                {leaveRemaining}
              </div>
              <span className="text-xs text-slate-500 font-medium">Used: {currentUser.usedLeave}</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                <span>Usage</span>
                <span>{leaveUsagePct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${leaveUsagePct}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total OD */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                OD Allowance
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-900">
                {leavePolicy.maxODPerSemester}
              </div>
              <span className="text-xs text-slate-400 font-medium">Periods / Sem</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Max allowed OD limit</p>
          </CardContent>
        </Card>

        {/* OD Remaining */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                OD Balance
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-900">
                {odRemaining}
              </div>
              <span className="text-xs text-slate-500 font-medium">Used: {currentUser.usedOD}</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                <span>Usage</span>
                <span>{odUsagePct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${odUsagePct}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white p-6 relative overflow-hidden shadow-xs hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Apply for Standard Leave</h3>
              <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
                Need time off for illness, personal emergencies, or family commitments? Submit your leave request for mentor approval.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={() => navigate("/student/apply-leave")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl h-10 px-5 shadow-md shadow-indigo-600/20"
            >
              <span>Submit Leave Request</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>

        <Card className="rounded-2xl border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white p-6 relative overflow-hidden shadow-xs hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Apply for On-Duty (OD)</h3>
              <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
                Attending hackathons, sports events, workshops, or paper presentations? Request OD and attach certificate proofs.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={() => navigate("/student/apply-od")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl h-10 px-5 shadow-md shadow-emerald-600/20"
            >
              <span>Submit OD Request</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Applications Feed */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Recent Applications</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Your latest submitted requests and current status updates
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/student/history")}
            className="rounded-xl border-slate-200 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            View All History
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          {recentApplications.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No applications submitted yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Whenever you submit leave or OD requests, they will appear here with live tracking.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 hover:border-indigo-200 transition-all gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      app.type === "leave" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {app.type === "leave" ? <Calendar className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">
                          {app.eventName || app.reason}
                        </span>
                        <Badge variant="outline" className="text-[11px] font-semibold capitalize bg-white">
                          {app.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Requested for: <span className="text-slate-700 font-semibold">{new Date(app.date).toLocaleDateString()}</span> • Submitted on: {new Date(app.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {app.type === "od" && !app.proofUrl && (app.status === "pending" || app.status === "mentor_approved") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/student/upload-proof/${app.id}`)}
                        className="h-8 text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50 rounded-lg"
                      >
                        <Upload className="w-3.5 h-3.5 mr-1" />
                        Upload Proof
                      </Button>
                    )}
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}