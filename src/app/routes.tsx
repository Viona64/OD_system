import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { StudentDashboard } from "./pages/StudentDashboard";
import { ApplyLeave } from "./pages/ApplyLeave";
import { ApplyOD } from "./pages/ApplyOD";
import { ApplicationHistory } from "./pages/ApplicationHistory";
import { UploadProof } from "./pages/UploadProof";
import { MentorDashboard } from "./pages/MentorDashboard";
import { MentorApproval } from "./pages/MentorApproval";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ManageStudents } from "./pages/ManageStudents";
import { LeavePolicySettings } from "./pages/LeavePolicySettings";
import { Notifications } from "./pages/Notifications";
import { DashboardLayout } from "./components/DashboardLayout";
import { HodDashboard } from "./pages/HodDashboard";
import { HodApproval } from "./pages/HodApproval";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/student",
    Component: DashboardLayout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "apply-leave", Component: ApplyLeave },
      { path: "apply-od", Component: ApplyOD },
      { path: "history", Component: ApplicationHistory },
      { path: "upload-proof/:id", Component: UploadProof },
      { path: "notifications", Component: Notifications },
    ],
  },
  {
    path: "/mentor",
    Component: DashboardLayout,
    children: [
      { index: true, Component: MentorDashboard },
      { path: "approval/:id", Component: MentorApproval },
      { path: "notifications", Component: Notifications },
    ],
  },
  {
    path: "/hod",
    Component: DashboardLayout,
    children: [
      { index: true, Component: HodDashboard },
      { path: "approval/:id", Component: HodApproval },
      { path: "notifications", Component: Notifications },
    ],
  },
  {
    path: "/admin",
    Component: DashboardLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "students", Component: ManageStudents },
      { path: "policy", Component: LeavePolicySettings },
      { path: "notifications", Component: Notifications },
    ],
  },
]);
