import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Upload, ArrowLeft, FileCheck, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function UploadProof() {
  const { id } = useParams();
  const { applications, updateApplication } = useApp();
  const navigate = useNavigate();
  const [proof, setProof] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const application = applications.find((app) => app.id === id);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setProof(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!proof || !id) return;

    updateApplication(id, {
      proofUrl: URL.createObjectURL(proof),
    });

    toast.success("Certificate proof uploaded successfully!");
    navigate("/student/history");
  };

  if (!application) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-500 font-medium">Application record not found.</p>
        <Button onClick={() => navigate("/student/history")} className="bg-indigo-600 hover:bg-indigo-700">
          Back to History
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8 font-sans">
      <Button
        variant="ghost"
        onClick={() => navigate("/student/history")}
        className="rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Application History
      </Button>

      <Card className="rounded-2xl border-slate-200/80 shadow-md bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/80 border border-indigo-400/30 flex items-center justify-center text-white shadow-md">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Upload Certificate Proof</h2>
              <p className="text-xs text-indigo-200 mt-0.5">Attach verification proof for your OD request</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Details summary */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Event Name:</span>
              <span className="font-bold text-slate-900">{application.eventName || "On-Duty Request"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Date of Event:</span>
              <span className="font-mono font-bold text-slate-800">{new Date(application.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Current Status:</span>
              <span className="font-bold text-amber-700 capitalize bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {application.status}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag & Drop zone */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Upload Certificate / Event Pass <span className="text-rose-500">*</span>
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
                    ? "border-indigo-500 bg-indigo-50/50"
                    : proof
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-slate-50"
                }`}
              >
                <input
                  ref={fileInputRef}
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
                        setPreview(null);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
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

            {/* Image Preview */}
            {preview && (
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Document Preview</Label>
                <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 max-h-64 overflow-hidden flex items-center justify-center">
                  <img src={preview} alt="Proof preview" className="max-h-56 object-contain rounded-lg" />
                </div>
              </div>
            )}

            {/* Note banner */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Verification Note:</strong> Once submitted, your mentor receives an instant alert to verify the attached certificate and confirm your OD approval status.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/student/history")}
                className="flex-1 h-11 rounded-xl border-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!proof}
                className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/30 disabled:opacity-50"
              >
                Submit Certificate Proof
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
