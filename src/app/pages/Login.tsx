import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp, UserRole } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { 
  GraduationCap, 
  Lock, 
  UserCheck, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  User, 
  KeyRound, 
  ArrowRight, 
  UserCog, 
  ArrowLeft, 
  Mail 
} from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function Login() {
  const [registerNumber, setRegisterNumber] = useState("20CS001");
  const [password, setPassword] = useState("password123");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const { setUserRole, setCurrentUser } = useApp();
  const navigate = useNavigate();

  // Mode & forgot password states
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [forgotName, setForgotName] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotRegNumber, setForgotRegNumber] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrReg: registerNumber,
          password: password,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUserRole(data.role);

        if (data.role === "student") {
          const profile = data.studentProfile || {};
          const mappedStudent = {
            id: data._id,
            name: data.name,
            registerNumber: profile.registerNumber || "",
            email: data.email,
            totalLeave: profile.totalLeaveQuota ?? 15,
            usedLeave: profile.usedLeaveQuota ?? 0,
            totalOD: profile.totalODQuota ?? 10,
            usedOD: profile.usedODQuota ?? 0,
          };
          setCurrentUser(mappedStudent);
          navigate("/student");
        } else if (data.role === "mentor") {
          navigate("/mentor");
        } else if (data.role === "hod") {
          navigate("/hod");
        } else {
          navigate("/admin");
        }
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Failed to connect to backend server");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (forgotNewPassword !== forgotConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
          name: forgotName,
          email: forgotEmail,
          registerNumber: selectedRole === "student" ? forgotRegNumber : undefined,
          newPassword: forgotNewPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Password reset successfully!");
        setForgotName("");
        setForgotEmail("");
        setForgotRegNumber("");
        setForgotNewPassword("");
        setForgotConfirmPassword("");
        setMode("login");
      } else {
        toast.error(data.message || "Reset failed. Verify details.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error("Failed to connect to backend server");
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "student") {
      setRegisterNumber("20CS001");
      setForgotRegNumber("20CS001");
    } else if (role === "mentor") {
      setRegisterNumber("mentor@college.edu");
      setForgotEmail("mentor@college.edu");
    } else if (role === "hod") {
      setRegisterNumber("hod@college.edu");
      setForgotEmail("hod@college.edu");
    } else {
      setRegisterNumber("admin@college.edu");
      setForgotEmail("admin@college.edu");
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-5 h-5" />;
      case "mentor":
        return <UserCheck className="w-5 h-5" />;
      case "hod":
        return <UserCog className="w-5 h-5" />;
      case "admin":
        return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 flex items-center justify-center font-sans overflow-hidden p-4 sm:p-6">
      {/* Subtle decorative grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Glowing background blurs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Centered Login Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-7 animate-fade-in">
        {/* Header Logo */}
        <div className="flex items-center gap-3 justify-center mb-2">
          <div className="w-11 h-11 bg-indigo-650 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-650/30">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight text-white">LeavePortal</h1>
            <p className="text-xs text-indigo-300 font-medium">Smart Leave & OD Management</p>
          </div>
        </div>

        {mode === "login" ? (
          <>
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-slate-400">
                Select your portal role and enter credentials to continue.
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
                Select Portal Access Role
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/85">
                {(["student", "mentor", "hod", "admin"] as UserRole[]).map((role) => {
                  const isSelected = selectedRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-[11px] font-bold capitalize transition-all ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      {getRoleIcon(role)}
                      <span>{role}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="registerNumber" className="text-xs font-bold text-slate-300">
                  {selectedRole === "student" ? "Register Number / Email" : "Staff Email Address"}
                </Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="registerNumber"
                    type="text"
                    placeholder={selectedRole === "student" ? "e.g., 20CS001" : "e.g., mentor@college.edu"}
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-xl focus:bg-slate-950 focus:border-indigo-500 focus:ring-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-300">
                    Password
                  </Label>
                  <span 
                    onClick={() => {
                      setMode("forgot");
                      if (selectedRole === "student") {
                        setForgotRegNumber(registerNumber);
                      } else {
                        setForgotEmail(registerNumber);
                      }
                    }}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
                  >
                    Forgot?
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-xl focus:bg-slate-950 focus:border-indigo-500 focus:ring-0"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-650/15 transition-all flex items-center justify-center gap-2 group cursor-pointer border-0"
              >
                <span>Sign In to {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </form>

            {/* Credentials Quick Access Banner */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <Lock className="w-3.5 h-3.5 text-indigo-400" /> Quick Access Credentials
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Click any role tab above to pre-fill test credentials.
                <br />
                <span className="text-slate-500 font-mono text-[10px] mt-1 block">Student: 20CS001 • Mentor: mentor@college.edu • HOD: hod@college.edu • Admin: admin@college.edu</span>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs text-slate-400">
                Provide registered details below to reset password.
              </p>
            </div>

            {/* Role indicator or selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
                Role: <span className="text-indigo-400 capitalize">{selectedRole}</span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/85">
                {(["student", "mentor", "hod", "admin"] as UserRole[]).map((role) => {
                  const isSelected = selectedRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-[11px] font-bold capitalize transition-all ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      {getRoleIcon(role)}
                      <span>{role}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Forgot Password Form */}
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="forgotName" className="text-xs font-bold text-slate-300">
                  Full Name (as registered)
                </Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="forgotName"
                    type="text"
                    placeholder="e.g., Rahul Kumar"
                    value={forgotName}
                    onChange={(e) => setForgotName(e.target.value)}
                    className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-xl focus:bg-slate-950 focus:border-indigo-500 focus:ring-0"
                    required
                  />
                </div>
              </div>

              {selectedRole === "student" && (
                <div className="space-y-1.5">
                  <Label htmlFor="forgotRegNumber" className="text-xs font-bold text-slate-300">
                    Register Number
                  </Label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="forgotRegNumber"
                      type="text"
                      placeholder="e.g., 20CS001"
                      value={forgotRegNumber}
                      onChange={(e) => setForgotRegNumber(e.target.value)}
                      className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-xl focus:bg-slate-950 focus:border-indigo-500 focus:ring-0"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="forgotEmail" className="text-xs font-bold text-slate-300">
                  Registered Email Address
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="forgotEmail"
                    type="email"
                    placeholder="e.g., rahul.kumar@college.edu"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-xl focus:bg-slate-950 focus:border-indigo-500 focus:ring-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="forgotNewPassword" className="text-xs font-bold text-slate-300">
                  New Password
                </Label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="forgotNewPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-xl focus:bg-slate-950 focus:border-indigo-500 focus:ring-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="forgotConfirmPassword" className="text-xs font-bold text-slate-300">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="forgotConfirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-xl focus:bg-slate-950 focus:border-indigo-500 focus:ring-0"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-1/2 h-11 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-750 hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/15 transition-all flex items-center justify-center gap-2 group cursor-pointer border-0"
                >
                  <span>Reset Password</span>
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}