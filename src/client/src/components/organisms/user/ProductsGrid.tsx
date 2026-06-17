import EmptyState from "@/components/molecules/EmptyState";
import { Button, Spinner } from "@heroui/react";
import type React from "react";
import ProductItem, { type PopulatedProduct } from "./ProductItem";

type Pagination = {
  page: number;
  totalPages: number;
  total: number;
};

type Props = {
  isLoading: boolean;
  products: PopulatedProduct[];
  pagination: Pagination;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
};

const ProductsGrid: React.FC<Props> = ({
  isLoading,
  products,
  pagination,
  hasActiveFilters,
  onClearFilters,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<span className="text-3xl">🔍</span>}
        title="No products found"
        description="Try adjusting your filters or search term"
        className="flex-1 py-24"
        action={
          hasActiveFilters ? (
            <Button variant="ghost" onPress={onClearFilters} className="mt-1">
              Clear all filters
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="secondary"
            isDisabled={pagination.page <= 1}
            onPress={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500 px-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            isDisabled={pagination.page >= pagination.totalPages}
            onPress={() => onPageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductsGrid;
