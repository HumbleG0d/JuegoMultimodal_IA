import { useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashBoard from './components/DashBoard';
import StudenDashBoard from './components/StudentDashBoard';
function App() {
  useEffect(() => {
    // Update the page title
    document.title = "EduGame AI - Multimodal Educational Gaming";
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = e.currentTarget as HTMLAnchorElement;
        const targetId = target.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId!);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', () => {});
      });
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teacher/dashboard" element={<DashBoard />} />
          <Route path="/student/dashboard" element={<StudenDashBoard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;