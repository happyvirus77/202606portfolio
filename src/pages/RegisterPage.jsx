import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Image, Link as LinkIcon, Plus, Save } from 'lucide-react';
import { categories, skillOptions } from '../data/students.js';
import SectionHeading from '../components/SectionHeading.jsx';

const DEFAULT_PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80';
const DEFAULT_THUMBNAIL =
  'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_SCREENSHOTS = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
];

const initialForm = {
  name: '',
  intro: '',
  title: '',
  description: '',
  skills: '',
  github: '',
  deployUrl: '',
  mediaUrl: '',
  screenshots: '',
  projectType: '개인 프로젝트',
  categories: ['React'],
  features: '',
};

function createSlug(value, existingIds) {
  const base =
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-+|-+$/g, '') || `portfolio-${Date.now()}`;

  if (!existingIds.has(base)) return base;

  let index = 2;
  while (existingIds.has(`${base}-${index}`)) {
    index += 1;
  }

  return `${base}-${index}`;
}

function splitList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function RegisterPage({ onRegister, students }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const previewSkills = useMemo(() => splitList(form.skills).slice(0, 5), [form.skills]);
  const selectedSkills = useMemo(() => splitList(form.skills), [form.skills]);
  const previewCategories = form.categories.length > 0 ? form.categories : ['React'];
  const isTeamProject = form.projectType === '팀 프로젝트';

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleCategory = (category) => {
    setForm((current) => {
      const selected = current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category];

      return {
        ...current,
        categories: selected.length > 0 ? selected : ['React'],
      };
    });
  };

  const toggleSkill = (skill) => {
    setForm((current) => {
      const currentSkills = splitList(current.skills);
      const nextSkills = currentSkills.includes(skill)
        ? currentSkills.filter((item) => item !== skill)
        : [...currentSkills, skill];

      return {
        ...current,
        skills: nextSkills.join(', '),
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!form.name.trim() || !form.title.trim() || !form.description.trim() || !form.skills.trim()) {
      return;
    }

    const screenshots = splitList(form.screenshots);
    const existingIds = new Set(students.map((student) => student.id));
    const id = createSlug(`${form.name}-${form.title}`, existingIds);

    const newPortfolio = {
      id,
      name: form.name.trim(),
      profileImage: DEFAULT_PROFILE_IMAGE,
      title: form.title.trim(),
      description: form.description.trim(),
      intro: form.intro.trim() || '새로운 아이디어를 웹 경험으로 구현하는 프론트엔드 개발자',
      skills: splitList(form.skills),
      github: form.github.trim() || 'https://github.com/example/new-portfolio',
      deployUrl: form.deployUrl.trim() || 'https://example.com/new-portfolio',
      category: previewCategories,
      thumbnail: isTeamProject ? DEFAULT_THUMBNAIL : form.mediaUrl.trim() || DEFAULT_THUMBNAIL,
      ...(isTeamProject ? { videoUrl: form.mediaUrl.trim() } : {}),
      screenshots: screenshots.length > 0 ? screenshots : DEFAULT_SCREENSHOTS,
      likes: 0,
      views: 0,
      projectType: form.projectType,
      features: splitList(form.features).length > 0 ? splitList(form.features) : ['반응형 UI', '검색 친화적 정보 구조', '프로젝트 상세 페이지', '배포 링크 연결'],
    };

    onRegister(newPortfolio);
    navigate(`/portfolio/${id}`);
  };

  return (
    <div className="page register-page">
      <button type="button" className="back-link plain-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        이전으로 돌아가기
      </button>

      <section className="register-layout">
        <div className="register-copy">
          <SectionHeading
            eyebrow="Register"
            title="새 포트폴리오 등록"
            description="학생 프로젝트 정보를 입력하면 아카이브 목록과 상세 페이지에 바로 반영됩니다. 입력값은 브라우저 localStorage에 저장됩니다."
          />

          <div className="register-guide glass-panel">
            <span>
              <Check size={17} />
              필수 입력
            </span>
            <p>이름, 프로젝트 제목, 설명, 기술 스택은 반드시 입력해야 합니다.</p>
          </div>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-grid two-columns">
            <label>
              학생 이름
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="예: 김하린"
              />
              {submitted && !form.name.trim() && <small>이름을 입력해주세요.</small>}
            </label>

            <label>
              프로젝트 유형
              <select value={form.projectType} onChange={(event) => updateField('projectType', event.target.value)}>
                <option>개인 프로젝트</option>
                <option>팀 프로젝트</option>
              </select>
            </label>
          </div>

          <label>
            한 줄 소개
            <input
              value={form.intro}
              onChange={(event) => updateField('intro', event.target.value)}
              placeholder="예: AI와 인터랙션을 연결하는 프론트엔드 개발자"
            />
          </label>

          <label>
            프로젝트 제목
            <input
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="예: AI Video Script Studio"
            />
            {submitted && !form.title.trim() && <small>프로젝트 제목을 입력해주세요.</small>}
          </label>

          <label>
            프로젝트 설명
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="프로젝트가 해결하는 문제와 핵심 경험을 간단히 적어주세요."
              rows="4"
            />
            {submitted && !form.description.trim() && <small>프로젝트 설명을 입력해주세요.</small>}
          </label>

          <label>
            사용 기술 스택
            <input
              value={form.skills}
              onChange={(event) => updateField('skills', event.target.value)}
              placeholder="React, Vite, OpenAI API, REST API"
            />
            {submitted && !form.skills.trim() && <small>기술 스택을 쉼표로 구분해 입력해주세요.</small>}
          </label>

          <div className="form-field">
            <span className="form-label">기술 스택 선택</span>
            <div className="skill-picker">
              {skillOptions.map((skill) => (
                <button
                  className={selectedSkills.includes(skill) ? 'category-chip active' : 'category-chip'}
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <span className="form-label">카테고리</span>
            <div className="category-filter register">
              {categories
                .filter((category) => category !== '전체')
                .map((category) => (
                  <button
                    className={form.categories.includes(category) ? 'category-chip active' : 'category-chip'}
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </button>
                ))}
            </div>
          </div>

          <div className="form-grid two-columns">
            <label>
              GitHub 링크
              <input
                value={form.github}
                onChange={(event) => updateField('github', event.target.value)}
                placeholder="https://github.com/..."
              />
            </label>

            <label>
              배포 링크
              <input
                value={form.deployUrl}
                onChange={(event) => updateField('deployUrl', event.target.value)}
                placeholder="https://..."
              />
            </label>
          </div>

          <label>
            {isTeamProject ? '대표영상 URL' : '대표 이미지 URL'}
            <input
              value={form.mediaUrl}
              onChange={(event) => updateField('mediaUrl', event.target.value)}
              placeholder={isTeamProject ? '팀프로젝트 대표영상 URL을 입력하세요.' : '비워두면 기본 이미지가 적용됩니다.'}
            />
          </label>

          <label>
            스크린샷 URL
            <textarea
              value={form.screenshots}
              onChange={(event) => updateField('screenshots', event.target.value)}
              placeholder="이미지 URL을 쉼표로 구분해 입력하세요."
              rows="3"
            />
          </label>

          <label>
            주요 기능
            <textarea
              value={form.features}
              onChange={(event) => updateField('features', event.target.value)}
              placeholder="AI 추천, 영상 타임라인, 대시보드, 반응형 UI"
              rows="3"
            />
          </label>

          <div className="form-actions">
            <button type="button" className="ghost-button large" onClick={() => setForm(initialForm)}>
              초기화
            </button>
            <button type="submit" className="primary-button large">
              <Save size={18} />
              등록하기
            </button>
          </div>
        </form>

        <aside className="register-preview">
          <div className="preview-card glass-panel">
            <div className="preview-image">
              {isTeamProject && form.mediaUrl ? (
                <video src={form.mediaUrl} muted playsInline controls />
              ) : form.mediaUrl ? (
                <img src={form.mediaUrl} alt="대표 이미지 미리보기" />
              ) : (
                <Image size={34} />
              )}
            </div>
            <p className="eyebrow">{previewCategories.join(' / ')}</p>
            <h2>{form.title || '프로젝트 제목'}</h2>
            <p>{form.description || '프로젝트 설명이 이곳에 표시됩니다.'}</p>
            <div className="skill-list">
              {(previewSkills.length > 0 ? previewSkills : ['React', 'AI', 'Design']).map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <div className="preview-links">
              <span>
                <LinkIcon size={15} />
                GitHub
              </span>
              <span>
                <Plus size={15} />
                Deploy
              </span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
