import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, UsersRound } from 'lucide-react';
import CategoryFilter from '../components/CategoryFilter.jsx';
import PortfolioCard from '../components/PortfolioCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import StatCard from '../components/StatCard.jsx';

export default function HomePage({ students, stats }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');
  const [projectFilter, setProjectFilter] = useState('personal');

  const filteredStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return students.filter((student) => {
      const categoryMatched = activeCategory === '전체' || student.category.includes(activeCategory);
      const projectTypeMatched =
        projectFilter === 'team' ? student.projectType === '팀 프로젝트' : student.projectType === '개인 프로젝트';
      const searchableText = [
        student.name,
        student.title,
        student.description,
        student.intro,
        ...student.skills,
        ...student.category,
      ]
        .join(' ')
        .toLowerCase();

      return categoryMatched && projectTypeMatched && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeCategory, projectFilter, query, students]);

  const heroStudents = students.slice(0, 4);
  const personalProjectCount = students.filter((student) => student.projectType === '개인 프로젝트').length;
  const teamProjectCount = students.filter((student) => student.projectType === '팀 프로젝트').length;

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
  };

  return (
    <div className="page">
      <section className="hero-section">
        <div className="hero-copy fade-in">
          <p className="eyebrow">AI Video Frontend Class</p>
          <h1>학생들의 프로젝트를 한눈에 보는 포트폴리오 아카이브</h1>
          <p>
            React, AI, 영상 제작, 디자인 시스템을 배운 수강생들이 직접 기획하고 구현한 프로젝트를
            큐레이션했습니다.
          </p>
          <div className="hero-actions">
            <a href="#portfolio-list" className="primary-button large">
              작품 둘러보기
              <ArrowRight size={18} />
            </a>
            <Link to="/register" className="ghost-button large">
              <Plus size={18} />
              포트폴리오 등록
            </Link>
          </div>
        </div>

        <div className="hero-panel glass-panel fade-in delay">
          <div>
            <span>Class Archive</span>
            <strong>2026 Portfolio Showcase</strong>
          </div>
          <div className="hero-image-grid">
            {heroStudents.map((student) => (
              <img key={student.id} src={student.thumbnail} alt={`${student.title} 썸네일`} />
            ))}
          </div>
        </div>
      </section>

      <section className="stats-grid" aria-label="아카이브 통계">
        <StatCard label="전체 학생 수" value={stats.students} suffix="명" />
        <StatCard label="포트폴리오" value={stats.portfolios} suffix="개" />
        <StatCard label="누적 좋아요" value={stats.totalLikes} suffix="" />
        <StatCard label="누적 조회수" value={stats.totalViews} suffix="" />
      </section>

      <section className="team-project-banner glass-panel">
        <div className="team-banner-icon">
          <UsersRound size={24} />
        </div>
        <div>
          <p className="eyebrow">Team Showcase</p>
          <h2>팀프로젝트 보기</h2>
          <p>협업으로 완성한 {teamProjectCount}개의 프로젝트만 모아서 확인할 수 있습니다.</p>
        </div>
        <a
          href="#portfolio-list"
          className="primary-button large"
          onClick={() => setProjectFilter('team')}
        >
          팀프로젝트만 보기
          <ArrowRight size={18} />
        </a>
      </section>

      <section className="intro-section">
        <SectionHeading
          eyebrow="About Class"
          title="AI 영상 프론트엔드 수업"
          description="생성형 AI와 영상 콘텐츠 제작 흐름을 이해하고, 사용자가 실제로 쓰고 싶은 웹 경험으로 구현하는 실전형 과정입니다."
        />
        <div className="intro-grid">
          <div>
            <strong>기획부터 배포까지</strong>
            <p>아이디어 발굴, 화면 설계, React 구현, 배포 링크 정리까지 프로젝트 전체 흐름을 경험합니다.</p>
          </div>
          <div>
            <strong>AI와 영상 도메인</strong>
            <p>자막, 장면 검색, 큐레이션, 분석 대시보드처럼 영상 제작 현장과 연결되는 주제를 다룹니다.</p>
          </div>
          <div>
            <strong>포트폴리오 중심 결과물</strong>
            <p>수료 후 바로 보여줄 수 있는 완성도 높은 프로젝트와 문서화된 개발 경험을 남깁니다.</p>
          </div>
        </div>
      </section>

      <section className="portfolio-section" id="portfolio-list">
        <div className="portfolio-toolbar">
          <SectionHeading
            eyebrow="Archive"
            title={projectFilter === 'team' ? '팀프로젝트 포트폴리오' : '개인프로젝트 포트폴리오'}
            description={`${filteredStudents.length}개의 결과가 표시되고 있습니다.`}
          />
          <SearchBar value={query} onChange={handleQueryChange} />
        </div>

        <CategoryFilter activeCategory={activeCategory} onChange={handleCategoryChange} />

        <div className="project-filter-row" aria-label="프로젝트 유형 필터">
          <button
            type="button"
            className={projectFilter === 'personal' ? 'category-chip active' : 'category-chip'}
            onClick={() => setProjectFilter('personal')}
          >
            개인프로젝트 보기
            <span>{personalProjectCount}</span>
          </button>
          <button
            type="button"
            className={projectFilter === 'team' ? 'category-chip active' : 'category-chip'}
            onClick={() => setProjectFilter('team')}
          >
            팀프로젝트 보기
            <span>{teamProjectCount}</span>
          </button>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="portfolio-grid">
            {filteredStudents.map((student) => (
              <PortfolioCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <strong>검색 결과가 없습니다.</strong>
            <p>다른 키워드나 카테고리로 다시 찾아보세요.</p>
          </div>
        )}

      </section>
    </div>
  );
}
