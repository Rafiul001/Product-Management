import type { TProductQueryParams } from "@/api/productApi";
import ProductFilterSidebar, {
  type GroupedCategory,
} from "@/components/organisms/user/ProductFilterSidebar";
import type { PopulatedProduct } from "@/components/organisms/user/ProductItem";
import ProductsGrid from "@/components/organisms/user/ProductsGrid";
import ProductTopBar from "@/components/organisms/user/ProductTopBar";
import { useCategoryStore } from "@/store/categoryStore";
import { useOfferStore } from "@/store/offerStore";
import { useProductStore } from "@/store/productStore";
import { useSubCategoryStore } from "@/store/subCategoryStore";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

const SORT_OPTIONS = [
  { key: "productName_asc", label: "Name A–Z" },
  { key: "productName_desc", label: "Name Z–A" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
  { key: "category_asc", label: "Category A–Z" },
  { key: "category_desc", label: "Category Z–A" },
];

const AllProducts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, productsPagination, getAllProducts } = useProductStore();
  const [loadedParamsKey, setLoadedParamsKey] = useState("__initial__");
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0,
    searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : 200000,
  ]);
  const [minInput, setMinInput] = useState(searchParams.get("minPrice") ?? "0");
  const [maxInput, setMaxInput] = useState(
    searchParams.get("maxPrice") ?? "200000",
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { categories, getAllCategories } = useCategoryStore();
  const { subCategories, getAllSubCategories } = useSubCategoryStore();
  const { activeOffers, getActiveOffers } = useOfferStore();

  const selectedSubCategories =
    searchParams.get("subCategories")?.split(",").filter(Boolean) ?? [];
  const inStock = searchParams.get("inStock") === "true";
  const selectedOfferId = searchParams.get("offerId") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "productName";
  const sortOrder = searchParams.get("sortOrder") ?? "asc";
  const sortValue = `${sortBy}_${sortOrder}`;
  const paramsKey = searchParams.toString();
  const isLoading = paramsKey !== loadedParamsKey;

  useEffect(() => {
    getAllCategories();
    getAllSubCategories();
    getActiveOffers();
  }, [getAllCategories, getAllSubCategories, getActiveOffers]);

  useEffect(() => {
    let cancelled = false;
    const key = searchParams.toString();

    const params: TProductQueryParams = {
      search: searchParams.get("search") || undefined,
      categories: searchParams.get("categories") || undefined,
      subCategories: searchParams.get("subCategories") || undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      inStock: inStock || undefined,
      offerId: searchParams.get("offerId") || undefined,
      sortBy:
        (searchParams.get("sortBy") as TProductQueryParams["sortBy"]) ||
        undefined,
      sortOrder:
        (searchParams.get("sortOrder") as TProductQueryParams["sortOrder"]) ||
        undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: 12,
    };

    getAllProducts(params).then(() => {
      if (!cancelled) setLoadedParamsKey(key);
    });

    return () => {
      cancelled = true;
    };
  }, [searchParams, getAllProducts, inStock]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set("search", value);
        else next.delete("search");
        next.delete("page");
        return next;
      });
    }, 400);
  };

  const grouped: GroupedCategory[] = categories
    .map((cat) => ({
      category: cat,
      subCategories: subCategories.filter((sc) => sc.category._id === cat._id),
    }))
    .filter((g) => g.subCategories.length > 0);

  const handleCategoryToggle = (categoryId: string) => {
    const group = grouped.find((g) => g.category._id === categoryId);
    const subIds = group?.subCategories.map((s) => s._id) ?? [];
    const allSelected = subIds.every((id) =>
      selectedSubCategories.includes(id),
    );

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const newSubs = allSelected
        ? selectedSubCategories.filter((s) => !subIds.includes(s))
        : [...new Set([...selectedSubCategories, ...subIds])];
      if (newSubs.length) next.set("subCategories", newSubs.join(","));
      else next.delete("subCategories");
      next.delete("categories");
      next.delete("page");
      return next;
    });
  };

  const handleSubCategoryToggle = (id: string) => {
    const next = selectedSubCategories.includes(id)
      ? selectedSubCategories.filter((s) => s !== id)
      : [...selectedSubCategories, id];
    setSearchParams((prev) => {
      const n = new URLSearchParams(prev);
      if (next.length) n.set("subCategories", next.join(","));
      else n.delete("subCategories");
      n.delete("page");
      return n;
    });
  };

  const handleInStockToggle = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!inStock) next.set("inStock", "true");
      else next.delete("inStock");
      next.delete("page");
      return next;
    });
  };

  const handlePriceRangeChange = (value: number | number[]) => {
    const [min, max] = value as number[];
    setPriceRange([min, max]);
    setMinInput(String(min));
    setMaxInput(String(max));
  };

  const handlePriceRangeChangeEnd = (value: number | number[]) => {
    const [min, max] = value as number[];
    applyPriceParams(min, max);
  };

  const applyPriceParams = (min: number, max: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (min > 0) next.set("minPrice", String(min));
      else next.delete("minPrice");
      if (max < 200000) next.set("maxPrice", String(max));
      else next.delete("maxPrice");
      next.delete("page");
      return next;
    });
  };

  const handlePriceInputApply = (which: "min" | "max", raw: string) => {
    const parsed = Number(raw);
    if (isNaN(parsed)) return;
    const [curMin, curMax] = priceRange;
    const min =
      which === "min" ? Math.max(0, Math.min(parsed, curMax)) : curMin;
    const max =
      which === "max" ? Math.min(200000, Math.max(parsed, curMin)) : curMax;
    setPriceRange([min, max]);
    setMinInput(String(min));
    setMaxInput(String(max));
    applyPriceParams(min, max);
  };

  const handleSortChange = (value: string) => {
    const sep = value.lastIndexOf("_");
    const newSortBy = value.slice(0, sep);
    const newSortOrder = value.slice(sep + 1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("sortBy", newSortBy);
      next.set("sortOrder", newSortOrder);
      next.delete("page");
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
  };

  const handleOfferToggle = (offerId: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (selectedOfferId === offerId) next.delete("offerId");
      else next.set("offerId", offerId);
      next.delete("page");
      return next;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput("");
    setPriceRange([0, 200000]);
    setMinInput("0");
    setMaxInput("200000");
  };

  const hasActiveFilters =
    selectedSubCategories.length > 0 ||
    !!searchParams.get("minPrice") ||
    !!searchParams.get("maxPrice") ||
    !!searchParams.get("search") ||
    !!selectedOfferId ||
    inStock;

  return (
    <div className="max-w-7xl mx-auto flex min-h-screen">
      <ProductFilterSidebar
        filtersOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        activeOffers={activeOffers}
        selectedOfferId={selectedOfferId}
        onOfferToggle={handleOfferToggle}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        onPriceRangeChangeEnd={handlePriceRangeChangeEnd}
        minInput={minInput}
        maxInput={maxInput}
        setMinInput={setMinInput}
        setMaxInput={setMaxInput}
        onPriceInputApply={handlePriceInputApply}
        inStock={inStock}
        onInStockToggle={handleInStockToggle}
        grouped={grouped}
        selectedSubCategories={selectedSubCategories}
        onCategoryToggle={handleCategoryToggle}
        onSubCategoryToggle={handleSubCategoryToggle}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      <div className="flex-1 flex flex-col p-4 md:p-6 gap-4 min-w-0">
        <ProductTopBar
          onFilterOpen={() => setFiltersOpen(true)}
          hasActiveFilters={hasActiveFilters}
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          sortValue={sortValue}
          onSortChange={handleSortChange}
          sortOptions={SORT_OPTIONS}
        />

        {!isLoading && (
          <p className="text-sm text-gray-400">
            {productsPagination.total} product
            {productsPagination.total !== 1 ? "s" : ""} found
          </p>
        )}

        <ProductsGrid
          isLoading={isLoading}
          products={products as unknown as PopulatedProduct[]}
          pagination={productsPagination}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AllProducts;
