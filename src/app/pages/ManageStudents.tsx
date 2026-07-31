import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Plus, Edit, Trash2, Search, Users, UserPlus } from "lucide-react";
import { toast } from "sonner";

export function ManageStudents() {
  const { students, addStudent, updateStudent, deleteStudent, leavePolicy, mentors } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    registerNumber: "",
    email: "",
    mentorId: "",
  });

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();

    const newStudent = {
      id: (Date.now()).toString(),
      ...formData,
      totalLeave: leavePolicy.maxLeavePerSemester,
      usedLeave: 0,
      totalOD: leavePolicy.maxODPerSemester,
      usedOD: 0,
    };

    addStudent(newStudent);
    toast.success(`Student "${formData.name}" added successfully!`);
    setIsAddDialogOpen(false);
    setFormData({ name: "", registerNumber: "", email: "", mentorId: "" });
  };

  const handleEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    updateStudent(selectedStudentId, formData);
    toast.success("Student details updated!");
    setIsEditDialogOpen(false);
    setSelectedStudentId(null);
    setFormData({ name: "", registerNumber: "", email: "", mentorId: "" });
  };

  const confirmDeleteStudent = () => {
    if (deleteTargetId) {
      deleteStudent(deleteTargetId);
      toast.success("Student record deleted successfully!");
      setDeleteTargetId(null);
    }
  };

  const openEditDialog = (student: any) => {
    setSelectedStudentId(student.id);
    setFormData({
      name: student.name,
      registerNumber: student.registerNumber,
      email: student.email,
      mentorId: student.mentorId || "",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6 pb-8 font-sans">
      <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Manage Students</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Add new enrollments, modify details, or remove student profiles
                </CardDescription>
              </div>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (open) {
                setFormData({ name: "", registerNumber: "", email: "", mentorId: "" });
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl h-9 px-4">
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Add New Student
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-slate-900">Add New Student</DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Register a student for the active leave portal semester.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStudent} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-slate-700">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Rahul Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-10 rounded-xl bg-slate-50 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="registerNumber" className="text-xs font-bold text-slate-700">Register Number</Label>
                    <Input
                      id="registerNumber"
                      placeholder="e.g. 20CS004"
                      value={formData.registerNumber}
                      onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                      className="h-10 rounded-xl bg-slate-50 text-xs font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="rahul@college.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-10 rounded-xl bg-slate-50 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="mentor" className="text-xs font-bold text-slate-700">Assign Mentor</Label>
                    <select
                      id="mentor"
                      value={formData.mentorId}
                      onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
                      className="h-10 rounded-xl bg-slate-50 border border-slate-200 text-xs w-full px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">-- Select Mentor --</option>
                      {mentors.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-xs text-white">
                      Create Student Record
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search student by name, reg number, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 bg-slate-50 border-slate-200 rounded-xl text-xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-semibold text-slate-700">No students found</p>
              <p className="text-xs text-slate-400">Try refining your search keyword or add a new student.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-200">
                    <TableHead className="text-xs font-bold text-slate-600 uppercase">Student Name</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600 uppercase">Reg Number</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600 uppercase">Email</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600 uppercase">Mentor</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600 uppercase">Leave Usage</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600 uppercase">OD Usage</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600 uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-bold text-xs text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {student.name.charAt(0)}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-slate-700">
                        {student.registerNumber}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{student.email}</TableCell>
                      <TableCell className="text-xs text-slate-600 font-medium">
                        {student.mentorName || <span className="text-slate-400 italic">Unassigned</span>}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-700">
                        {student.usedLeave} / {leavePolicy.maxLeavePerSemester}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-700">
                        {student.usedOD} / {leavePolicy.maxODPerSemester}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(student)}
                            className="h-8 w-8 p-0 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteTargetId(student.id)}
                            className="h-8 w-8 p-0 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border-slate-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Edit Student Info</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Update registered details for this student.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditStudent} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-xs font-bold text-slate-700">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-10 rounded-xl bg-slate-50 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-registerNumber" className="text-xs font-bold text-slate-700">Register Number</Label>
              <Input
                id="edit-registerNumber"
                value={formData.registerNumber}
                onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                className="h-10 rounded-xl bg-slate-50 text-xs font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email" className="text-xs font-bold text-slate-700">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-10 rounded-xl bg-slate-50 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-mentor" className="text-xs font-bold text-slate-700">Re-assign Mentor</Label>
              <select
                id="edit-mentor"
                value={formData.mentorId}
                onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
                className="h-10 rounded-xl bg-slate-50 border border-slate-200 text-xs w-full px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">-- Select Mentor --</option>
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-xs text-white">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-slate-900">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove this student record from the portal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl h-10 text-xs font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteStudent}
              className="rounded-xl h-10 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs"
            >
              Delete Student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
