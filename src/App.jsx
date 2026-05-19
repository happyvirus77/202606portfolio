import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import EditPage from './pages/EditPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { students as initialStudents } from './data/students.js';

const STORAGE_KEY = 'portfolioStudents';
const REMOVED_LABELS = new Set(['Node.js', '풀스택']);
const TEAM_PORTFOLIO_IDS = new Set([
  'team-lumen-cut',
  'team-framewave',
  'team-promptstage',
  'team-editflow',
  'team-motionnest',
  'team-aiview',
]);
const INITIAL_PORTFOLIO_IDS = new Set(initialStudents.map((student) => student.id));
const REMOVED_PORTFOLIO_IDS = new Set([
  'hayul-jeon',
  'siyoon-kwon',
  'eunchae-nam',
  'joonwoo-yang',
  'minseo-ryu',
  'taerin-hong',
]);

function cleanPortfolioStudent(student) {
  const category = student.category?.filter((item) => !REMOVED_LABELS.has(item)) || ['React'];
  const skills = student.skills?.filter((item) => !REMOVED_LABELS.has(item)) || ['React'];

  return {
    ...student,
    description: student.description?.replaceAll('풀스택', '통합형') || '',
    projectType: TEAM_PORTFOLIO_IDS.has(student.id)
      ? '팀 프로젝트'
      : INITIAL_PORTFOLIO_IDS.has(student.id)
        ? '개인 프로젝트'
        : student.projectType,
    category: category.length > 0 ? category : ['React'],
    skills: skills.length > 0 ? skills : ['React'],
  };
}

function cleanPortfolioStudents(students) {
  return students.filter((student) => !REMOVED_PORTFOLIO_IDS.has(student.id)).map(cleanPortfolioStudent);
}

function mergeWithInitialStudents(savedStudents) {
  const cleanedSavedStudents = cleanPortfolioStudents(savedStudents);
  const savedIds = new Set(cleanedSavedStudents.map((student) => student.id));
  const missingInitialStudents = cleanPortfolioStudents(initialStudents).filter((student) => !savedIds.has(student.id));

  return [...cleanedSavedStudents, ...missingInitialStudents];
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [portfolioStudents, setPortfolioStudents] = useState(() => {
    const savedStudents = localStorage.getItem(STORAGE_KEY);

    if (!savedStudents) {
      return cleanPortfolioStudents(initialStudents);
    }

    try {
      return mergeWithInitialStudents(JSON.parse(savedStudents));
    } catch {
      return cleanPortfolioStudents(initialStudents);
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioStudents));
  }, [portfolioStudents]);

  const archiveStats = useMemo(
    () => ({
      students: portfolioStudents.length,
      portfolios: portfolioStudents.length,
      totalLikes: portfolioStudents.reduce((sum, item) => sum + item.likes, 0),
      totalViews: portfolioStudents.reduce((sum, item) => sum + item.views, 0),
    }),
    [portfolioStudents],
  );

  const handleRegisterPortfolio = (student) => {
    setPortfolioStudents((currentStudents) => [student, ...currentStudents]);
  };

  const handleUpdatePortfolio = (updatedStudent) => {
    setPortfolioStudents((currentStudents) =>
      currentStudents.map((student) => (student.id === updatedStudent.id ? updatedStudent : student)),
    );
  };

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage students={portfolioStudents} stats={archiveStats} />} />
          <Route
            path="/register"
            element={<RegisterPage onRegister={handleRegisterPortfolio} students={portfolioStudents} />}
          />
          <Route
            path="/portfolio/:id/edit"
            element={<EditPage students={portfolioStudents} onUpdate={handleUpdatePortfolio} />}
          />
          <Route path="/portfolio/:id" element={<DetailPage students={portfolioStudents} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
