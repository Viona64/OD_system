import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { FileText, Upload, ArrowLeft, AlertCircle, FileCheck, X } from "lucide-react";
import { toast } from "sonner";

export function ApplyOD() {
  const { currentUser, addApplication, leavePolicy } = useApp();
  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [periodCount, setPeriodCount] = useState(7);
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const odRemaining = currentUser
    ? Math.max(0, leavePolicy.maxODPerSemester - currentUser.usedOD)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    if (odRemaining < periodCount) {
      toast.error(`Insufficient OD balance. You have ${odRemaining} period(s) remaining.`);
      return;
    }

    addApplication({
      studentName: currentUser.name,
      registerNumber: currentUser.registerNumber,
      type: "od",
      date,
      reason,
      eventName,
      proofUrl: proof ? URL.createObjectURL(proof) : undefined,
      periodCount,
    });

    toast.success("OD application submitted successfully!");
    navigate("/student");
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setProof(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProof(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8 font-sans">
      <Button
        variant="ghost"
        onClick={() => navigate("/student")}
        className="rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Dashboard
      </Button>

      <Card className="rounded-2xl border-slate-200/80 shadow-md bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/80 border border-emerald-400/30 flex items-center justify-center text-white shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Apply for On-Duty (OD)</h2>
              <p className="text-xs text-emerald-200 mt-0.5">Request official absence for events & competitions</p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-emerald-200 font-medium block">OD Balance</span>
            <span className="text-lg font-black text-emerald-400">{odRemaining} Periods</span>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Warning callout banner */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-amber-900">Certificate Verification Required</p>
                <p className="text-amber-800 leading-relaxed">
                  OD requests require valid proof (event pass, invitation, or certificate). Requests submitted without proof remain tagged as regular absence until certificate verification by your mentor.
                </p>
              </div>
            </div>

            {/* Event Name Input */}
            <div className="space-y-2">
              <Label htmlFor="eventName" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Event / Competition Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="eventName"
                type="text"
                placeholder="e.g., National Hackathon 2026, AI Workshop, Sports Meet"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm focus:border-emerald-500 focus:bg-white"
                required
              />
            </div>

            {/* Date Input & Period Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Event Date <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm focus:border-emerald-500 focus:bg-white w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodCount" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Number of Periods <span className="text-rose-500">*</span>
                </Label>
                <select
                  id="periodCount"
                  value={periodCount}
                  onChange={(e) => setPeriodCount(Number(e.target.value))}
                  className="h-11 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500 focus:bg-white px-3 w-full outline-none"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Period" : "Periods"} {num === 7 ? "(Full Day)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Description & Event Details <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Provide venue, organizers, and your role/participation details in the event..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="rounded-xl bg-slate-50 border-slate-200 text-sm focus:border-emerald-500 focus:bg-white p-3.5"
                required
              />
            </div>

            {/* Drag & Drop Proof Upload */}
            <div className="space-y-2">
              <Label htmlFor="proof" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Upload Proof Document / Certificate <span className="text-slate-400 font-normal">(Recommended)</span>
              </Label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50/50"
                    : proof
                    ? "border-emerald-400 bg-emerald-50/40"
                    : "border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-slate-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  id="proof"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />

                {proof ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-6 h-6 text-emerald-600" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{proof.name}</p>
                        <p className="text-[11px] text-slate-400">{(proof.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProof(null);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      Upload Certificate or Pass <span className="font-normal text-slate-500">or drag and drop</span>
                    </p>
                    <p className="text-[11px] text-slate-400">PDF, PNG, JPG (max 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/student")}
                className="flex-1 h-11 rounded-xl border-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/30"
              >
                Submit OD Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
