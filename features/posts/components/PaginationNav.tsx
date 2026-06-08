import clsx from "clsx";

const PaginationNav = ({ currentPage, totalPages, hasNextPage, hasPreviousPage, onPageChange }: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}) => {

  function range(start: number, end: number) {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  }

  function getPagination(currentPage: number, totalPages: number, options?: {
    siblingCount?: number;
    boundaryCount?: number;
  }) {
    const ELLIPSIS = "..." as const;
    const siblingCount = options?.siblingCount ?? 1;
    const boundaryCount = options?.boundaryCount ?? 1;

    const startPages = range(1, Math.min(boundaryCount, totalPages));
    const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

    const siblingsStart = Math.max(
      Math.min(
        // natural start
        currentPage - siblingCount,
        // max allowed start
        totalPages - boundaryCount - siblingCount * 2 - 1
      ),
      // min allowed start
      boundaryCount + 2
    );

    const siblingsEnd = Math.min(
      Math.max(
        // natural end
        currentPage + siblingCount,
        // min allowed end
        boundaryCount + siblingCount * 2 + 2
      ),
      // max allowed end
      endPages[0] - 2
    )

    return [
      ...startPages,

      ...(siblingsStart > boundaryCount + 2
        ? [ELLIPSIS]
        : boundaryCount + 1 < totalPages - boundaryCount?
        [boundaryCount + 1]
        : []
      ),
      ...range(siblingsStart, siblingsEnd),

      ...(siblingsEnd < totalPages - boundaryCount - 1
        ? [ELLIPSIS]
        : totalPages - boundaryCount > boundaryCount
        ? [totalPages - boundaryCount]
        : []
      ),

      ...endPages
    ] as (number | typeof ELLIPSIS)[];
  }

  function toNextPage() {
    if (currentPage < totalPages)
      onPageChange(currentPage + 1);
  }

  function toPreviousPage() {
    if (currentPage > 1)
      onPageChange(currentPage - 1);
  }
  
  return (
    <div className="flex justify-between items-center p-2.5 font-sans rounded-lg border text-text-2 border-border-2">
      <div className="flex gap-2">
        <button
          className="p-1 w-8 aspect-square rounded-lg border border-border-2 bg-surface hover:text-text hover:bg-surface-2 disabled:text-text-3 disabled:bg-surface"
          disabled={!hasPreviousPage}
          onClick={toPreviousPage}
        >{"<"}</button>
        {getPagination(currentPage, totalPages).map((page, index) => (
          page === "..."
          ? (
            <span key={`${page}-${index}`}
              className="p-1 w-8 aspect-square text-center tracking-widest"
            >...</span>
          )
          : (
            <button
              key={`${page}-${index}`}
              className={clsx(
                "p-1 w-8 aspect-square rounded-lg border",
                currentPage === page? "border-transparent text-black bg-accent": "border-border-2 bg-surface hover:text-text hover:bg-surface-2"
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        ))}
        <button
          className="p-1 w-8 aspect-square rounded-lg border border-border-2 bg-surface hover:text-text hover:bg-surface-2 disabled:text-text-3 disabled:bg-surface"
          disabled={!hasNextPage}
          onClick={toNextPage}
        >{">"}</button>
      </div>
      <div className="mr-5">
        <label htmlFor="page-select">{"Page "}</label>
        <select
          id="page-select"
          value={currentPage}
          onChange={e => onPageChange(Number(e.target.value))}
          className="py-1 px-2 rounded-lg border border-border-2"
        >
          {range(1, totalPages).map(page => (
            <option key={page} value={page}>{page}</option>
          ))}
        </select>
        {` of ${totalPages}`}
      </div>
    </div>
  )
}

export default PaginationNav;