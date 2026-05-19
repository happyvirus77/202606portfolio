export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination" aria-label="페이지네이션">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          className={page === currentPage ? 'active' : ''}
          onClick={() => onChange(page)}
          aria-label={`${page}페이지로 이동`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
