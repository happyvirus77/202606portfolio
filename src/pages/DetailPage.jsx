import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Code2, Edit3, Eye, Heart, Rocket, Trash2 } from 'lucide-react';
import NotFoundPage from './NotFoundPage.jsx';

export default function DetailPage({ students }) {
  const { id } = useParams();
  const student = students.find((item) => item.id === id);
  const displayName = student?.teamName || student?.name;

  if (!student) {
    return <NotFoundPage />;
  }

  return (
    <div className="page detail-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} />
        아카이브로 돌아가기
      </Link>

      <section className="detail-hero">
        <div className="detail-hero-copy fade-in">
          <p className="eyebrow">{student.projectType}</p>
          <h1>{student.title}</h1>
          <p>{student.description}</p>
          <div className="student-line large">
            <img src={student.profileImage} alt={`${student.name} 프로필`} />
            <div>
              <strong>{displayName}</strong>
              <span>{student.intro}</span>
            </div>
          </div>
          <div className="detail-actions">
            <a href={student.github} target="_blank" rel="noreferrer" className="primary-button">
              <Code2 size={17} />
              GitHub
            </a>
            <a href={student.deployUrl} target="_blank" rel="noreferrer" className="ghost-button">
              <Rocket size={17} />
              배포 링크
            </a>
          </div>
        </div>
        <div className="detail-main-image fade-in delay">
          {student.videoUrl ? (
            <video src={student.videoUrl} poster={student.thumbnail} controls muted playsInline />
          ) : (
            <img src={student.thumbnail} alt={`${student.title} 메인 이미지`} />
          )}
        </div>
      </section>

      <section className="detail-meta-grid">
        <div className="meta-card">
          <span>좋아요</span>
          <strong>
            <Heart size={18} />
            {student.likes.toLocaleString()}
          </strong>
        </div>
        <div className="meta-card">
          <span>조회수</span>
          <strong>
            <Eye size={18} />
            {student.views.toLocaleString()}
          </strong>
        </div>
        <div className="meta-card">
          <span>카테고리</span>
          <strong>{student.category.join(', ')}</strong>
        </div>
        <div className="meta-card">
          <span>{student.teamName ? '팀 이름' : '프로젝트 유형'}</span>
          <strong>{student.teamName || student.projectType}</strong>
        </div>
      </section>

      <section className="detail-content-grid">
        <article className="detail-block">
          <p className="eyebrow">Overview</p>
          <h2>프로젝트 상세 설명</h2>
          <p>
            {student.title}는 AI 영상 프론트엔드 수업에서 학습한 기획, 인터랙션 설계, 반응형 UI 구현,
            배포 과정을 종합해 완성한 프로젝트입니다. 사용자가 콘텐츠를 더 빠르게 이해하고 실행할 수
            있도록 정보 구조와 시각적 흐름을 정교하게 설계했습니다.
          </p>
        </article>

        <aside className="detail-block">
          <p className="eyebrow">Tech Stack</p>
          <h2>사용 기술</h2>
          <div className="skill-list detail">
            {student.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </aside>
      </section>

      <section className="detail-block">
        <p className="eyebrow">Features</p>
        <h2>주요 기능</h2>
        <div className="feature-list">
          {student.features.map((feature) => (
            <div key={feature}>
              <span />
              <strong>{feature}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-block">
        <p className="eyebrow">Gallery</p>
        <h2>프로젝트 스크린샷 갤러리</h2>
        <div className="screenshot-gallery">
          {student.screenshots.map((screenshot, index) => (
            <img src={screenshot} alt={`${student.title} 스크린샷 ${index + 1}`} key={screenshot} />
          ))}
        </div>
      </section>

      <section className="admin-panel glass-panel">
        <div>
          <p className="eyebrow">Admin Mock UI</p>
          <h2>포트폴리오 관리</h2>
        </div>
        <div className="admin-actions detail">
          <button type="button">
            <Edit3 size={16} />
            수정
          </button>
          <button type="button" className="danger">
            <Trash2 size={16} />
            삭제
          </button>
        </div>
      </section>
    </div>
  );
}
