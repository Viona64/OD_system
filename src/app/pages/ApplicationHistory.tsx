import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { CheckCircle2, XCircle, Clock, Upload, Search, History as HistoryIcon, Calendar, FileText } from "lucide-react";

export function ApplicationHistory() {
  const { currentUser, applications } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "leave" | "od" | "pending" | "approved" | "rejected">("all");

  if (!currentUser) return null;

  const studentApplications = applications.filter(
    (app) => app.registerNumber === currentUser.registerNumber
  );

  const filteredApplications = studentApplications.filter((app) => {
    let matchesTab = true;
    if (filterTab === "leave" || filterTab === "od") {
      matchesTab = app.type === filterTab;
    } else if (filterTab === "pending") {
      matchesTab = app.status === "pending" || app.status === "mentor_approved";
    } else if (filterTab === "approved" || filterTab === "rejected") {
      matchesTab = app.status === filterTab;
    }

    const matchesSearch =
      app.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.eventName && app.eventName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.mentorComment && app.mentorComment.toLowerCase().includes(searchTerm.toLowerCase())) ||
      app.date.includes(searchTerm);

    return matchesTab && matchesSearch;
  });

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
            Pending HOD
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Mentor
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-8 font-sans">
      <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HistoryIcon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Application History</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Track and review all your submitted leave & OD records
                </CardDescription>
              </div>
            </div>

            <Button
              onClick={() => navigate("/student/apply-leave")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl h-9 px-4 self-start sm:self-auto"
            >
              + New Application
            </Button>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto">
              {(["all", "leave", "od", "pending", "approved", "rejected"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all whitespace-nowrap ${
                    filterTab === tab
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 bg-slate-50 border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <HistoryIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No matching applications found</p>
              <p className="text-xs text-slate-400">Try changing your filters or submit a new leave/OD request.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-slate-200">
                      <TableHead className="text-xs font-bold text-slate-600 uppercase">Date of Absence</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600 uppercase">Type</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600 uppercase">Periods</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600 uppercase">Event / Reason</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600 uppercase">Submitted On</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600 uppercase">Status</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600 uppercase">Mentor Feedback</TableHead>
                      <TableHead className="text-xs font-bold text-slate-600 uppercase text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100">
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-slate-900">
                          {new Date(app.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-[11px] font-bold capitalize ${
                              app.type === "leave"
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {app.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-700 font-mono">
                          {app.periodCount} Period(s)
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-800 max-w-xs">
                          {app.type === "od" ? app.eventName : app.reason}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 font-mono">
                          {new Date(app.submittedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="text-xs text-slate-600 max-w-[200px]">
                          {app.mentorComment && (
                            <div className="italic"><span className="font-bold text-slate-500">Mentor:</span> "{app.mentorComment}"</div>
                          )}
                          {app.hodComment && (
                            <div className="italic mt-1"><span className="font-bold text-slate-500">HOD:</span> "{app.hodComment}"</div>
                          )}
                          {!app.mentorComment && !app.hodComment && (
                            <span className="text-slate-400">Pending review...</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden space-y-3">
                {filteredApplications.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`text-[11px] font-bold capitalize ${
                          app.type === "leave"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {app.type}
                      </Badge>
                      {getStatusBadge(app.status)}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{app.eventName || app.reason}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-1">
                        Absence Date: {new Date(app.date).toLocaleDateString()} • {app.periodCount} Period(s)
                      </p>
                    </div>

                    {app.mentorComment && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic">
                        <span className="font-bold text-slate-500">Mentor:</span> "{app.mentorComment}"
                      </p>
                    )}
                    {app.hodComment && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic mt-1">
                        <span className="font-bold text-slate-500">HOD:</span> "{app.hodComment}"
                      </p>
                    )}

                    {app.type === "od" && !app.proofUrl && (app.status === "pending" || app.status === "mentor_approved") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/student/upload-proof/${app.id}`)}
                        className="w-full h-8 text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50 rounded-lg"
                      >
                        <Upload className="w-3.5 h-3.5 mr-1" />
                        Upload Certificate Proof
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
