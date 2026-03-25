import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, CalendarCheck, FileText, LogOut,
  Clock, CheckCircle, XCircle, Plus,
  Mail, Building2, Briefcase, MapPin,
  Phone, UserCheck, Hash, Calendar
} from "lucide-react";
import io from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";

import API from "../services/api";
import AuthContext from "../context/AuthContext";

// --- SOCKET CONNECTION ---
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_URL.replace("/api", "");
const socket = io(SOCKET_URL);

function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);

  // Form State
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      // 1. Fetch Profile (Find current user details from employee list)
      const empRes = await API.get("/employees");
      const myProfile = empRes.data.find(e => e._id === user._id);
      setProfile(myProfile || user);

      // 2. Fetch Attendance
      const attRes = await API.get("/attendance");
      const myAttendance = attRes.data.filter(a => a.employeeId?._id === user._id || a.employeeId === user._id);
      setAttendance(myAttendance);

      // 3. Fetch Leaves
      const leaveRes = await API.get("/leaves");
      const myLeaves = leaveRes.data.filter(l => l.employeeId?._id === user._id || l.employeeId === user._id);
      setLeaves(myLeaves);
      calculateBalance(myLeaves);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    }
  };

  const calculateBalance = (myLeaves) => {
    const types = ["Sick Leave", "Casual Leave", "Earned Leave"];
    const balance = types.map((type) => {
      const total = 12; // Yearly quota
      const used = myLeaves
        .filter((l) => l.leaveType === type && l.status === "Approved")
        .reduce((acc, curr) => acc + (curr.days || 1), 0);
      return { type, total, used, remaining: total - used };
    });
    setLeaveBalance(balance);
  };

  // --- REAL-TIME UPDATES ---
  useEffect(() => {
    if (user) {
      fetchData();

      // Listen for status updates from HR
      socket.on('leave_status_updated', (updatedLeave) => {
        if (updatedLeave.employeeId === user._id || updatedLeave.employeeId?._id === user._id) {
          toast.success(`Leave ${updatedLeave.status}`);
          setLeaves(prev => {
            const newLeaves = prev.map(l => l._id === updatedLeave._id ? updatedLeave : l);
            calculateBalance(newLeaves);
            return newLeaves;
          });
        }
      });
    }
    return () => socket.off('leave_status_updated');
  }, [user]);

  // --- ACTIONS ---
  const handleLogout = () => { logout(); navigate("/login"); };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/leaves", leaveForm);
      setLeaves([data, ...leaves]);
      setShowLeaveForm(false);
      setLeaveForm({ leaveType: "Sick Leave", startDate: "", endDate: "", reason: "" });
      toast.success("Leave request sent");
    } catch {
      toast.error("Failed to apply");
    }
  };

  // --- HELPERS ---
  const getInitials = (name) => name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  const StatusBadge = ({ status }) => {
    const styles = {
      Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Present: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Absent: "bg-red-500/10 text-red-400 border-red-500/20",
      Late: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      "Half Day": "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-slate-800 text-slate-400"}`}>
        {status}
      </span>
    );
  };

  // ... existing states
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [attForm, setAttForm] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });

  // ... existing useEffects

  // Add this Handler
  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      // Send user._id as employeeId because backend expects it
      const payload = { ...attForm, employeeId: user._id };
      const { data } = await API.post('/attendance', payload);

      setAttendance([data, ...attendance]); // Update list
      setShowAttendanceForm(false);
      toast.success("Attendance Marked Successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  if (!user || !profile) return null;

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      <Toaster position="top-right" />

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col z-20">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">HRMS</span>
            <span className="text-slate-500 font-light">Lite</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { key: "profile", label: "My Profile", icon: User },
            { key: "attendance", label: "My Attendance", icon: CalendarCheck },
            { key: "leaves", label: "Leave Requests", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.key
                ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
            >
              <tab.icon size={18} />
              <span className="hidden md:block">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition"
          >
            <LogOut size={18} />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 p-8 overflow-auto h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >

            {/* --- PROFILE TAB --- */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Header Card */}
                <div className="p-8 rounded-2xl bg-[#0f172a] border border-slate-800">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                      {getInitials(profile.fullName)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{profile.fullName}</h2>
                      <p className="text-slate-400 mt-1">{profile.designation}</p>
                      <div className="mt-3"><StatusBadge status="Active" /></div>
                    </div>
                  </div>
                </div>

                {/* Details Grid (Matching Screenshot 1) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {[
                    { icon: Mail, label: "Email", value: profile.email },
                    { icon: Phone, label: "Phone", value: profile.phoneNumber || "+91 98765 43210" },
                    { icon: Building2, label: "Department", value: profile.department },
                    { icon: Briefcase, label: "Role", value: profile.designation },
                    { icon: MapPin, label: "Location", value: profile.location || "Mumbai, India" },
                    { icon: Calendar, label: "Joined", value: new Date(profile.joinedDate).toLocaleDateString() },
                    { icon: UserCheck, label: "Reporting Manager", value: profile.reportingManager || "Rajesh Kumar" },
                    { icon: Hash, label: "Employee ID", value: profile.employeeId },
                  ].map((item, i) => (
                    <div key={i} className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                        <item.icon size={20} color="#5E76ED" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-slate-500 uppercase font-bold">{item.label}</p>
                        <p className="text-slate-200 font-medium truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- ATTENDANCE TAB --- */}
            {activeTab === "attendance" && (
              <div className="space-y-6">
                {/* Summary Cards (Screenshot 2) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Present", value: attendance.filter(a => a.status === "Present").length, icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10" },
                    { label: "Late", value: attendance.filter(a => a.status === "Late").length, icon: Clock, color: "text-amber-400 bg-amber-500/10" },
                    { label: "Absent", value: attendance.filter(a => a.status === "Absent").length, icon: XCircle, color: "text-red-400 bg-red-500/10" },
                    { label: "Half Day", value: attendance.filter(a => a.status === "Half Day").length, icon: CalendarCheck, color: "text-blue-400 bg-blue-500/10" },
                  ].map((card, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                        <card.icon size={24} />
                      </div>
                      <p className="text-3xl font-bold text-white">{card.value}</p>
                      <p className="text-slate-500 text-sm mt-1">{card.label}</p>
                    </div>
                  ))}
                </div>

                {/* --- NEW: ACTION HEADER --- */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-100">Attendance History</h3>
                  <button
                    onClick={() => setShowAttendanceForm(!showAttendanceForm)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md shadow-emerald-900/20"
                  >
                    {showAttendanceForm ? <XCircle size={18} /> : <Clock size={18} />}
                    {showAttendanceForm ? "Cancel" : "Mark Attendance"}
                  </button>
                </div>

                {/* --- NEW: MARK ATTENDANCE FORM --- */}
                <AnimatePresence>
                  {showAttendanceForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <form onSubmit={handleMarkAttendance} className="bg-[#0f172a] border border-slate-800 p-6 rounded-xl space-y-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                            <input type="date" required className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" value={attForm.date} onChange={e => setAttForm({ ...attForm, date: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                            <select className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" value={attForm.status} onChange={e => setAttForm({ ...attForm, status: e.target.value })}>
                              <option>Present</option>
                              <option>Work From Home</option>
                              <option>Half-day</option>
                            </select>
                          </div>
                        </div>
                        <button className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-500 transition">Confirm Check-In</button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Attendance Table */}
                <div className="rounded-xl border border-slate-800 bg-[#0f172a] overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-medium">
                      <tr>
                        <th className="p-5">Date</th>
                        <th className="p-5">Check In</th>
                        <th className="p-5">Check Out</th>
                        <th className="p-5">Hours</th>
                        <th className="p-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {attendance.map((att) => (
                        <tr key={att._id} className="hover:bg-slate-800/50 transition">
                          <td className="p-5 font-medium text-white">{att.date}</td>
                          <td className="p-5 text-slate-400">{att.checkIn || '09:00 AM'}</td>
                          <td className="p-5 text-slate-400">{att.checkOut || '06:00 PM'}</td>
                          <td className="p-5 text-slate-400">{att.workHours || '9h 0m'}</td>
                          <td className="p-5"><StatusBadge status={att.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- LEAVES TAB --- */}
            {activeTab === "leaves" && (
              <div className="space-y-6">

                {/* Balance Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  {leaveBalance.map((lb) => {
                    const percent = (lb.remaining / lb.total) * 100;
                    return (
                      <div key={lb.type} className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 relative overflow-hidden">
                        <p className="text-sm text-slate-400 font-medium mb-4">{lb.type}</p>
                        <div className="flex justify-between items-end mb-4">
                          <p className="text-4xl font-bold text-white">{lb.remaining}</p>
                          <p className="text-sm text-slate-500">of {lb.total}</p>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <p className="text-xs text-slate-500">{lb.used} used</p>
                      </div>
                    );
                  })}
                </div>

                {/* Apply Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowLeaveForm(!showLeaveForm)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-900/20 font-medium flex items-center gap-2 transition"
                  >
                    <Plus size={18} /> Apply for Leave
                  </button>
                </div>

                {/* Apply Form */}
                <AnimatePresence>
                  {showLeaveForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <form onSubmit={handleApplyLeave} className="bg-[#0f172a] border border-slate-800 p-6 rounded-xl space-y-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                            <select className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" value={leaveForm.leaveType} onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}>
                              <option>Sick Leave</option>
                              <option>Casual Leave</option>
                              <option>Earned Leave</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">From</label>
                            <input type="date" required className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" value={leaveForm.startDate} onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">To</label>
                            <input type="date" required className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" value={leaveForm.endDate} onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })} />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Reason</label>
                          <input type="text" required placeholder="Brief reason..." className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} />
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-500 transition">Submit Request</button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Leave History Table (Screenshot 3) */}
                <div className="rounded-xl border border-slate-800 bg-[#0f172a] overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-medium">
                      <tr>
                        <th className="p-5">Type</th>
                        <th className="p-5">From</th>
                        <th className="p-5">To</th>
                        <th className="p-5">Days</th>
                        <th className="p-5">Reason</th>
                        <th className="p-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {leaves.length === 0 ? <tr><td colSpan="6" className="p-8 text-center text-slate-500">No requests found</td></tr> :
                        leaves.map((leave) => (
                          <tr key={leave._id} className="hover:bg-slate-800/50 transition">
                            <td className="p-5">
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {leave.leaveType}
                              </span>
                            </td>
                            <td className="p-5 text-slate-400">{new Date(leave.startDate).toLocaleDateString()}</td>
                            <td className="p-5 text-slate-400">{new Date(leave.endDate).toLocaleDateString()}</td>
                            <td className="p-5 text-slate-400">{leave.days || 1}</td>
                            <td className="p-5 text-slate-400 max-w-[200px] truncate">{leave.reason}</td>
                            <td className="p-5"><StatusBadge status={leave.status} /></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default EmployeeDashboard;