export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

  return (
    <div className="pagination">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Trước
      </button>
      <span>
        Trang {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Sau
      </button>
    </div>
  );
}
