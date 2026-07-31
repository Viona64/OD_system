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
  UserCheck,
  FileCheck
} from "lucide-react";

export function MentorDashboard() {
  const { applications } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const pendingApplications = applications.filter((app) => app.status === "pending");
  const approvedApplications = applications.filter((app) => app.status === "approved" || app.status === "mentor_approved");
  const rejectedApplications = applications.filter((app) => app.status === "rejected");

  const filteredApplications = applications.filter((app) => {
    let matchesTab = false;
    if (activeTab === "all") {
      matchesTab = true;
    } else if (activeTab === "pending") {
      matchesTab = app.status === "pending";
    } else if (activeTab === "approved") {
      matchesTab = app.status === "approved" || app.status === "mentor_approved";
    } else {
      matchesTab = app.status === "rejected";
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
      case "mentor_approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Clock className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            Pending HOD Approval
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Pending Mentor Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-8 font-sans">
      {/* Mentor Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Mentor Review Portal</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Manage student leave and OD approval workflow efficiently
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-xs text-slate-300 font-medium block">Needs Action</span>
            <span className="text-xl font-black text-amber-400">{pendingApplications.length}</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <button
          onClick={() => setActiveTab("pending")}
          className={`text-left transition-all ${activeTab === "pending" ? "ring-2 ring-amber-500 rounded-2xl" : ""}`}
        >
          <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow bg-white h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Requests
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black text-slate-900">{pendingApplications.length}</div>
                <p className="text-xs text-amber-700 font-medium mt-1">Awaiting mentor decision</p>
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
                  Approved Requests
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black text-slate-900">{approvedApplications.length}</div>
                <p className="text-xs text-emerald-700 font-medium mt-1">Approved this semester</p>
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
                  Rejected Requests
                </span>
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <XCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black text-slate-900">{rejectedApplications.length}</div>
                <p className="text-xs text-rose-700 font-medium mt-1">Declined applications</p>
              </div>
            </CardContent>
          </Card>
        </button>
      </div>

      {/* Applications Management Section */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Student Applications</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Review submitted leaves, OD event details, and attached proof documents
              </CardDescription>
            </div>

            {/* Tab filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold self-start sm:self-auto">
              {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                    activeTab === tab
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by student name, reg number, or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-slate-50 border-slate-200 rounded-xl text-xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No applications match your criteria</p>
              <p className="text-xs text-slate-400">Try adjusting your tab filter or search keyword.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-bold flex items-center justify-center text-base shadow-xs shrink-0 mt-0.5">
                      {app.studentName.charAt(0)}
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900">{app.studentName}</h4>
                        <Badge variant="outline" className="text-[11px] font-mono font-semibold bg-white text-slate-600">
                          {app.registerNumber}
                        </Badge>
                        <Badge
                          className={`text-[11px] font-bold capitalize ${
                            app.type === "leave"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {app.type} Application
                        </Badge>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">Date of Absence:</span>
                          <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                            {new Date(app.date).toLocaleDateString()}
                          </span>
                        </p>
                        {app.eventName && (
                          <p>
                            <span className="font-semibold text-slate-700">Event:</span> {app.eventName}
                          </p>
                        )}
                        <p className="line-clamp-2">
                          <span className="font-semibold text-slate-700">Reason:</span> {app.reason}
                        </p>
                      </div>

                      {app.proofUrl && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Proof Certificate Attached
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                    {getStatusBadge(app.status)}

                    <Button
                      onClick={() => navigate(`/mentor/approval/${app.id}`)}
                      className="w-full sm:w-auto h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs px-4 flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{app.status === "pending" ? "Review & Decide" : "View Details"}</span>
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