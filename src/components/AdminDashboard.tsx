import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navigation from './Navigation';
import { getTranslation } from '../translations';
import ApiService from '../services/api';

interface AdminDashboardProps {
  language: 'en' | 'am';
}

interface Student {
  id: string;
  student_id: string;
  studentNameAm: string;
  studentNameEn: string;
  fatherNameAm: string;
  fatherNameEn: string;
  age: number;
  classLevel: number;
  guardianNameAm: string;
  guardianNameEn: string;
  guardianPhone?: string;
  registrationDate: string;
  studentPhoto?: string;
  guardianPhoto?: string;
}

interface Stats {
  total: number;
  today: number;
  grades: number;
  classDistribution: { class_level: number; count: number }[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  
  const t = (key: string) => getTranslation(language, key);

  // Simple authentication (in real app, use proper auth)
  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Login successful');
    } else {
      toast.error('Invalid password');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadStudents();
      loadStats();
    }
  }, [isAuthenticated]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getStudents(1, 100, searchTerm);
      setStudents(response.data);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await ApiService.getStudentStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Search students when search term changes
  useEffect(() => {
    if (isAuthenticated && searchTerm) {
      const timeoutId = setTimeout(() => {
        loadStudents();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (isAuthenticated) {
      loadStudents();
    }
  }, [searchTerm, isAuthenticated]);

  const filteredStudents = students;

  const deleteStudent = async (studentId: string) => {
    if (window.confirm(language === 'am' ? 'እርግጠኛ ነዎት?' : 'Are you sure?')) {
      try {
        await ApiService.deleteStudent(studentId);
        toast.success(language === 'am' ? 'ተማሪ ተሰርዟል' : 'Student deleted');
        setSelectedStudent(null);
        loadStudents();
        loadStats();
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Failed to delete student');
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Student ID', 'Name (AM)', 'Name (EN)', 'Father (AM)', 'Father (EN)', 'Age', 'Class', 'Guardian (AM)', 'Guardian (EN)', 'Phone', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.id,
        student.studentNameAm,
        student.studentNameEn,
        student.fatherNameAm,
        student.fatherNameEn,
        student.age,
        student.classLevel,
        student.guardianNameAm,
        student.guardianNameEn,
        student.guardianPhone || '',
        new Date(student.registrationDate).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-gray-50 ${language === 'am' ? 'amharic' : ''}`}>
        <Navigation language={language} />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {language === 'am' ? 'አስተዳዳሪ መግቢያ' : 'Admin Login'}
            </h1>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'am' ? 'የይለፍ ቃል' : 'Password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orthodox-blue"
                  placeholder={language === 'am' ? 'የይለፍ ቃል ያስገቡ' : 'Enter password'}
                />
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full bg-orthodox-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                {language === 'am' ? 'ግባ' : 'Login'}
              </button>
              
              <p className="text-sm text-gray-500 text-center">
                {language === 'am' ? 'ለሙከራ: admin123' : 'Demo password: admin123'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'am' ? 'amharic' : ''}`}>
      <Navigation language={language} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('adminDashboard')}</h1>
          <p className="text-gray-600">
            {language === 'am' ? 'የተመዘገቡ ተማሪዎችን ያስተዳድሩ' : 'Manage registered students'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orthodox-blue rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('totalStudents')}</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orthodox-green rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'am' ? 'የዛሬ መመዝገቢያዎች' : "Today's Registrations"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter(s => new Date(s.registrationDate).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orthodox-gold rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'am' ? 'የክፍል ደረጃዎች' : 'Grade Levels'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(students.map(s => s.classLevel)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={exportToCSV}
              className="w-full bg-orthodox-red text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('exportData')}
            </button>
          </div>
        </div>

        {/* Search and Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
                {language === 'am' ? 'የተመዘገቡ ተማሪዎች' : 'Registered Students'}
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchStudents')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orthodox-blue"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'am' ? 'መለያ' : 'ID'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'am' ? 'ስም' : 'Name'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'am' ? 'ዕድሜ' : 'Age'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'am' ? 'ክፍል' : 'Grade'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'am' ? 'ተጠሪ' : 'Guardian'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'am' ? 'ተግባር' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {language === 'am' ? student.studentNameAm : student.studentNameEn}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === 'am' ? student.fatherNameAm : student.fatherNameEn}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {language === 'am' ? `${student.classLevel}ኛ` : `Grade ${student.classLevel}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {language === 'am' ? student.guardianNameAm : student.guardianNameEn}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.guardianPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-orthodox-blue hover:text-blue-700 mr-3"
                      >
                        {t('view')}
                      </button>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {language === 'am' ? 'የተማሪ ዝርዝር' : 'Student Details'}
                </h3>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('studentInfo')}</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>{language === 'am' ? 'መለያ:' : 'ID:'}</strong> {selectedStudent.id}</p>
                    <p><strong>{language === 'am' ? 'ስም:' : 'Name:'}</strong> {language === 'am' ? selectedStudent.studentNameAm : selectedStudent.studentNameEn}</p>
                    <p><strong>{language === 'am' ? 'የአባት ስም:' : "Father's Name:"}</strong> {language === 'am' ? selectedStudent.fatherNameAm : selectedStudent.fatherNameEn}</p>
                    <p><strong>{language === 'am' ? 'ዕድሜ:' : 'Age:'}</strong> {selectedStudent.age}</p>
                    <p><strong>{language === 'am' ? 'ክፍል:' : 'Grade:'}</strong> {language === 'am' ? `${selectedStudent.classLevel}ኛ` : `Grade ${selectedStudent.classLevel}`}</p>
                  </div>
                  
                  {selectedStudent.studentPhoto && (
                    <div className="mt-4">
                      <p className="font-semibold text-gray-800 mb-2">{t('studentPhoto')}</p>
                      <img src={selectedStudent.studentPhoto} alt="Student" className="w-32 h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('guardianInfo')}</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>{language === 'am' ? 'ስም:' : 'Name:'}</strong> {language === 'am' ? selectedStudent.guardianNameAm : selectedStudent.guardianNameEn}</p>
                    <p><strong>{language === 'am' ? 'ስልክ:' : 'Phone:'}</strong> {selectedStudent.guardianPhone}</p>
                    <p><strong>{language === 'am' ? 'የመመዝገቢያ ቀን:' : 'Registration Date:'}</strong> {new Date(selectedStudent.registrationDate).toLocaleDateString()}</p>
                  </div>
                  
                  {selectedStudent.guardianPhoto && (
                    <div className="mt-4">
                      <p className="font-semibold text-gray-800 mb-2">{t('guardianPhoto')}</p>
                      <img src={selectedStudent.guardianPhoto} alt="Guardian" className="w-32 h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;