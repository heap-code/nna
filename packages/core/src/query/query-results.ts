/** Range of {@link QueryResultsPagination paginated results} */
export interface QueryResultsPaginationRange {
	/**
	 * Position of the last result returned from the whole filtered data (not included)
	 *
	 * @example
	 * for (let i = range.start; i < range.end; ++i);
	 */
	readonly end: number;
	/** Position of the first result returned from the whole filtered data */
	readonly start: number;
}

/** Pagination of {@link QueryResults} */
export interface QueryResultsPagination {
	/** The range of selected results */
	readonly range: QueryResultsPaginationRange;
	/** Total of items without the limit or the skip */
	readonly total: number;
}

/** Results from a query */
export interface QueryResults<T> {
	/** The data of the results */
	readonly data: T[];
	/** The pagination of the results */
	readonly pagination: QueryResultsPagination;
}
