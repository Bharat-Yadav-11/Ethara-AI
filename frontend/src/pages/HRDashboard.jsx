import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CalendarCheck, FileText, LogOut, Search,
  CheckCircle, XCircle, Clock, MoreHorizontal,
  LayoutDashboard, UserPlus, Trash2, Calendar
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import io from 'socket.io-client';

import API from '../services/api';
import AuthContext from '../context/AuthContext';

// --- SOCKET CONNECTION ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');
const socket = io(SOCKET_URL);

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('employees');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Data States
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    department: '',
    designation: '',
    joinedDate: '',
    status: 'Active'
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const [empRes, attRes, leaveRes] = await Promise.all([
        API.get('/employees'),
        API.get('/attendance'),
        API.get('/leaves')
      ]);
      setEmployees(empRes.data);
      setAttendance(attRes.data);
      setLeaves(leaveRes.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  // --- REAL-TIME LISTENERS ---
  useEffect(() => {
    if (user) {
      fetchData();

      // 1. New Leave Request
      socket.on('new_leave_request', (newLeave) => {
        toast.custom((t) => (
          <div className="bg-slate-800 text-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500 flex items-center gap-3">
            <FileText className="text-blue-500" />
            <div>
              <p className="font-bold">New Leave Request</p>
              <p className="text-xs text-gray-400">Review in Leaves tab</p>
            </div>
          </div>
        ));
        setLeaves((prev) => [newLeave, ...prev]);
      });

      // 2. New Attendance
      socket.on('new_attendance', (newRecord) => {
        setAttendance((prev) => [newRecord, ...prev]);
      });
    }

    return () => {
      socket.off('new_leave_request');
      socket.off('new_attendance');
    };
  }, [user]);

  // --- CALCULATE STATS ---
  const totalEmployees = employees.length;
  const presentToday = attendance.filter(a => a.status === 'Present').length;
  const employeesOnLeave = employees.filter(e => e.status === 'On Leave').length;
  const pendingRequests = leaves.filter(l => l.status === 'Pending').length;

  // --- ACTIONS ---
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      // Ensure joinedDate defaults to today if empty
      const payload = {
        ...newEmployee,
        joinedDate: newEmployee.joinedDate || new Date().toISOString()
      };

      const { data } = await API.post('/employees', payload);

      toast.success('Employee Added Successfully');
      setIsFormOpen(false);
      setEmployees([data, ...employees]); // Optimistic Update
      setNewEmployee({ employeeId: '', fullName: '', email: '', department: '', designation: '', joinedDate: '', status: 'Active' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await API.delete(`/employees/${id}`);
      setEmployees(employees.filter(e => e._id !== id));
      toast.success("Employee Deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleLeaveAction = async (id, status) => {
    try {
      const { data } = await API.put(`/leaves/${id}`, { status });
      setLeaves(leaves.map(l => l._id === id ? data : l));
      toast.success(`Leave ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // --- HELPERS ---
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const filteredEmployees = employees.filter(e =>
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const StatusBadge = ({ status }) => {
    const styles = {
      Active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      'On Leave': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      Inactive: 'bg-red-500/10 text-red-500 border-red-500/20',
      Present: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      Absent: 'bg-red-500/10 text-red-500 border-red-500/20',
      Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      Approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      Rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    const style = styles[status] || 'bg-slate-800 text-slate-400 border-slate-700';
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
        {status}
      </span>
    );
  };

  // State for the Attendance Modal
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attForm, setAttForm] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });

  // Logic to Open Modal
  const openAttendanceModal = (employee) => {
    setSelectedEmployee(employee);
    setAttForm({ date: new Date().toISOString().split('T')[0], status: 'Present' });
  };

  // Logic to Submit
  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    try {
      const payload = { ...attForm, employeeId: selectedEmployee._id };
      const { data } = await API.post('/attendance', payload);

      setAttendance([data, ...attendance]); // Update local state
      toast.success("Attendance Marked");
      setSelectedEmployee(null); // Close modal
    } catch (error) {
      toast.error("Failed to mark attendance");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500 selection:text-white">
      <Toaster position="top-right" />

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-20 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            HRMS Lite
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'employees', label: 'Employees', icon: Users },
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'leaves', label: 'Leaves', icon: FileText },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === item.id
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 p-8">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-slate-400 text-sm">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">AD</div>
          </div>
        </header>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Employees', value: totalEmployees, icon: Users, color: 'from-blue-500 to-blue-600' },
            { label: 'Present Today', value: presentToday, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
            { label: 'On Leave', value: employeesOnLeave, icon: Clock, color: 'from-amber-500 to-amber-600' },
            { label: 'Pending Leaves', value: pendingRequests, icon: FileText, color: 'from-purple-500 to-purple-600' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white`}>
                  <card.icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="bg-slate-900 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64 text-white"
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>

          {activeTab === 'employees' && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
            >
              <UserPlus size={18} /> Add Employee
            </button>
          )}
        </div>

        {/* CONTENT AREA */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">

            {/* --- EMPLOYEES TABLE --- */}
            {activeTab === 'employees' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="p-5 font-medium">Employee</th>
                      <th className="p-5 font-medium">Department</th>
                      <th className="p-5 font-medium">Role</th>
                      <th className="p-5 font-medium">Joined</th>
                      <th className="p-5 font-medium">Status</th>
                      <th className="p-5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp._id} className="hover:bg-slate-800/50 transition">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                              {getInitials(emp.fullName)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-200">{emp.fullName}</p>
                              <p className="text-xs text-slate-500">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-slate-400">{emp.department}</td>
                        <td className="p-5 text-slate-400">{emp.designation || 'Staff'}</td>
                        <td className="p-5 text-slate-400">
                          {emp.joinedDate ? new Date(emp.joinedDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-5">
                          <StatusBadge status={emp.status} />
                        </td>
                        <td className="p-5 text-right flex justify-end gap-2">
                          {/* THIS IS THE MISSING BUTTON CONNECTION */}
                          <button
                            onClick={() => openAttendanceModal(emp)}
                            className="text-slate-400 hover:text-emerald-500 p-2 rounded-full hover:bg-slate-800 transition"
                            title="Mark Attendance"
                          >
                            <CalendarCheck size={18} />
                          </button>

                          <button onClick={() => handleDeleteEmployee(emp._id)} className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-slate-800 transition">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* --- ATTENDANCE TABLE --- */}
            {activeTab === 'attendance' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="p-5 font-medium">Employee</th>
                      <th className="p-5 font-medium">Date</th>
                      <th className="p-5 font-medium">Status</th>
                      <th className="p-5 font-medium">Check In</th>
                      <th className="p-5 font-medium">Check Out</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {attendance.map(att => (
                      <tr key={att._id} className="hover:bg-slate-800/50 transition">
                        <td className="p-5 font-medium text-slate-200">{att.employeeId?.fullName}</td>
                        <td className="p-5 text-slate-400">{att.date}</td>
                        <td className="p-5"><StatusBadge status={att.status} /></td>
                        <td className="p-5 text-slate-400">{att.checkIn || '09:00 AM'}</td>
                        <td className="p-5 text-slate-400">{att.checkOut || '06:00 PM'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* --- LEAVES TABLE --- */}
            {activeTab === 'leaves' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="p-5 font-medium">Employee</th>
                      <th className="p-5 font-medium">Type</th>
                      <th className="p-5 font-medium">Date</th>
                      <th className="p-5 font-medium">Days</th>
                      <th className="p-5 font-medium">Status</th>
                      <th className="p-5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {leaves.map(l => (
                      <tr key={l._id} className="hover:bg-slate-800/50 transition">
                        <td className="p-5 font-medium text-slate-200">{l.employeeId?.fullName}</td>
                        <td className="p-5 text-slate-400">{l.leaveType}</td>
                        <td className="p-5 text-slate-400 text-xs">
                          {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-5 text-slate-400">{l.days || 1}</td>
                        <td className="p-5"><StatusBadge status={l.status} /></td>
                        <td className="p-5 text-right">
                          {l.status === 'Pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleLeaveAction(l._id, 'Approved')} className="text-emerald-500 hover:bg-emerald-500/10 p-1 rounded transition"><CheckCircle size={18} /></button>
                              <button onClick={() => handleLeaveAction(l._id, 'Rejected')} className="text-red-500 hover:bg-red-500/10 p-1 rounded transition"><XCircle size={18} /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* MODAL: ADD EMPLOYEE (MATCHING NEW SCHEMA) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Add Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Employee ID</label>
                  <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white focus:outline-none focus:border-blue-500" placeholder="e.g. EMP001" value={newEmployee.employeeId} onChange={e => setNewEmployee({ ...newEmployee, employeeId: e.target.value })} required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Role / Designation</label>
                  <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Developer" value={newEmployee.designation} onChange={e => setNewEmployee({ ...newEmployee, designation: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white focus:outline-none focus:border-blue-500" placeholder="John Doe" value={newEmployee.fullName} onChange={e => setNewEmployee({ ...newEmployee, fullName: e.target.value })} required />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Email</label>
                <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white focus:outline-none focus:border-blue-500" placeholder="john@company.com" value={newEmployee.email} onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Department</label>
                  <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Engineering" value={newEmployee.department} onChange={e => setNewEmployee({ ...newEmployee, department: e.target.value })} required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Status</label>
                  <select className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white focus:outline-none focus:border-blue-500" value={newEmployee.status} onChange={e => setNewEmployee({ ...newEmployee, status: e.target.value })}>
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Joined Date</label>
                <input type="date" className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white focus:outline-none focus:border-blue-500" value={newEmployee.joinedDate} onChange={e => setNewEmployee({ ...newEmployee, joinedDate: e.target.value })} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg font-medium transition">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MARK ATTENDANCE MODAL (ADMIN) --- */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Mark Attendance</h2>
              <button onClick={() => setSelectedEmployee(null)} className="text-slate-400 hover:text-white"><XCircle size={24} /></button>
            </div>

            <div className="mb-4 p-3 bg-slate-800 rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {getInitials(selectedEmployee.fullName)}
              </div>
              <div>
                <p className="font-bold text-white">{selectedEmployee.fullName}</p>
                <p className="text-xs text-slate-400">{selectedEmployee.employeeId}</p>
              </div>
            </div>

            <form onSubmit={handleMarkAttendance} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Date</label>
                <input type="date" className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white focus:border-blue-500 outline-none" value={attForm.date} onChange={e => setAttForm({ ...attForm, date: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Status</label>
                <select className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white focus:border-blue-500 outline-none" value={attForm.status} onChange={e => setAttForm({ ...attForm, status: e.target.value })}>
                  <option>Present</option>
                  <option>Absent</option>
                  <option>Late</option>
                  <option>Half-day</option>
                </select>
              </div>
              <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition">Submit</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HRDashboard;