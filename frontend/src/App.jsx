import { useEffect, useState } from 'react';
import API from './api';
import {
  Trash2, UserPlus, Calendar, X, Users,
  BarChart3, LayoutDashboard, Search, ChevronRight
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- ATTENDANCE STATE ---
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });

  // --- EMPLOYEE FORM STATE ---
  const [isFormOpen, setIsFormOpen] = useState(false); // Modal for Adding Employee
  const [newEmployee, setNewEmployee] = useState({
    employeeId: '', fullName: '', email: '', department: ''
  });

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

  useEffect(() => { fetchEmployees(); }, []);

  // --- ACTIONS ---
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await API.post('/employees', newEmployee);
      toast.success('Employee Added Successfully');
      setNewEmployee({ employeeId: '', fullName: '', email: '', department: '' });
      setIsFormOpen(false);
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding employee');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("This action cannot be undone. Proceed?")) return;
    try {
      await API.delete(`/employees/${id}`);
      toast.success('Employee record removed');
      fetchEmployees();
    } catch (error) {
      toast.error('Error deleting employee');
    }
  };

  const openAttendanceModal = async (employee) => {
    setSelectedEmployee(employee);
    try {
      const { data } = await API.get('/attendance');
      // Client-side filtering for the "Lite" version
      const history = data.filter(r => r.employeeId._id === employee._id || r.employeeId === employee._id);
      history.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAttendanceHistory(history);
    } catch (error) {
      toast.error("Could not load history");
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    try {
      await API.post('/attendance', {
        employeeId: selectedEmployee._id,
        ...attendanceForm
      });
      toast.success(`Marked as ${attendanceForm.status}`);
      openAttendanceModal(selectedEmployee); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error marking attendance');
    }
  };

  // --- HELPER: GET INITIALS FOR AVATAR ---
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // --- HELPER: FILTER EMPLOYEES ---
  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Toaster position="top-right" />

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-blue-400" /> HRMS<span className="font-light">Lite</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white font-medium shadow-md">
            <Users size={20} /> Employees
          </a>
        </nav>
        <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
          v1.0.0 • Admin Panel
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Dashboard</span> <ChevronRight size={14} /> <span className="text-slate-900 font-medium">Employee Management</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-auto p-8">

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Employees</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{employees.length}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Departments</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{[...new Set(employees.map(e => e.department))].length}</h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><LayoutDashboard size={24} /></div>
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or department..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition transform active:scale-95"
            >
              <UserPlus size={18} /> Add Employee
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold tracking-wider">
                <tr>
                  <th className="p-4 border-b border-slate-200">Employee</th>
                  <th className="p-4 border-b border-slate-200">ID</th>
                  <th className="p-4 border-b border-slate-200">Department</th>
                  <th className="p-4 border-b border-slate-200">Status</th>
                  <th className="p-4 border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading data...</td></tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">No employees found matching your search.</td></tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-slate-50 transition duration-150 group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-200">
                            {getInitials(emp.fullName)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{emp.fullName}</div>
                            <div className="text-xs text-slate-500">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm text-slate-600">{emp.employeeId}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {emp.department}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Attendance Button */}
                          <button
                            onClick={() => openAttendanceModal(emp)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            title="Mark Attendance"
                          >
                            <Calendar size={18} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                            title="Delete Employee"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- MODAL: ADD EMPLOYEE --- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Add New Employee</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Employee ID</label>
                  <input className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. EMP001" value={newEmployee.employeeId} onChange={e => setNewEmployee({ ...newEmployee, employeeId: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Department</label>
                  <input className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Engineering" value={newEmployee.department} onChange={e => setNewEmployee({ ...newEmployee, department: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                <input className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" value={newEmployee.fullName} onChange={e => setNewEmployee({ ...newEmployee, fullName: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                <input type="email" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@company.com" value={newEmployee.email} onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })} required />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/30">Create Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ATTENDANCE --- */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Attendance</h3>
                <p className="text-xs text-slate-500">Manage for {selectedEmployee.fullName}</p>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleMarkAttendance} className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Mark for Date</label>
                <div className="flex gap-2">
                  <input type="date" className="border border-slate-300 p-2 rounded-lg text-sm flex-1" value={attendanceForm.date} onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })} required />
                  <select className="border border-slate-300 p-2 rounded-lg text-sm bg-white" value={attendanceForm.status} onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <button type="submit" className="w-full mt-3 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">Submit Record</button>
              </form>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent History</h4>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {attendanceHistory.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-sm">No records found.</div>
                  ) : (
                    attendanceHistory.map((record) => (
                      <div key={record._id} className="flex justify-between items-center text-sm p-2 bg-white border border-slate-100 rounded hover:bg-slate-50">
                        <span className="text-slate-600">{record.date}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {record.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;