import { Link, NavLink } from 'react-router-dom';
import { Moon, Plus, Sparkles, Sun } from 'lucide-react';

export default function Header({ darkMode, onToggleTheme }) {
  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="홈으로 이동">
        <span className="brand-mark">
          <Sparkles size={18} />
        </span>
        <span>
          <strong>AI Video Archive</strong>
          <small>Frontend Class</small>
        </span>
      </Link>

      <nav className="header-actions" aria-label="주요 메뉴">
        <NavLink to="/" className="nav-link">
          포트폴리오
        </NavLink>
        <Link className="ghost-button hide-mobile" to="/register">
          <Plus size={17} />
          포트폴리오 등록
        </Link>
        <button className="icon-button" type="button" onClick={onToggleTheme} aria-label="다크모드 전환">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>
    </header>
  );
}
