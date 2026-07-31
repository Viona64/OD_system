import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "student" | "mentor" | "admin" | "hod";

export type ApplicationType = "leave" | "od";

export type ApplicationStatus = "pending" | "mentor_approved" | "approved" | "rejected";

export interface Application {
  id: string;
  studentName: string;
  registerNumber: string;
  type: ApplicationType;
  date: string;
  reason: string;
  eventName?: string;
  status: ApplicationStatus;
  mentorComment?: string;
  hodComment?: string;
  proofUrl?: string;
  submittedDate: string;
  periodCount: number;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  registerNumber: string;
  email: string;
  totalLeave: number;
  usedLeave: number;
  totalOD: number;
  usedOD: number;
  mentorId?: string;
  mentorName?: string;
}

export interface LeavePolicy {
  maxLeavePerSemester: number;
  maxODPerSemester: number;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

interface AppContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  currentUser: Student | null;
  setCurrentUser: (user: Student | null) => void;
  applications: Application[];
  addApplication: (app: Omit<Application, "id" | "submittedDate" | "status">) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  leavePolicy: LeavePolicy;
  updateLeavePolicy: (policy: LeavePolicy) => void;
  notifications: Notification[];
  addNotification: (message: string) => void;
  markNotificationRead: (id: string) => void;
  mentors: Mentor[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Data mapper: MongoDB student user payload -> Frontend Student interface
const mapBackendStudentToFrontend = (backendUser: any): Student => {
  if (!backendUser) return {} as Student;
  const profile = backendUser.studentProfile || {};
  const mentor = profile.mentor || {};
  return {
    id: backendUser._id || backendUser.id,
    name: backendUser.name,
    registerNumber: profile.registerNumber || "",
    email: backendUser.email,
    totalLeave: profile.totalLeaveQuota ?? 15,
    usedLeave: profile.usedLeaveQuota ?? 0,
    totalOD: profile.totalODQuota ?? 10,
    usedOD: profile.usedODQuota ?? 0,
    mentorId: mentor._id || mentor.id || "",
    mentorName: mentor.name || "",
  };
};

// Data mapper: MongoDB student profile element (populated with user) -> Frontend Student list element
const mapBackendStudentProfileToFrontend = (s: any): Student => {
  const user = s.user || {};
  const mentor = s.mentor || {};
  return {
    id: s._id || s.id,
    name: user.name || "",
    registerNumber: s.registerNumber || "",
    email: user.email || "",
    totalLeave: s.totalLeaveQuota ?? 15,
    usedLeave: s.usedLeaveQuota ?? 0,
    totalOD: s.totalODQuota ?? 10,
    usedOD: s.usedODQuota ?? 0,
    mentorId: mentor._id || mentor.id || "",
    mentorName: mentor.name || "",
  };
};

// Data mapper: MongoDB application -> Frontend Application interface
const mapBackendApplicationToFrontend = (app: any): Application => {
  const studentUser = app.student || {};
  return {
    id: app._id || app.id,
    studentName: studentUser.name || "Student",
    registerNumber: app.registerNumber || "",
    type: app.type,
    date: app.startDate ? app.startDate.split("T")[0] : "",
    reason: app.reason,
    eventName: app.eventName || undefined,
    status: app.status,
    mentorComment: app.mentorComment || undefined,
    hodComment: app.hodComment || undefined,
    proofUrl: app.proofUrl || undefined,
    submittedDate: app.submittedDate ? app.submittedDate.split("T")[0] : "",
    periodCount: app.periodCount ?? 1,
  };
};

// Data mapper: MongoDB notification -> Frontend Notification interface
const mapBackendNotificationToFrontend = (n: any): Notification => {
  return {
    id: n._id || n.id,
    message: n.message,
    date: n.createdAt ? n.createdAt.split("T")[0] : "",
    read: n.isRead,
  };
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [leavePolicy, setLeavePolicy] = useState<LeavePolicy>({
    maxLeavePerSemester: 15,
    maxODPerSemester: 10,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load current user profile from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
          if (data.role === "student") {
            setCurrentUser(mapBackendStudentToFrontend(data));
          } else {
            setCurrentUser(null);
          }
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Failed to load user profile on mount", error);
      }
    };
    loadUser();
  }, []);

