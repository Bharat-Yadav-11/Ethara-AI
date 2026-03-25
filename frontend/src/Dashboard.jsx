import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from './api';
import {
  Trash2, UserPlus, Calendar, X, Users,
  LayoutDashboard, Search, FileDown, LogOut,
  Clock, CheckCircle, XCircle
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('employees'); // 'employees', 'leaves', 'attendance'

  // --- ATTENDANCE STATE ---
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]); // For Global Monitor
  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });

  // --- LEAVE STATE (MOCKED FOR UI DEMO) ---
  const [leaves, setLeaves] = useState([
    { id: 1, name: 'Alice Johnson', type: 'Sick Leave', date: '2024-03-10', status: 'Pending' },
    { id: 2, name: 'Bob Smith', type: 'Casual Leave', date: '2024-03-12', status: 'Approved' },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ employeeId: '', fullName: '', email: '', department: '' });

  // --- FETCH DATA ---
  const fetchEmployees = async () => {
    try {
      const { data } = await API.get('/employees');
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const fetchAllAttendance = async () => {
    try {
      const { data } = await API.get('/attendance');
      setAllAttendance(data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { 
    fetchEmployees(); 
    fetchAllAttendance();
  }, []);

  // --- ACTIONS ---
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await API.post('/employees', newEmployee);
      toast.success('Employee Added!');
      setNewEmployee({ employeeId: '', fullName: '', email: '', department: '' });
      setIsFormOpen(false);
      fetchEmployees();
    } catch (error) { toast.error('Error adding employee'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete employee?")) return;
    try {
      await API.delete(`/employees/${id}`);
      toast.success('Deleted');
      fetchEmployees();
    } catch (error) { toast.error('Error deleting'); }
  };

  const openAttendanceModal = async (employee) => {
    setSelectedEmployee(employee);
    try {
      const { data } = await API.get('/attendance');
      const history = data.filter(r => r.employeeId._id === employee._id || r.employeeId === employee._id);
      history.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAttendanceHistory(history);
    } catch (error) { toast.error("Could not load history"); }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    try {
      await API.post('/attendance', { employeeId: selectedEmployee._id, ...attendanceForm });
      toast.success('Saved');
      openAttendanceModal(selectedEmployee);
      fetchAllAttendance(); // Refresh global monitor
    } catch (error) { toast.error('Error marking attendance'); }
  };

  // --- LEAVE ACTIONS ---
  const handleLeaveAction = (id, status) => {
    const updatedLeaves = leaves.map(l => l.id === id ? { ...l, status } : l);
    setLeaves(updatedLeaves);
    toast.success(`Leave ${status}`);
  };

  // --- UI HELPERS ---
  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Toaster position="top-right" />

      {/* --- SIDEBAR (Glassmorphism) --- */}
      <aside className="w-20 md:w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20 transition-all duration-300">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl font-bold hidden md:block bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            HRMS Lite
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'employees', icon: Users, label: 'Employees' },
            { id: 'attendance', icon: Clock, label: 'Attendance Monitor' },
            { id: 'leaves', icon: Calendar, label: 'Leave Requests' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                activeTab === item.id 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'animate-pulse' : ''}/> 
              <span className="hidden md:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition">
            <LogOut size={20} /> <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        {/* Decorative background blob */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none"></div>

        {/* HEADER */}
        <header className="h-20 px-8 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'employees' && 'Overview'}
            {activeTab === 'attendance' && 'Global Attendance'}
            {activeTab === 'leaves' && 'Leave Management'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-700">Admin User</span>
              <span className="text-xs text-slate-500">Super Admin</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px]">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-purple-600">AD</div>
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT AREA */}
        <div className="flex-1 overflow-auto p-8 pt-2">
          
          <AnimatePresence mode="wait">
            
            {/* --- TAB: EMPLOYEES --- */}
            {activeTab === 'employees' && (
              <motion.div 
                key="employees"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                    <p className="text-blue-100 text-sm font-medium">Total Employees</p>
                    <h3 className="text-4xl font-bold mt-2">{employees.length}</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium">Departments</p>
                    <h3 className="text-4xl font-bold text-slate-800 mt-2">{[...new Set(employees.map(e => e.department))].length}</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center items-center cursor-pointer hover:border-blue-300 transition" onClick={() => setIsFormOpen(true)}>
                    <UserPlus className="text-blue-500 mb-2" size={32} />
                    <span className="font-semibold text-blue-600">Add New Employee</span>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1">
                       <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
                       <input 
                         type="text" 
                         placeholder="Search employees..." 
                         className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                         value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                       />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                          <th className="p-5">Employee</th>
                          <th className="p-5">ID</th>
                          <th className="p-5">Dept</th>
                          <th className="p-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredEmployees.map((emp) => (
                          <tr key={emp._id} className="hover:bg-slate-50 transition group">
                            <td className="p-5">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-white flex items-center justify-center font-bold text-xs shadow-md">
                                  {getInitials(emp.fullName)}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-800">{emp.fullName}</div>
                                  <div className="text-xs text-slate-500">{emp.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 font-mono text-sm text-slate-600">{emp.employeeId}</td>
                            <td className="p-5"><span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{emp.department}</span></td>
                            <td className="p-5 text-right">
                              <button onClick={() => openAttendanceModal(emp)} className="text-slate-400 hover:text-blue-600 mr-3 transition"><Calendar size={18}/></button>
                              <button onClick={() => handleDelete(emp._id)} className="text-slate-400 hover:text-red-500 transition"><Trash2 size={18}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- TAB: ATTENDANCE MONITOR (New Feature) --- */}
            {activeTab === 'attendance' && (
              <motion.div 
                key="attendance"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              >
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Clock className="text-blue-500"/> Recent Attendance Logs</h3>
                <div className="grid gap-4">
                  {allAttendance.slice(0, 10).map((record, idx) => ( // Show last 10
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                            {idx + 1}
                         </div>
                         <div>
                            <p className="font-bold text-slate-800">
                               {/* Handling populate if backend sends object, else simple ID */}
                               {record.employeeId?.fullName || "Employee " + record.employeeId}
                            </p>
                            <p className="text-xs text-slate-500">{record.date}</p>
                         </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {record.status}
                      </span>
                    </div>
                  ))}
                  {allAttendance.length === 0 && <p className="text-center text-slate-500">No logs found.</p>}
                </div>
              </motion.div>
            )}

            {/* --- TAB: LEAVE MANAGEMENT (New Feature) --- */}
            {activeTab === 'leaves' && (
              <motion.div 
                key="leaves"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2"><Calendar className="text-purple-500"/> Leave Requests</h3>
                  <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">2 Pending</span>
                </div>
                
                <div className="space-y-4">
                  {leaves.map((leave) => (
                    <div key={leave.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800">{leave.name}</h4>
                        <div className="flex gap-2 text-sm text-slate-500 mt-1">
                          <span>{leave.type}</span> • <span>{leave.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {leave.status}
                        </span>
                        {leave.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleLeaveAction(leave.id, 'Approved')} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-lg shadow-green-500/30"><CheckCircle size={18}/></button>
                            <button onClick={() => handleLeaveAction(leave.id, 'Rejected')} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-lg shadow-red-500/30"><XCircle size={18}/></button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* --- MODALS (Reusing your existing logic, styled up) --- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
           {/* ... (Keep your existing Add Form content here, just wrap in motion.div if you want) ... */}
           {/* For brevity, I assume you can paste the inner form logic here from previous code */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
                <div className="flex justify-between mb-6">
                    <h2 className="text-2xl font-bold">New Employee</h2>
                    <button onClick={() => setIsFormOpen(false)}><X/></button>
                </div>
                <form onSubmit={handleAddEmployee} className="space-y-4">
                    <input className="w-full p-3 border rounded-xl" placeholder="ID" value={newEmployee.employeeId} onChange={e=>setNewEmployee({...newEmployee, employeeId: e.target.value})} required />
                    <input className="w-full p-3 border rounded-xl" placeholder="Name" value={newEmployee.fullName} onChange={e=>setNewEmployee({...newEmployee, fullName: e.target.value})} required />
                    <input className="w-full p-3 border rounded-xl" placeholder="Email" value={newEmployee.email} onChange={e=>setNewEmployee({...newEmployee, email: e.target.value})} required />
                    <input className="w-full p-3 border rounded-xl" placeholder="Dept" value={newEmployee.department} onChange={e=>setNewEmployee({...newEmployee, department: e.target.value})} required />
                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">Create</button>
                </form>
            </div>
        </div>
      )}
      
      {/* Attendance Modal Logic (Keep your existing logic, simplified here for space) */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-bold">Attendance: {selectedEmployee.fullName}</h2>
                    <button onClick={() => setSelectedEmployee(null)}><X/></button>
                </div>
                <form onSubmit={handleMarkAttendance} className="flex gap-2 mb-4">
                    <input type="date" className="border p-2 rounded-lg flex-1" value={attendanceForm.date} onChange={e=>setAttendanceForm({...attendanceForm, date: e.target.value})} />
                    <select className="border p-2 rounded-lg" value={attendanceForm.status} onChange={e=>setAttendanceForm({...attendanceForm, status: e.target.value})}>
                        <option>Present</option><option>Absent</option>
                    </select>
                    <button className="bg-green-600 text-white px-4 rounded-lg">Save</button>
                </form>
                <div className="max-h-40 overflow-y-auto">
                    {attendanceHistory.map(r => (
                        <div key={r._id} className="flex justify-between p-2 border-b text-sm">
                            <span>{r.date}</span> <span className={r.status==='Present'?'text-green-600':'text-red-600'}>{r.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;