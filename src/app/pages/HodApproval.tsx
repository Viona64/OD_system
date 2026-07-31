import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { CheckCircle2, XCircle, ArrowLeft, FileText, Image, UserCog, AlertCircle, Clock, UserCheck } from "lucide-react";
import { toast } from "sonner";

export function HodApproval() {
  const { id } = useParams();
  const { applications, updateApplication, students, updateStudent } = useApp();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  const application = applications.find((app) => app.id === id);

  const handleApprove = () => {
    if (!id || !application) return;

    // Transition to fully approved
    updateApplication(id, {
      status: "approved",
      hodComment: comment || "Approved by HOD",
    });

    // Deduct leave / OD quota for student since it is fully approved!
    const student = students.find((s) => s.registerNumber === application.registerNumber);
    if (student) {
      if (application.type === "leave") {
        updateStudent(student.id, {
          usedLeave: student.usedLeave + (application.periodCount || 1),
        });
      } else {
        updateStudent(student.id, {
          usedOD: student.usedOD + (application.periodCount || 1),
        });
      }
    }

    toast.success("Application fully approved successfully!");
    navigate("/hod");
  };

  const handleReject = () => {
    if (!id || !application) return;

    if (!comment.trim()) {
      toast.error("Please provide a reason for rejection in the comment box.");
      return;
    }

    updateApplication(id, {
      status: "rejected",
      hodComment: comment,
    });

    toast.success("Application rejected.");
    navigate("/hod");
  };

  if (!application) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-500 font-medium">Application request not found.</p>
        <Button onClick={() => navigate("/hod")} className="bg-purple-600 hover:bg-purple-700">
          Back to HOD Portal
        </Button>
      </div>
    );
  }

  const isDecided = application.status === "approved" || application.status === "rejected";
  const showMentorComment = !!application.mentorComment;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8 font-sans animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate("/hod")}
        className="rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to HOD Portal
      </Button>

      {/* Main Review Card */}
      <Card className="rounded-2xl border-slate-200/80 shadow-md bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-600/80 border border-purple-400/30 flex items-center justify-center text-white shadow-md">
              <UserCog className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">HOD Final Approval</h2>
              <p className="text-xs text-purple-200 mt-0.5">Request ID #{application.id}</p>
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
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {application.status === "approved" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
              <div>
                <p className="text-sm font-bold capitalize">
                  Application {application.status}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  This application has already been processed by the HOD.
                </p>
              </div>
            </div>
          )}

          {/* Student details */}
          <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/50 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Student Name</span>
              <span className="font-extrabold text-slate-800 text-sm">{application.studentName}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Register Number</span>
              <span className="font-mono font-bold text-slate-700 text-sm">{application.registerNumber}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Date Requested</span>
              <span className="font-bold text-slate-700 text-sm">{application.date}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Periods Requested</span>
              <span className="font-bold text-indigo-600 text-sm">{application.periodCount} Period(s)</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Submission Date</span>
              <span className="font-bold text-slate-500 text-sm">{application.submittedDate}</span>
            </div>
          </div>

          {/* Leave/OD reason details */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Application Details</h3>
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-3">
              {application.type === "od" && application.eventName && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Event Name</span>
                  <span className="text-xs font-bold text-slate-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md inline-block">
                    {application.eventName}
                  </span>
                </div>
              )}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Reason for absence</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/40 p-3 rounded-lg border border-slate-100">
                  {application.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Mentor comment (Stage 1) */}
          {showMentorComment && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                Mentor Recommendation (Stage 1)
              </h3>
              <div className="p-4 rounded-xl border border-emerald-200/50 bg-emerald-50/10 space-y-1">
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Mentor Comment</span>
                <p className="text-xs text-slate-700 italic font-semibold">
                  "{application.mentorComment}"
                </p>
              </div>
            </div>
          )}

          {/* Proof document inspector (if OD) */}
          {application.type === "od" && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Uploaded Certificate / Proof</h3>
              {application.proofUrl ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> certificate-copy.png
                    </span>
                    <Badge variant="outline" className="text-[10px] font-semibold bg-white">
                      Verified Upload
                    </Badge>
                  </div>
                  <div className="p-4 flex justify-center bg-slate-200/40">
                    <img
                      src={application.proofUrl}
                      alt="Certificate Proof"
                      className="max-h-72 object-contain rounded-lg border border-slate-200/80 shadow-xs"
                      onError={(e) => {
                        // fallback if loaded path is mock/invalid
                        e.currentTarget.src = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-amber-200/60 bg-amber-50/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-900">No Proof Uploaded Yet</p>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      The student has not uploaded a digital certificate for this OD request yet. HOD review can still be processed, or you can request proof.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comment text area & Actions */}
          {!isDecided ? (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="space-y-1.5">
                <Label htmlFor="comment" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  HOD Review Comments / Remarks
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Provide your feedback, e.g., 'Approved for college participation.' (Required only for rejection)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-24 bg-white border-slate-200 rounded-xl placeholder:text-slate-400 text-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleApprove}
                  className="flex-1 h-11 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Fully Approve Request
                </Button>
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="flex-1 h-11 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-700 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Request
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">HOD Remarks</span>
              <p className="text-xs text-slate-700 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 font-medium italic">
                "{application.hodComment || 'No comment recorded.'}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
