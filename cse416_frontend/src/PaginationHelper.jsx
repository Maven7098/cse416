import Pagination from 'react-bootstrap/Pagination';

function PaginationHelper({ paginate, active, totalPages }) {
	return (
		<div>
			<Pagination>
				{/* Disable First and Prev if 1st item is active */}
				{active <= 1 ?
				<>
				<span onClick={() => paginate(1)}>
					<Pagination.First disabled aria-disabled />
				</span>
				<span onClick={() => paginate(active-1)}>
					<Pagination.Prev disabled aria-disabled />
				</span>
				</> :
				<>
				<span onClick={() => paginate(1)}>
					<Pagination.First />
				</span>
				<span onClick={() => paginate(active-1)}>
					<Pagination.Prev />
				</span>
				</>}
				{active >= 4 && 
				<>
				<span onClick={() => paginate(1)}>
					<Pagination.Item key={1}>{1}</Pagination.Item>
				</span>
				<Pagination.Ellipsis />
				</>}
				
				{active >= 3 && <span onClick={() => paginate(active-2)}><Pagination.Item key={active-2}>{active-2}</Pagination.Item></span> }
				{active >= 2 && <span onClick={() => paginate(active-1)}><Pagination.Item key={active-1}>{active-1}</Pagination.Item></span> }
				<Pagination.Item active key={active} >{active}</Pagination.Item>
				{active + 1 <= totalPages && <span onClick={() => paginate(active+1)}><Pagination.Item key={active+1}>{active+1}</Pagination.Item></span> }
				{active + 2 <= totalPages && <span onClick={() => paginate(active+2)}><Pagination.Item key={active+2}>{active+2}</Pagination.Item></span> }
				
				{active + 3 <= totalPages && <>
					<Pagination.Ellipsis />
					<span onClick={() => paginate(totalPages)}>
					<Pagination.Item key={totalPages}>{totalPages}</Pagination.Item>
				</span>
				</>}

				{active == totalPages ?
				<>
					<span onClick={() => paginate(active+1)}>
					<Pagination.Next disabled aria-disabled />
					</span>
					<span onClick={() => paginate(totalPages)}>
					<Pagination.Last disabled aria-disabled />
					</span>
				</> :
				<>
					<span onClick={() => paginate(active+1)}>
					<Pagination.Next />
					</span>
					<span onClick={() => paginate(totalPages)}>
					<Pagination.Last />
					</span>
				</>}
			</Pagination>
		</div>
	);
}

export default PaginationHelper;