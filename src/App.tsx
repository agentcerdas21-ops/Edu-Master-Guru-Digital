import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Views
import { DashboardView } from './views/DashboardView';
import { ProfileTeacherView } from './views/ProfileTeacherView';
import { TeachingScheduleView } from './views/TeachingScheduleView';
import { AcademicCalendarView } from './views/AcademicCalendarView';
import { ModulAjarView } from './views/ModulAjarView';
import { BahanAjarView } from './views/BahanAjarView';
import { LKPDView } from './views/LKPDView';
import { KKTPView } from './views/KKTPView';
import { CP_TP_ATPView } from './views/CP_TP_ATPView';
import { ProtaProsemView } from './views/ProtaProsemView';
import { GroupDivisionView } from './views/GroupDivisionView';
import { AttendanceView } from './views/AttendanceView';
import { GradesView } from './views/GradesView';
import { QuizExamView } from './views/QuizExamView';
import { TeachingJournalView } from './views/TeachingJournalView';
import { StudentTaskView } from './views/StudentTaskView';
import { QuestionBankView } from './views/QuestionBankView';
import { HomeroomTeacherView } from './views/HomeroomTeacherView';
import { AIAssistantView } from './views/AIAssistantView';
import { AdminPanelView } from './views/AdminPanelView';

const MainAppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView onNavigate={setActivePage} />;
      case 'profile':
      case 'profile_teacher':
        return <ProfileTeacherView />;
      case 'schedule':
        return <TeachingScheduleView />;
      case 'calendar':
        return <AcademicCalendarView />;
      case 'modul_ajar':
        return <ModulAjarView />;
      case 'bahan_ajar':
        return <BahanAjarView />;
      case 'lkpd':
        return <LKPDView />;
      case 'kktp':
        return <KKTPView />;
      case 'cp_tp_atp':
        return <CP_TP_ATPView />;
      case 'prota_prosem':
        return <ProtaProsemView />;
      case 'group_division':
        return <GroupDivisionView />;
      case 'attendance':
        return <AttendanceView />;
      case 'grades':
        return <GradesView />;
      case 'quiz_exam':
        return <QuizExamView />;
      case 'journal':
      case 'teaching_journal':
        return <TeachingJournalView />;
      case 'student_tasks':
      case 'student_task':
        return <StudentTaskView />;
      case 'question_bank':
        return <QuestionBankView />;
      case 'homeroom':
      case 'homeroom_teacher':
        return <HomeroomTeacherView />;
      case 'ai_assistant':
        return <AIAssistantView />;
      case 'admin_panel':
        return <AdminPanelView />;
      default:
        return <DashboardView onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenAIAssistant={() => setActivePage('ai_assistant')}
        activeMenu={activePage}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Navigation */}
        <Sidebar
          activeMenu={activePage}
          onSelectMenu={setActivePage}
          collapsed={!isSidebarOpen}
          onToggleCollapse={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Content View Area */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}>
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MainAppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
