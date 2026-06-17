import { Pagination } from "@heroui/react";
import type React from "react";

type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const TablePagination: React.FC<Props> = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex w-full justify-center mt-4">
      <Pagination>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              onClick={() => onPageChange(Math.max(1, page - 1))}
            >
              {"<"}
            </Pagination.Previous>
          </Pagination.Item>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Pagination.Item key={p}>
              <Pagination.Link
                onClick={() => onPageChange(p)}
                isActive={p === page}
              >
                {p}
              </Pagination.Link>
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Next
              onClick={() => onPageChange(Math.min(pages, page + 1))}
            >
              {">"}
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
};

export default TablePagination;
