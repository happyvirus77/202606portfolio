import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page not-found">
      <p className="eyebrow">404</p>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>요청한 포트폴리오가 없거나 주소가 변경되었습니다.</p>
      <Link to="/" className="primary-button">
        홈으로 이동
      </Link>
    </div>
  );
}
