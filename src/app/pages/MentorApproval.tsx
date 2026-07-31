import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { CheckCircle2, XCircle, ArrowLeft, FileText, Image, UserCheck, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export function MentorApproval() {
  const { id } = useParams();
  const { applications, updateApplication } = useApp();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  const application = applications.find((app) => app.id === id);

  const handleApprove = () => {
    if (!id) return;

    updateApplication(id, {
      status: "mentor_approved",
      mentorComment: comment || "Approved",
    });

    toast.success("Application approved by Mentor. Pending HOD final review.");
    navigate("/mentor");
  };

  const handleReject = () => {
    if (!id) return;

    if (!comment.trim()) {
      toast.error("Please provide a reason for rejection in the comment box.");
      return;
    }

    updateApplication(id, {
      status: "rejected",
      mentorComment: comment,
    });

    toast.success("Application rejected.");
    navigate("/mentor");
  };

  if (!application) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-500 font-medium">Application request not found.</p>
        <Button onClick={() => navigate("/mentor")} className="bg-indigo-600 hover:bg-indigo-700">
          Back to Mentor Portal
        </Button>
      </div>
    );
  }

  const isDecided = application.status !== "pending";

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8 font-sans">
      <Button
        variant="ghost"
        onClick={() => navigate("/mentor")}
        className="rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Mentor Portal
      </Button>

      {/* Main Review Card */}
      <Card className="rounded-2xl border-slate-200/80 shadow-md bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/80 border border-indigo-400/30 flex items-center justify-center text-white shadow-md">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Application Review</h2>
              <p className="text-xs text-indigo-200 mt-0.5">Request ID #{application.id}</p>
            </div>
          </div>

          <Badge
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 ${
              application.type === "leave"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            {application.type} Application
          </Badge>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Status banner if already decided */}
          {isDecided && (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                application.status === "approved"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : application.status === "mentor_approved"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {application.status === "approved" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : application.status === "mentor_approved" ? (
                <Clock className="w-5 h-5 text-indigo-600 animate-pulse" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
              <div className="text-xs font-semibold">
                {application.status === "mentor_approved" ? (
                  <span>Approved by Mentor. Pending HOD approval.</span>
                ) : (
                  <span>This request has been <strong className="capitalize">{application.status}</strong>.</span>
                )}
                {application.mentorComment && (
                  <span className="block font-normal mt-0.5">Comment: "{application.mentorComment}"</span>
                )}
              </div>
            </div>
          )}

          {/* Student Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Student Name</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{application.studentName}</p>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Register Number</span>
              <p className="text-base font-mono font-bold text-slate-900 mt-0.5">{application.registerNumber}</p>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Absence Date</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{new Date(application.date).toLocaleDateString()}</p>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Periods Requested</span>
              <p className="text-sm font-bold text-indigo-650 mt-0.5">{application.periodCount} Period(s)</p>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Submitted On</span>
              <p className="text-sm font-medium text-slate-600 mt-0.5">{new Date(application.submittedDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Event details if OD */}
          {application.type === "od" && application.eventName && (
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Event Name</Label>
              <p className="text-sm font-bold text-slate-900 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {application.eventName}
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Reason Provided</Label>
            <p className="text-sm text-slate-800 p-4 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
              {application.reason}
            </p>
          </div>

          {/* Attached Proof Document section */}
          {application.proofUrl ? (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <FileText className="w-4 h-4 text-emerald-600" /> Uploaded Proof Certificate
              </div>
              <p className="text-xs text-slate-600">The student has attached a verification document for this OD request.</p>
              <div className="pt-2">
                <a
                  href={application.proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
                >
                  <Image className="w-4 h-4" /> View Attached Proof File
                </a>
              </div>
            </div>
          ) : application.type === "od" ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold">No Proof Certificate Uploaded</p>
                <p className="text-amber-800">
                  This OD request currently lacks proof upload. Approving will count it towards the student's OD allowance.
                </p>
              </div>
            </div>
          ) : null}

          {/* Decision Section */}
          {!isDecided && (
            <div className="space-y-5 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mentor Remarks / Comments <span className="text-slate-400 font-normal">(Required for rejection)</span>
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Enter approval comments or explain reason if rejecting this request..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="rounded-xl bg-slate-50 border-slate-200 text-sm focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs"
                >
                  <XCircle className="w-4 h-4 mr-1.5 text-rose-600" />
                  Decline & Reject Request
                </Button>

                <Button
                  onClick={handleApprove}
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Approve Application
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
