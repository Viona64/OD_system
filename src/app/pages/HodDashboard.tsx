import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Search,
  SlidersHorizontal,
  Calendar,
  FileText,
  UserCog,
  FileCheck,
  ArrowRight
} from "lucide-react";

export function HodDashboard() {
  const { applications } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  // HOD Pending applications are those that have been approved by the Mentor (mentor_approved)
  const pendingApplications = applications.filter((app) => app.status === "mentor_approved");
  const approvedApplications = applications.filter((app) => app.status === "approved");
  const rejectedApplications = applications.filter((app) => app.status === "rejected");

  const filteredApplications = applications.filter((app) => {
    // Map activeTab state to actual status values
    let matchesTab = false;
    if (activeTab === "all") {
      matchesTab = true;
    } else if (activeTab === "pending") {
      matchesTab = app.status === "mentor_approved";
    } else {
      matchesTab = app.status === activeTab;
    }

    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.eventName && app.eventName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved by HOD
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
      {/* HOD Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <UserCog className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">HOD Approval Portal</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Final-stage approval for student leave and official duty requests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-xs text-slate-300 font-medium block">Pending HOD</span>
            <span className="text-xl font-black text-purple-400">{pendingApplications.length}</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <button
          onClick={() => setActiveTab("pending")}
          className={`text-left transition-all ${activeTab === "pending" ? "ring-2 ring-purple-500 rounded-2xl" : ""}`}
        >
          <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pending HOD Review
                </span>
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{pendingApplications.length}</span>
                <span className="text-xs text-slate-400 font-medium">applications</span>
              </div>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => setActiveTab("approved")}
          className={`text-left transition-all ${activeTab === "approved" ? "ring-2 ring-emerald-500 rounded-2xl" : ""}`}
        >
          <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Fully Approved
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{approvedApplications.length}</span>
                <span className="text-xs text-slate-400 font-medium">applications</span>
              </div>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`text-left transition-all ${activeTab === "rejected" ? "ring-2 ring-rose-500 rounded-2xl" : ""}`}
        >
          <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rejected
                </span>
                <XCircle className="w-5 h-5 text-rose-500" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{rejectedApplications.length}</span>
                <span className="text-xs text-slate-400 font-medium">applications</span>
              </div>
            </CardContent>
          </Card>
        </button>
      </div>

      {/* Main Table/Cards Area */}
      <Card className="rounded-2xl border-slate-200/80 shadow-md bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Student Requests</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Review, filter and decide on pending department applications
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search student, register..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 rounded-xl text-sm"
              />
            </div>

            {/* Filter Pill Selectors */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 w-full sm:w-auto overflow-x-auto">
              {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all shrink-0 ${
                    activeTab === tab
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/20"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab === "pending" ? "Pending HOD" : tab}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-200/30">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-base">No Applications Found</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  No records matched your search query or tab filter in this portal.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-200 hover:shadow-md transition-all gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Left Icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      app.type === "leave" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {app.type === "leave" ? <Calendar className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>

                    {/* Details Column */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {app.studentName}
                        </h4>
                        <span className="text-xs text-slate-400 font-mono font-medium">
                          ({app.registerNumber})
                        </span>
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                          {app.type}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        Reason: <span className="text-slate-800 font-semibold">{app.eventName || app.reason}</span>
                      </p>

                      <p className="text-[11px] text-slate-400 font-medium">
                        Requested: <span className="text-slate-600 font-semibold">{app.date}</span> • Submitted: {app.submittedDate}
                      </p>
                      
                      {app.mentorComment && (
                        <p className="text-[11px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100 inline-block font-medium">
                          <span className="font-bold text-emerald-600 mr-1">Mentor Rec:</span> "{app.mentorComment}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-3.5 self-end md:self-center">
                    {getStatusBadge(app.status)}
                    <Button
                      size="sm"
                      onClick={() => navigate(`/hod/approval/${app.id}`)}
                      className={`h-9 px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                        app.status === "mentor_approved"
                          ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      <span>{app.status === "mentor_approved" ? "Approve/Reject" : "Details"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
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
