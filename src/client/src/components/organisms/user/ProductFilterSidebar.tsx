import type { ISubCategoryResponse } from "@/types/subCategory.types";
import { Accordion, Button, Checkbox, Label, Slider } from "@heroui/react";
import type { TCategoryDocument } from "@shared/models/Category";
import type { TOfferDocument } from "@shared/models/Offer";
import type React from "react";

export type GroupedCategory = {
  category: TCategoryDocument;
  subCategories: ISubCategoryResponse[];
};

type Props = {
  filtersOpen: boolean;
  onClose: () => void;
  activeOffers: TOfferDocument[];
  selectedOfferId: string;
  onOfferToggle: (id: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: number | number[]) => void;
  onPriceRangeChangeEnd: (value: number | number[]) => void;
  minInput: string;
  maxInput: string;
  setMinInput: (v: string) => void;
  setMaxInput: (v: string) => void;
  onPriceInputApply: (which: "min" | "max", value: string) => void;
  inStock: boolean;
  onInStockToggle: () => void;
  grouped: GroupedCategory[];
  selectedSubCategories: string[];
  onCategoryToggle: (id: string) => void;
  onSubCategoryToggle: (id: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

const ProductFilterSidebar: React.FC<Props> = ({
  filtersOpen,
  onClose,
  activeOffers,
  selectedOfferId,
  onOfferToggle,
  priceRange,
  onPriceRangeChange,
  onPriceRangeChangeEnd,
  minInput,
  maxInput,
  setMinInput,
  setMaxInput,
  onPriceInputApply,
  inStock,
  onInStockToggle,
  grouped,
  selectedSubCategories,
  onCategoryToggle,
  onSubCategoryToggle,
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
    <>
      {filtersOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 p-5 flex flex-col gap-6
          transform transition-transform duration-200
          ${filtersOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:w-64 md:translate-x-0 md:shrink-0 md:transition-none
        `}
      >
        <div className="flex items-center justify-between md:hidden">
          <span className="text-sm font-semibold text-gray-700">Filters</span>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-gray-600"
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        {activeOffers.length > 0 && (
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
              Offers & Deals
            </Label>
            <div className="flex flex-col gap-1.5">
              {activeOffers.map((offer) => (
                <Checkbox
                  key={offer._id}
                  isSelected={selectedOfferId === offer._id}
                  onChange={() => onOfferToggle(offer._id)}
                >
                  <Checkbox.Control className="w-4 h-4 rounded border-2 border-gray-300 bg-white flex items-center justify-center shrink-0">
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Content className="text-xs text-gray-700 flex flex-col">
                    <span className="font-medium">{offer.title}</span>
                    <span className="text-gray-400">
                      {offer.discountValue}
                      {offer.discountType === "percentage" ? "%" : "৳"} off
                    </span>
                  </Checkbox.Content>
                </Checkbox>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
            Price
          </Label>
          <Slider
            className="w-full"
            value={priceRange}
            onChange={onPriceRangeChange}
            onChangeEnd={onPriceRangeChangeEnd}
            maxValue={200000}
            minValue={0}
            step={10}
          >
            <Slider.Track>
              {({ state }) => (
                <>
                  <Slider.Fill />
                  {state.values.map((_, i) => (
                    <Slider.Thumb key={i} index={i} />
                  ))}
                </>
              )}
            </Slider.Track>
          </Slider>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Min</label>
              <input
                type="number"
                min={0}
                max={200000}
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                onBlur={(e) => onPriceInputApply("min", e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && onPriceInputApply("min", minInput)
                }
                className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-primary-400 text-center"
              />
            </div>
            <span className="text-gray-300 mt-4">—</span>
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Max</label>
              <input
                type="number"
                min={0}
                max={200000}
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                onBlur={(e) => onPriceInputApply("max", e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && onPriceInputApply("max", maxInput)
                }
                className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-primary-400 text-center"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
            Availability
          </Label>
          <Checkbox isSelected={inStock} onChange={onInStockToggle}>
            <Checkbox.Control className="w-4 h-4 rounded border-2 border-gray-300 bg-white flex items-center justify-center shrink-0">
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content className="text-sm text-gray-700">
              In Stock Only
            </Checkbox.Content>
          </Checkbox>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Categories
          </Label>
          {grouped.length === 0 ? (
            <p className="text-xs text-gray-400">No categories available</p>
          ) : (
            <Accordion allowsMultipleExpanded hideSeparator>
              {grouped.map(({ category, subCategories: subs }) => {
                const subIds = subs.map((s) => s._id);
                const selectedCount = subIds.filter((id) =>
                  selectedSubCategories.includes(id),
                ).length;
                const isAllSelected =
                  subIds.length > 0 && selectedCount === subIds.length;
                const isIndeterminate =
                  selectedCount > 0 && selectedCount < subIds.length;

                return (
                  <Accordion.Item key={category._id} id={category._id}>
                    <Accordion.Heading>
                      <Accordion.Trigger className="flex items-center justify-between py-1.5 text-sm font-medium text-gray-800 w-full">
                        {category.categoryName}
                        <Accordion.Indicator />
                      </Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                      <div className="ml-4 mb-2 flex flex-col gap-1.5">
                        <Checkbox
                          isSelected={isAllSelected}
                          isIndeterminate={isIndeterminate}
                          onChange={() => onCategoryToggle(category._id)}
                        >
                          <Checkbox.Control className="w-4 h-4 rounded border-2 border-gray-300 bg-white flex items-center justify-center shrink-0">
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Content className="text-xs font-medium text-gray-700">
                            All
                          </Checkbox.Content>
                        </Checkbox>
                        {subs.map((sub) => (
                          <Checkbox
                            key={sub._id}
                            isSelected={selectedSubCategories.includes(sub._id)}
                            onChange={() => onSubCategoryToggle(sub._id)}
                          >
                            <Checkbox.Control className="w-4 h-4 rounded border-2 border-gray-300 bg-white flex items-center justify-center shrink-0">
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                            <Checkbox.Content className="text-xs text-gray-600">
                              {sub.subCategoryName}
                            </Checkbox.Content>
                          </Checkbox>
                        ))}
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onPress={onClearFilters}
            className="w-full text-sm text-gray-500"
          >
            Clear Filters
          </Button>
        )}
      </aside>
    </>
  );
};

export default ProductFilterSidebar;
