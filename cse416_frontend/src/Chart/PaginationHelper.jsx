import Pagination from "react-bootstrap/Pagination";

function PaginationHelper({ paginate, active, totalPages }) {
  return (
    <div>
      <Pagination>
        {/* Disable First and Prev if 1st item is active */}
        {active <= 1 ? (
          <>
            <Pagination.First disabled aria-disabled />
            <Pagination.Prev disabled aria-disabled />
          </>
        ) : (
          <>
            <Pagination.First onClick={() => paginate(1)} />
            <Pagination.Prev onClick={() => paginate(active - 1)} />
          </>
        )}
        {active >= 4 && (
          <>
            <Pagination.Item key={1} onClick={() => paginate(1)}>
              {1}
            </Pagination.Item>
            <Pagination.Ellipsis />
          </>
        )}

        {active >= 3 && (
          <Pagination.Item
            key={active - 2}
            onClick={() => paginate(active - 2)}
          >
            {active - 2}
          </Pagination.Item>
        )}
        {active >= 2 && (
          <Pagination.Item
            key={active - 1}
            onClick={() => paginate(active - 1)}
          >
            {active - 1}
          </Pagination.Item>
        )}
        <Pagination.Item active key={active}>
          {active}
        </Pagination.Item>
        {active + 1 <= totalPages && (
          <Pagination.Item
            key={active + 1}
            onClick={() => paginate(active + 1)}
          >
            {active + 1}
          </Pagination.Item>
        )}
        {active + 2 <= totalPages && (
          <Pagination.Item
            key={active + 2}
            onClick={() => paginate(active + 2)}
          >
            {active + 2}
          </Pagination.Item>
        )}

        {active + 3 <= totalPages && (
          <>
            <Pagination.Ellipsis />
            <Pagination.Item
              key={totalPages}
              onClick={() => paginate(totalPages)}
            >
              {totalPages}
            </Pagination.Item>
          </>
        )}

        {active == totalPages ? (
          <>
            <Pagination.Next disabled aria-disabled />
            <Pagination.Last disabled aria-disabled />
          </>
        ) : (
          <>
            <Pagination.Next onClick={() => paginate(active + 1)} />
            <Pagination.Last onClick={() => paginate(totalPages)} />
          </>
        )}
      </Pagination>
    </div>
  );
}

export default PaginationHelper;
