import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Sliders, Save, Calendar, FileText, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";

export function LeavePolicySettings() {
  const { leavePolicy, updateLeavePolicy } = useApp();
  const [maxLeave, setMaxLeave] = useState(leavePolicy.maxLeavePerSemester.toString());
  const [maxOD, setMaxOD] = useState(leavePolicy.maxODPerSemester.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPolicy = {
      maxLeavePerSemester: parseInt(maxLeave) || 15,
      maxODPerSemester: parseInt(maxOD) || 10,
    };

    updateLeavePolicy(newPolicy);
    toast.success("Leave & OD semester policy updated successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8 font-sans">
      <Card className="rounded-2xl border-slate-200/80 shadow-md bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/80 border border-indigo-400/30 flex items-center justify-center text-white shadow-md">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Semester Policy Settings</h2>
              <p className="text-xs text-indigo-200 mt-0.5">Configure global leave and OD quotas for all students</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Active Policy Status Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Policy Allocation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Max Leave Quota</p>
                  <p className="text-xl font-black text-indigo-900">{leavePolicy.maxLeavePerSemester} Periods</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Max OD Quota</p>
                  <p className="text-xl font-black text-emerald-900">{leavePolicy.maxODPerSemester} Periods</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Modify Allocation Limits</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="maxLeave" className="text-xs font-bold text-slate-700">
                    Maximum Leave Periods per Semester
                  </Label>
                  <span className="text-xs font-bold text-indigo-600 font-mono">{maxLeave} Periods</span>
                </div>
                <Input
                  id="maxLeave"
                  type="number"
                  min="1"
                  max="300"
                  value={maxLeave}
                  onChange={(e) => setMaxLeave(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm focus:border-indigo-500 focus:bg-white"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Defines the maximum allowed absence quota for personal/medical reasons.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="maxOD" className="text-xs font-bold text-slate-700">
                    Maximum OD Periods per Semester
                  </Label>
                  <span className="text-xs font-bold text-emerald-600 font-mono">{maxOD} Periods</span>
                </div>
                <Input
                  id="maxOD"
                  type="number"
                  min="1"
                  max="300"
                  value={maxOD}
                  onChange={(e) => setMaxOD(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm focus:border-emerald-500 focus:bg-white"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Defines the maximum allowed On-Duty allowance for academic and co-curricular events.
                </p>
              </div>
            </div>

            {/* Note banner */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Policy Impact Note:</strong> Updating quotas instantly updates balance tracking across student dashboards for all subsequent application submissions. Existing historical applications remain saved.
              </p>
            </div>

            {/* Recommended guidelines */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Institutional Guidelines</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Standard semester leave allocation: 90 - 105 periods</li>
                <li>Standard OD allowance limit: 56 - 70 periods</li>
                <li>Ensure sufficient buffer for exam preparation & medical emergencies</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Semester Policy</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
