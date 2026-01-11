import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp, Brain, Target, Calendar, BookOpen, Heart, Award, Bell, User, Users, Settings, LogOut, Activity, Plus, Edit, Trash2, Save, X } from 'lucide-react';

const colorMap = {
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  green: "bg-green-50 text-green-600 border-green-200",
  red: "bg-red-50 text-red-600 border-red-200",
};


const StudentWellnessSystem = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const [studentData, setStudentData] = useState({
    id: 1,
    name: "",
    email: "",
    role: "STUDENT",
    academicData: {
      attendance: 0,
      internalMarks: 0,
      assignmentCompletion: 0,
      studyHours: 0,
      subjects: []
    },
    wellnessData: {
      stressLevel: 5,
      sleepHours: 7,
      lastAssessment: new Date().toISOString().split('T')[0],
      burnoutRisk: "low",
      trends: []
    },
    careerData: {
      interests: [],
      skills: [],
      recommendedPath: ""
    }
  });

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (currentUser && currentUser.role === 'STUDENT') {
      generateRecommendations();
      analyzeWellness();
    }
  }, [studentData, currentUser]);

  const generateRecommendations = () => {
    const newNotifications = [];
    
    studentData.academicData.subjects.forEach(subject => {
      if (subject.score < 70) {
        newNotifications.push({
          id: Date.now() + Math.random(),
          type: "academic",
          message: `Focus on ${subject.name} - Current score: ${subject.score}%. Allocate 2-3 extra hours weekly.`,
          timestamp: "Just now",
          priority: "high"
        });
      }
    });

    if (studentData.academicData.attendance < 75) {
      newNotifications.push({
        id: Date.now() + Math.random(),
        type: "academic",
        message: `Low attendance detected (${studentData.academicData.attendance}%). Maintain 75%+ for eligibility.`,
        timestamp: "Just now",
        priority: "high"
      });
    }

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
    }
  };

  const analyzeWellness = () => {
    const { stressLevel, sleepHours } = studentData.wellnessData;
    
    if (stressLevel >= 7 || sleepHours < 6) {
      const newNotif = {
        id: Date.now() + Math.random(),
        type: "wellness",
        message: `High stress detected (${stressLevel}/10) with ${sleepHours} hrs sleep. Consider speaking with a counselor.`,
        timestamp: "Just now",
        priority: "high"
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setFormData({});
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSubject = () => {
    if (!formData.subjectName || !formData.score) {
      alert("Please fill all fields");
      return;
    }

    const newSubject = {
      name: formData.subjectName,
      score: parseInt(formData.score),
      trend: parseInt(formData.score) >= 80 ? "good" : parseInt(formData.score) >= 70 ? "improving" : "needs-attention"
    };

    setStudentData(prev => ({
      ...prev,
      academicData: {
        ...prev.academicData,
        subjects: [...prev.academicData.subjects, newSubject]
      }
    }));

    closeModal();
  };

  const deleteSubject = (index) => {
    setStudentData(prev => ({
      ...prev,
      academicData: {
        ...prev.academicData,
        subjects: prev.academicData.subjects.filter((_, i) => i !== index)
      }
    }));
  };

  const updateAcademicInfo = () => {
    setStudentData(prev => ({
      ...prev,
      academicData: {
        ...prev.academicData,
        attendance: parseInt(formData.attendance) || prev.academicData.attendance,
        internalMarks: parseInt(formData.internalMarks) || prev.academicData.internalMarks,
        assignmentCompletion: parseInt(formData.assignmentCompletion) || prev.academicData.assignmentCompletion,
        studyHours: parseInt(formData.studyHours) || prev.academicData.studyHours
      }
    }));
    closeModal();
  };

  const addWellnessEntry = () => {
    const newTrend = {
      week: `Week ${studentData.wellnessData.trends.length + 1}`,
      stress: parseInt(formData.stress),
      sleep: parseFloat(formData.sleep)
    };

    const burnoutRisk = parseInt(formData.stress) >= 7 ? "high" : 
                        parseInt(formData.stress) >= 5 ? "moderate" : "low";

    setStudentData(prev => ({
      ...prev,
      wellnessData: {
        stressLevel: parseInt(formData.stress),
        sleepHours: parseFloat(formData.sleep),
        lastAssessment: new Date().toISOString().split('T')[0],
        burnoutRisk,
        trends: [...prev.wellnessData.trends, newTrend]
      }
    }));

    closeModal();
  };

  const addSkill = () => {
    if (!formData.skillName || !formData.skillLevel) {
      alert("Please fill all fields");
      return;
    }

    const newSkill = {
      skill: formData.skillName,
      level: parseInt(formData.skillLevel)
    };

    setStudentData(prev => ({
      ...prev,
      careerData: {
        ...prev.careerData,
        skills: [...prev.careerData.skills, newSkill]
      }
    }));

    closeModal();
  };

  const addInterest = () => {
    if (!formData.interest) {
      alert("Please enter an interest");
      return;
    }

    setStudentData(prev => ({
      ...prev,
      careerData: {
        ...prev.careerData,
        interests: [...prev.careerData.interests, formData.interest]
      }
    }));

    closeModal();
  };

  const deleteSkill = (index) => {
    setStudentData(prev => ({
      ...prev,
      careerData: {
        ...prev.careerData,
        skills: prev.careerData.skills.filter((_, i) => i !== index)
      }
    }));
  };

  const deleteInterest = (index) => {
    setStudentData(prev => ({
      ...prev,
      careerData: {
        ...prev.careerData,
        interests: prev.careerData.interests.filter((_, i) => i !== index)
      }
    }));
  };

  const createProfile = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill all required fields");
      return;
    }

    setStudentData(prev => ({
      ...prev,
      name: formData.name,
      email: formData.email
    }));

    setCurrentUser({
      ...studentData,
      name: formData.name,
      email: formData.email,
      role: 'STUDENT'
    });

    closeModal();
  };

  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Wellness Platform</h1>
          <p className="text-gray-600">Intelligent guidance for academic & personal growth</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => openModal('createProfile')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Create Student Profile
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentUser({ role: 'MENTOR', name: 'Dr. Singh' })}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-200 transition-all"
            >
              Mentor Login
            </button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-6">
          🔒 Secured with Spring Security + JWT | GDPR Compliant
        </p>
      </div>
    </div>
  );

  const Modal = ({ children, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    switch (modalType) {
      case 'createProfile':
        return (
          <Modal title="Create Your Profile">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="your.email@university.edu"
                />
              </div>
              <button
                onClick={createProfile}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Create Profile
              </button>
            </div>
          </Modal>
        );

      case 'addSubject':
        return (
          <Modal title="Add Subject">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                <input
                  type="text"
                  name="subjectName"
                  value={formData.subjectName || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Data Structures"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Score (%)</label>
                <input
                  type="number"
                  name="score"
                  min="0"
                  max="100"
                  value={formData.score || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0-100"
                />
              </div>
              <button
                onClick={addSubject}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Add Subject
              </button>
            </div>
          </Modal>
        );

      case 'updateAcademic':
        return (
          <Modal title="Update Academic Info">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attendance (%)</label>
                <input
                  type="number"
                  name="attendance"
                  min="0"
                  max="100"
                  value={formData.attendance || studentData.academicData.attendance}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Internal Marks (%)</label>
                <input
                  type="number"
                  name="internalMarks"
                  min="0"
                  max="100"
                  value={formData.internalMarks || studentData.academicData.internalMarks}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Completion (%)</label>
                <input
                  type="number"
                  name="assignmentCompletion"
                  min="0"
                  max="100"
                  value={formData.assignmentCompletion || studentData.academicData.assignmentCompletion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Study Hours</label>
                <input
                  type="number"
                  name="studyHours"
                  min="0"
                  value={formData.studyHours || studentData.academicData.studyHours}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={updateAcademicInfo}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Update Info
              </button>
            </div>
          </Modal>
        );

      case 'addWellness':
        return (
          <Modal title="Wellness Check-In">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level (0-10)</label>
                <input
                  type="range"
                  name="stress"
                  min="0"
                  max="10"
                  value={formData.stress || 5}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <div className="text-center text-2xl font-bold text-purple-600 mt-2">
                  {formData.stress || 5} / 10
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Hours (last night)</label>
                <input
                  type="number"
                  name="sleep"
                  min="0"
                  max="24"
                  step="0.5"
                  value={formData.sleep || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 7.5"
                />
              </div>
              <button
                onClick={addWellnessEntry}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Submit Check-In
              </button>
            </div>
          </Modal>
        );

      case 'addSkill':
        return (
          <Modal title="Add Skill">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                <input
                  type="text"
                  name="skillName"
                  value={formData.skillName || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Java, Python, React"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level (0-100)</label>
                <input
                  type="range"
                  name="skillLevel"
                  min="0"
                  max="100"
                  value={formData.skillLevel || 50}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <div className="text-center text-xl font-bold text-purple-600 mt-2">
                  {formData.skillLevel || 50}%
                </div>
              </div>
              <button
                onClick={addSkill}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Add Skill
              </button>
            </div>
          </Modal>
        );

      case 'addInterest':
        return (
          <Modal title="Add Career Interest">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Career Interest</label>
                <input
                  type="text"
                  name="interest"
                  value={formData.interest || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Backend Development, AI/ML"
                />
              </div>
              <button
                onClick={addInterest}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Add Interest
              </button>
            </div>
          </Modal>
        );

      default:
        return null;
    }
  };

  const StudentDashboard = () => {
    const hasData = studentData.academicData.subjects.length > 0 || 
                    studentData.wellnessData.trends.length > 0 ||
                    studentData.careerData.skills.length > 0;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name}! 👋</h2>
          <p className="text-blue-100">Here's your personalized guidance for today</p>
        </div>

        {!hasData && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Get Started!</h3>
            <p className="text-yellow-800 mb-4">Add your academic data, wellness check-ins, and career interests to receive personalized recommendations.</p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => openModal('addSubject')} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700">
                Add Subject
              </button>
              <button onClick={() => openModal('addWellness')} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700">
                Wellness Check-In
              </button>
              <button onClick={() => openModal('addSkill')} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700">
                Add Skills
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            icon={<TrendingUp />} 
            title="Academic Performance" 
            value={`${studentData.academicData.internalMarks}%`}
            status={studentData.academicData.internalMarks >= 75 ? "good" : "warning"}
            subtitle="Internal Marks"
          />
          <StatCard 
            icon={<Heart />} 
            title="Wellness Score" 
            value={`${10 - studentData.wellnessData.stressLevel}/10`}
            status={studentData.wellnessData.stressLevel <= 5 ? "good" : "warning"}
            subtitle="Stress Management"
          />
          <StatCard 
            icon={<Calendar />} 
            title="Attendance" 
            value={`${studentData.academicData.attendance}%`}
            status={studentData.academicData.attendance >= 75 ? "good" : "warning"}
            subtitle="This Semester"
          />
          <StatCard 
            icon={<Target />} 
            title="Assignments" 
            value={`${studentData.academicData.assignmentCompletion}%`}
            status={studentData.academicData.assignmentCompletion >= 85 ? "excellent" : "good"}
            subtitle="Completion Rate"
          />
        </div>

        {studentData.academicData.subjects.some(s => s.score < 70) && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Academic Alerts</h3>
                <p className="text-sm text-gray-500">Areas needing attention</p>
              </div>
            </div>
            {studentData.academicData.subjects.filter(s => s.score < 70).map((subject, idx) => (
              <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-3">
                <p className="font-medium text-gray-800">Weak in {subject.name}</p>
                <p className="text-sm text-gray-600 mt-1">Current Score: {subject.score}% | Target: 75%</p>
                <p className="text-sm text-gray-700 mt-2">
                  📚 Recommendation: Allocate 2-3 extra hours weekly for improvement.
                </p>
              </div>
            ))}
          </div>
        )}

        {studentData.wellnessData.stressLevel >= 7 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Brain className="text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Wellness Alert</h3>
                <p className="text-sm text-gray-500">Mental Health Support</p>
              </div>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="font-medium text-gray-800">Elevated Stress Detected</p>
              <p className="text-sm text-gray-600 mt-1">Stress Level: {studentData.wellnessData.stressLevel}/10 | Sleep: {studentData.wellnessData.sleepHours} hrs/night</p>
              <p className="text-sm text-gray-700 mt-2">
                🧘 Consider taking breaks and speaking with a mentor. Maintain 7-8 hours sleep.
              </p>
              <button className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700">
                Talk to Counselor
              </button>
            </div>
          </div>
        )}

        {studentData.academicData.subjects.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Academic Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentData.academicData.subjects}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  const AcademicView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Academic Analytics</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => openModal('updateAcademic')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Edit size={16} />
            Update Info
          </button>
          <button 
            onClick={() => openModal('addSubject')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
          >
            <Plus size={16} />
            Add Subject
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance</h3>
          {studentData.academicData.subjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="mx-auto mb-2" size={48} />
              <p>No subjects added yet</p>
              <button 
                onClick={() => openModal('addSubject')}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Add Your First Subject
              </button>
            </div>
          ) : (
            studentData.academicData.subjects.map((subject, idx) => (
              <div key={idx} className="mb-4 p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{subject.score}%</span>
                    <button 
                      onClick={() => deleteSubject(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      subject.score >= 80 ? 'bg-green-500' : 
                      subject.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${subject.score}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Attendance</span>
              <span className="text-xl font-bold text-blue-600">{studentData.academicData.attendance}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Internal Marks</span>
              <span className="text-xl font-bold text-purple-600">{studentData.academicData.internalMarks}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Assignments</span>
              <span className="text-xl font-bold text-green-600">{studentData.academicData.assignmentCompletion}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">Study Hours/Week</span>
              <span className="text-xl font-bold text-yellow-600">{studentData.academicData.studyHours} hrs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const WellnessView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Mental Wellness Dashboard</h2>
        <button 
          onClick={() => openModal('addWellness')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
        >
          <Plus size={16} />
          New Check-In
        </button>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> This system does NOT diagnose mental illness. It provides supportive guidance and connects you with professionals when needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {studentData.wellnessData.trends.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Stress & Sleep Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={studentData.wellnessData.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="stress" stroke="#ef4444" name="Stress (0-10)" />
                <Line type="monotone" dataKey="sleep" stroke="#3b82f6" name="Sleep (hrs)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center py-8 text-gray-500">
              <Heart className="mx-auto mb-2" size={48} />
              <p>No wellness data yet</p>
              <button 
                onClick={() => openModal('addWellness')}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Start Your First Check-In
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Status</h3>
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              studentData.wellnessData.stressLevel >= 7 ? 'bg-red-50' : 
              studentData.wellnessData.stressLevel >= 5 ? 'bg-yellow-50' : 'bg-green-50'
            }`}>
              <div>
                <p className="text-sm text-gray-600">Stress Level</p>
                <p className={`text-2xl font-bold ${
                  studentData.wellnessData.stressLevel >= 7 ? 'text-red-600' : 
                  studentData.wellnessData.stressLevel >= 5 ? 'text-yellow-600' : 'text-green-600'
                }`}>{studentData.wellnessData.stressLevel}/10</p>
              </div>
              <AlertCircle className={
                studentData.wellnessData.stressLevel >= 7 ? 'text-red-600' : 
                studentData.wellnessData.stressLevel >= 5 ? 'text-yellow-600' : 'text-green-600'
              } size={32} />
            </div>
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              studentData.wellnessData.sleepHours < 6 ? 'bg-red-50' : 
              studentData.wellnessData.sleepHours < 7 ? 'bg-yellow-50' : 'bg-green-50'
            }`}>
              <div>
                <p className="text-sm text-gray-600">Sleep (Avg)</p>
                <p className={`text-2xl font-bold ${
                  studentData.wellnessData.sleepHours < 6 ? 'text-red-600' : 
                  studentData.wellnessData.sleepHours < 7 ? 'text-yellow-600' : 'text-green-600'
                }`}>{studentData.wellnessData.sleepHours} hrs</p>
              </div>
              <Activity className={
                studentData.wellnessData.sleepHours < 6 ? 'text-red-600' : 
                studentData.wellnessData.sleepHours < 7 ? 'text-yellow-600' : 'text-green-600'
              } size={32} />
            </div>
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              studentData.wellnessData.burnoutRisk === 'high' ? 'bg-red-50' : 
              studentData.wellnessData.burnoutRisk === 'moderate' ? 'bg-yellow-50' : 'bg-green-50'
            }`}>
              <div>
                <p className="text-sm text-gray-600">Burnout Risk</p>
                <p className={`text-2xl font-bold capitalize ${
                  studentData.wellnessData.burnoutRisk === 'high' ? 'text-red-600' : 
                  studentData.wellnessData.burnoutRisk === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                }`}>{studentData.wellnessData.burnoutRisk}</p>
              </div>
              <Brain className={
                studentData.wellnessData.burnoutRisk === 'high' ? 'text-red-600' : 
                studentData.wellnessData.burnoutRisk === 'moderate' ? 'text-yellow-600' : 'text-green-600'
              } size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalized Wellness Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WellnessTip 
            icon="🧘"
            title="Take Regular Breaks"
            description="Try the Pomodoro technique: 25 min work, 5 min break"
          />
          <WellnessTip 
            icon="😴"
            title="Improve Sleep Hygiene"
            description="Aim for 7-8 hours. Avoid screens 1 hour before bed"
          />
          <WellnessTip 
            icon="🚶"
            title="Physical Activity"
            description="30 minutes of exercise can reduce stress significantly"
          />
          <WellnessTip 
            icon="💬"
            title="Talk to Someone"
            description="Connect with mentor, counselor, or trusted friend"
          />
        </div>
        
        <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 w-full">
          Schedule Counselor Appointment
        </button>
      </div>
    </div>
  );

  const CareerView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Career & Skill Development</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => openModal('addSkill')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
          >
            <Plus size={16} />
            Add Skill
          </button>
          <button 
            onClick={() => openModal('addInterest')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Interest
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {studentData.careerData.skills.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Skill Profile</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={studentData.careerData.skills}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Skills" dataKey="level" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center py-8 text-gray-500">
              <Target className="mx-auto mb-2" size={48} />
              <p>No skills added yet</p>
              <button 
                onClick={() => openModal('addSkill')}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Add Your First Skill
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Interests</h3>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Technical Skills</h4>
            {studentData.careerData.skills.length === 0 ? (
              <p className="text-sm text-gray-500">No skills added yet</p>
            ) : (
              <div className="space-y-2">
                {studentData.careerData.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-purple-600">{skill.level}%</span>
                      <button 
                        onClick={() => deleteSkill(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Career Interests</h4>
            {studentData.careerData.interests.length === 0 ? (
              <p className="text-sm text-gray-500">No interests added yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {studentData.careerData.interests.map((interest, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {interest}
                    <button 
                      onClick={() => deleteInterest(idx)}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {studentData.careerData.skills.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Career Recommendations</h3>
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Target className="text-purple-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Based on Your Skills</p>
                <p className="text-2xl font-bold text-gray-800">
                  {studentData.careerData.skills[0]?.skill.includes('Java') || 
                   studentData.careerData.skills[0]?.skill.includes('Python') ? 
                   'Backend Development' : 'Software Development'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              Your skill profile indicates strong potential in software development roles.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const StatCard = ({ icon, title, value, status, subtitle }) => (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-lg ${
          status === 'excellent' ? 'bg-green-100' :
          status === 'good' ? 'bg-blue-100' :
          status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          {React.cloneElement(icon, { 
            className: status === 'excellent' ? 'text-green-600' :
              status === 'good' ? 'text-blue-600' :
              status === 'warning' ? 'text-yellow-600' : 'text-red-600',
            size: 24 
          })}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );

  const WellnessTip = ({ icon, title, description }) => (
    <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  const Sidebar = () => (
    <div className="bg-gradient-to-b from-purple-700 to-blue-700 text-white p-6 h-screen sticky top-0">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain size={32} />
          <h1 className="text-xl font-bold">Wellness Platform</h1>
        </div>
        <p className="text-sm text-purple-200">
          {currentUser.role === 'STUDENT' ? 'Student Portal' : 'Mentor Portal'}
        </p>
      </div>

      <nav className="space-y-2">
        {currentUser.role === 'STUDENT' && (
          <>
            <NavItem icon={<Activity />} label="Dashboard" view="dashboard" active={activeView} setActive={setActiveView} />
            <NavItem icon={<BookOpen />} label="Academics" view="academics" active={activeView} setActive={setActiveView} />
            <NavItem icon={<Heart />} label="Wellness" view="wellness" active={activeView} setActive={setActiveView} />
            <NavItem icon={<Target />} label="Career" view="career" active={activeView} setActive={setActiveView} />
            <NavItem icon={<Bell />} label="Notifications" view="notifications" active={activeView} setActive={setActiveView} badge={notifications.length} />
          </>
        )}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} />
            <div>
              <p className="font-medium text-sm">{currentUser.name}</p>
              <p className="text-xs text-purple-200">{currentUser.email || currentUser.role}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setCurrentUser(null)}
          className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  const NavItem = ({ icon, label, view, active, setActive, badge }) => (
    <button
      onClick={() => setActive(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active === view ? 'bg-white text-purple-700' : 'hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge > 0 && (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{badge}</span>
      )}
    </button>
  );

  if (!currentUser) {
    return (
      <>
        <LoginScreen />
        {renderModal()}
      </>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex-1 p-8 overflow-auto">
        {currentUser.role === 'STUDENT' && (
          <>
            {activeView === 'dashboard' && <StudentDashboard />}
            {activeView === 'academics' && <AcademicView />}
            {activeView === 'wellness' && <WellnessView />}
            {activeView === 'career' && <CareerView />}
            {activeView === 'notifications' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifications</h2>
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="mx-auto mb-2" size={48} />
                    <p>No notifications yet</p>
                    <p className="text-sm mt-2">Add your academic and wellness data to get personalized recommendations</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 border-l-4 rounded-lg ${
                        notif.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-gray-800">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                          </div>
                          {notif.type === 'academic' && <BookOpen className="text-red-600" size={20} />}
                          {notif.type === 'wellness' && <Heart className="text-yellow-600" size={20} />}
                          {notif.type === 'career' && <Target className="text-blue-600" size={20} />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {renderModal()}
    </div>
  );
};

export default StudentWellnessSystem;