  // Fetch contextual dashboard data when user role changes
  useEffect(() => {
    const fetchData = async () => {
      if (!userRole) return;
      try {
        // Fetch applications
        const appsRes = await fetch(`${API_URL}/applications`, {
          headers: getAuthHeaders(),
        });
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setApplications(appsData.map(mapBackendApplicationToFrontend));
        }

        // Fetch notifications
        const notifsRes = await fetch(`${API_URL}/notifications`, {
          headers: getAuthHeaders(),
        });
        if (notifsRes.ok) {
          const notifsData = await notifsRes.json();
          setNotifications(notifsData.map(mapBackendNotificationToFrontend));
        }

        // Fetch leave policy
        const policyRes = await fetch(`${API_URL}/policies`, {
          headers: getAuthHeaders(),
        });
        if (policyRes.ok) {
          const policyData = await policyRes.json();
          setLeavePolicy({
            maxLeavePerSemester: policyData.maxLeavePerSemester,
            maxODPerSemester: policyData.maxODPerSemester,
          });
        }

        // Fetch student list if admin, hod, or mentor
        if (["admin", "hod", "mentor"].includes(userRole)) {
          const studentsRes = await fetch(`${API_URL}/students`, {
            headers: getAuthHeaders(),
          });
          if (studentsRes.ok) {
            const studentsData = await studentsRes.json();
            setStudents(studentsData.map(mapBackendStudentProfileToFrontend));
          }
        }

        // Fetch mentors list if admin or hod
        if (["admin", "hod"].includes(userRole)) {
          const mentorsRes = await fetch(`${API_URL}/students/mentors`, {
            headers: getAuthHeaders(),
          });
          if (mentorsRes.ok) {
            const mentorsData = await mentorsRes.json();
            setMentors(mentorsData.map((m: any) => ({
              id: m._id || m.id,
              name: m.name,
              email: m.email,
            })));
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchData();
  }, [userRole]);

  const handleSetUserRole = (role: UserRole | null) => {
    setUserRole(role);
    if (role === null) {
      localStorage.removeItem("token");
      setCurrentUser(null);
      setApplications([]);
      setNotifications([]);
      setStudents([]);
      setMentors([]);
    }
  };

  const addApplication = async (app: Omit<Application, "id" | "submittedDate" | "status">) => {
    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          type: app.type,
          startDate: app.date,
          endDate: app.date,
          reason: app.reason,
          eventName: app.eventName,
          proofUrl: app.proofUrl,
          periodCount: app.periodCount,
        }),
      });

      if (response.ok) {
        const newApp = await response.json();
        setApplications((prev) => [mapBackendApplicationToFrontend(newApp), ...prev]);

        // Refresh notifications
        const notifsRes = await fetch(`${API_URL}/notifications`, {
          headers: getAuthHeaders(),
        });
        if (notifsRes.ok) {
          const notifsData = await notifsRes.json();
          setNotifications(notifsData.map(mapBackendNotificationToFrontend));
        }
      } else {
        const err = await response.json();
        console.error("Failed to add application:", err.message);
      }
    } catch (error) {
      console.error("Failed to add application", error);
    }
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    try {
      let url = "";
      let body: any = {};

      if (updates.status === "mentor_approved" || (updates.status === "rejected" && updates.mentorComment !== undefined)) {
        url = `${API_URL}/applications/${id}/mentor-review`;
        body = {
          status: updates.status === "mentor_approved" ? "approved" : "rejected",
          comment: updates.mentorComment,
        };
      } else if (updates.status === "approved" || (updates.status === "rejected" && updates.hodComment !== undefined)) {
        url = `${API_URL}/applications/${id}/hod-review`;
        body = {
          status: updates.status === "approved" ? "approved" : "rejected",
          comment: updates.hodComment,
        };
      } else {
        console.warn("Unsupported updates format", updates);
        return;
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const updated = await response.json();
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? mapBackendApplicationToFrontend(updated) : app))
        );

        // Refresh notifications
        const notifsRes = await fetch(`${API_URL}/notifications`, {
          headers: getAuthHeaders(),
        });
        if (notifsRes.ok) {
          const notifsData = await notifsRes.json();
          setNotifications(notifsData.map(mapBackendNotificationToFrontend));
        }

        // Reload user profiles or student lists to reflect updated leave quotas
        if (userRole === "student") {
          const meRes = await fetch(`${API_URL}/auth/me`, {
            headers: getAuthHeaders(),
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            setCurrentUser(mapBackendStudentToFrontend(meData));
          }
        } else if (["admin", "hod", "mentor"].includes(userRole || "")) {
          const studentsRes = await fetch(`${API_URL}/students`, {
            headers: getAuthHeaders(),
          });
          if (studentsRes.ok) {
            const studentsData = await studentsRes.json();
            setStudents(studentsData.map(mapBackendStudentProfileToFrontend));
          }
        }
      }
    } catch (error) {
      console.error("Failed to update application", error);
    }
  };

  const addStudent = async (student: Student) => {
    try {
      const response = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: student.name,
          registerNumber: student.registerNumber,
          email: student.email,
          mentorId: student.mentorId,
          academicYear: 2026,
          semester: 6,
        }),
      });

      if (response.ok) {
        const newStudent = await response.json();
        setStudents((prev) => [...prev, mapBackendStudentProfileToFrontend(newStudent)]);
      }
    } catch (error) {
      console.error("Failed to add student", error);
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: updates.name,
          email: updates.email,
          mentorId: updates.mentorId,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? mapBackendStudentProfileToFrontend(updated) : s))
        );
      }
    } catch (error) {
      console.error("Failed to update student", error);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete student", error);
    }
  };

  const updateLeavePolicy = async (policy: LeavePolicy) => {
    try {
      const response = await fetch(`${API_URL}/policies`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          maxLeavePerSemester: policy.maxLeavePerSemester,
          maxODPerSemester: policy.maxODPerSemester,
          academicYear: 2026,
          semester: 6,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLeavePolicy({
          maxLeavePerSemester: data.maxLeavePerSemester,
          maxODPerSemester: data.maxODPerSemester,
        });
      }
    } catch (error) {
      console.error("Failed to update leave policy", error);
    }
  };

  // Triggered client-side notifications (mock helper/no-op)
  const addNotification = (message: string) => {
    console.log("Auto-generated backend notification event:", message);
  };

  const markNotificationRead = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error("Failed to mark notification read", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole: handleSetUserRole,
        currentUser,
        setCurrentUser,
        applications,
        addApplication,
        updateApplication,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        leavePolicy,
        updateLeavePolicy,
        notifications,
        addNotification,
        markNotificationRead,
        mentors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
