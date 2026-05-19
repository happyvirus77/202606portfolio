import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Image, Link as LinkIcon, Plus, Save } from 'lucide-react';
import { categories, skillOptions } from '../data/students.js';
import SectionHeading from '../components/SectionHeading.jsx';
import NotFoundPage from './NotFoundPage.jsx';

function splitList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toForm(student) {
  return {
    name: student.teamName || student.name,
    intro: student.intro,
    title: student.title,
    description: student.description,
    skills: student.skills.join(', '),
    github: student.github,
    deployUrl: student.deployUrl,
    mediaUrl: student.videoUrl || student.thumbnail,
    screenshots: student.screenshots.join(', '),
    projectType: student.projectType,
    categories: student.category,
    features: student.features.join(', '),
  };
}

export default function EditPage({ students, onUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = students.find((item) => item.id === id);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(() => (student ? toForm(student) : null));

  const previewSkills = useMemo(() => splitList(form?.skills || '').slice(0, 5), [form?.skills]);
  const selectedSkills = useMemo(() => splitList(form?.skills || ''), [form?.skills]);
  const previewCategories = form?.categories?.length > 0 ? form.categories : ['React'];

  if (!student || !form) {
    return <NotFoundPage />;
  }

  const isTeamProject = student.projectType === '팀 프로젝트';
  const nameLabel = isTeamProject ? '팀명' : '학생 이름';

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

    const updatedPortfolio = {
      ...student,
      name: form.name.trim(),
      ...(isTeamProject ? { teamName: form.name.trim() } : {}),
      intro: form.intro.trim() || student.intro,
      title: form.title.trim(),
      description: form.description.trim(),
      skills: splitList(form.skills),
      github: form.github.trim() || student.github,
      deployUrl: form.deployUrl.trim() || student.deployUrl,
      category: previewCategories,
      thumbnail: isTeamProject ? student.thumbnail : form.mediaUrl.trim() || student.thumbnail,
      ...(isTeamProject ? { videoUrl: form.mediaUrl.trim() || student.videoUrl } : {}),
      screenshots: splitList(form.screenshots).length > 0 ? splitList(form.screenshots) : student.screenshots,
      projectType: form.projectType,
      features: splitList(form.features).length > 0 ? splitList(form.features) : student.features,
    };

    onUpdate(updatedPortfolio);
    navigate(`/portfolio/${student.id}`);
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
            eyebrow="Edit"
            title="포트폴리오 수정"
            description="전체 포트폴리오 카드에서 선택한 프로젝트 정보를 수정합니다. 저장하면 목록과 상세 페이지에 즉시 반영됩니다."
          />

          <div className="register-guide glass-panel">
            <span>
              <Check size={17} />
              편집 중
            </span>
            <p>
              {isTeamProject ? student.teamName || student.name : student.name}
              {isTeamProject ? ' 팀의' : '님의'} 포트폴리오 데이터를 수정하고 있습니다.
            </p>
          </div>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-grid two-columns">
            <label>
              {nameLabel}
              <input value={form.name} onChange={(event) => updateField('name', event.target.value)} />
              {submitted && !form.name.trim() && <small>{nameLabel}을 입력해주세요.</small>}
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
            <input value={form.intro} onChange={(event) => updateField('intro', event.target.value)} />
          </label>

          <label>
            프로젝트 제목
            <input value={form.title} onChange={(event) => updateField('title', event.target.value)} />
            {submitted && !form.title.trim() && <small>프로젝트 제목을 입력해주세요.</small>}
          </label>

          <label>
            프로젝트 설명
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              rows="4"
            />
            {submitted && !form.description.trim() && <small>프로젝트 설명을 입력해주세요.</small>}
          </label>

          <label>
            사용 기술 스택
            <input value={form.skills} onChange={(event) => updateField('skills', event.target.value)} />
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
              <input value={form.github} onChange={(event) => updateField('github', event.target.value)} />
            </label>

            <label>
              배포 링크
              <input value={form.deployUrl} onChange={(event) => updateField('deployUrl', event.target.value)} />
            </label>
          </div>

          <label>
            {isTeamProject ? '대표영상 URL' : '대표 이미지 URL'}
            <input value={form.mediaUrl} onChange={(event) => updateField('mediaUrl', event.target.value)} />
          </label>

          <label>
            스크린샷 URL
            <textarea
              value={form.screenshots}
              onChange={(event) => updateField('screenshots', event.target.value)}
              rows="3"
            />
          </label>

          <label>
            주요 기능
            <textarea value={form.features} onChange={(event) => updateField('features', event.target.value)} rows="3" />
          </label>

          <div className="form-actions">
            <button type="button" className="ghost-button large" onClick={() => setForm(toForm(student))}>
              되돌리기
            </button>
            <button type="submit" className="primary-button large">
              <Save size={18} />
              수정 저장
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
