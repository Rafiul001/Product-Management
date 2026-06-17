import AdminPageHeader from "@/components/molecules/AdminPageHeader";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal";
import FormModal from "@/components/molecules/FormModal";
import PageContainer from "@/components/molecules/PageContainer";
import StatusBadge from "@/components/molecules/StatusBadge";
import UISelectInput from "@/components/molecules/formInputs/UISelectInput";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import { useCategoryStore } from "@/store/categoryStore";
import { useOfferStore } from "@/store/offerStore";
import { useProductStore } from "@/store/productStore";
import { useSubCategoryStore } from "@/store/subCategoryStore";
import type { ISubCategoryResponse } from "@/types/subCategory.types";
import { Button, Checkbox, Label } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TCategoryDocument } from "@shared/models/Category";
import type { TOfferDocument } from "@shared/models/Offer";
import type { TProductDocument } from "@shared/models/Product";
import {
  createOfferValidationSchema,
  updateOfferValidationSchema,
  type TCreateOfferValidationSchema,
  type TUpdateOfferValidationSchema,
} from "@shared/validators/offer.validator";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  useForm,
  type Resolver,
  type UseFormReturn,
} from "react-hook-form";
import { MdLocalOffer } from "react-icons/md";

const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percentage (%)", value: "percentage" },
  { label: "Flat Amount (৳)", value: "flat" },
];

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isOfferActive(offer: TOfferDocument) {
  const now = new Date();
  return (
    offer.isActive &&
    new Date(offer.startDate) <= now &&
    new Date(offer.endDate) >= now
  );
}

type TOfferFormBase = {
  title?: string;
  description?: string;
  badge?: string;
  discountType?: "percentage" | "flat";
  discountValue?: number;
  applicableProducts?: string[];
  startDate?: Date | string;
  endDate?: Date | string;
  isActive?: boolean;
};

const ProductScopePicker: React.FC<{
  selected: string[];
  onChange: (ids: string[]) => void;
  excludedProductIds: string[];
  adminProducts: TProductDocument[];
  categories: TCategoryDocument[];
  subCategories: ISubCategoryResponse[];
}> = ({
  selected,
  onChange,
  excludedProductIds,
  adminProducts,
  categories,
  subCategories,
}) => {
  const [filterCatId, setFilterCatId] = useState<string>("all");
  const [filterSubCatId, setFilterSubCatId] = useState<string>("all");

  const subCatsByCat = useMemo(
    () =>
      subCategories.reduce<Record<string, ISubCategoryResponse[]>>(
        (acc, sc) => {
          const catId = sc.category._id;
          if (!acc[catId]) acc[catId] = [];
          acc[catId]!.push(sc);
          return acc;
        },
        {},
      ),
    [subCategories],
  );

  const subCatIdByProduct = useMemo(() => {
    const map: Record<string, string> = {};
    adminProducts.forEach((p) => {
      const subCat = p.subCategory as unknown as { _id: string };
      map[p._id] = subCat._id;
    });
    return map;
  }, [adminProducts]);

  const subCatIdToCatId = useMemo(() => {
    const map: Record<string, string> = {};
    subCategories.forEach((sc) => {
      map[sc._id] = sc.category._id;
    });
    return map;
  }, [subCategories]);

  const visibleSubCats = useMemo(
    () =>
      filterCatId === "all" ? subCategories : (subCatsByCat[filterCatId] ?? []),
    [filterCatId, subCategories, subCatsByCat],
  );

  const visibleProducts = useMemo(
    () =>
      adminProducts.filter((p) => {
        const subCatId = subCatIdByProduct[p._id];
        if (!subCatId) return false;
        if (filterSubCatId !== "all") return subCatId === filterSubCatId;
        if (filterCatId !== "all")
          return subCatIdToCatId[subCatId] === filterCatId;
        return true;
      }),
    [
      adminProducts,
      filterCatId,
      filterSubCatId,
      subCatIdByProduct,
      subCatIdToCatId,
    ],
  );

  const availableVisible = useMemo(
    () => visibleProducts.filter((p) => !excludedProductIds.includes(p._id)),
    [visibleProducts, excludedProductIds],
  );

  const allVisibleSelected =
    availableVisible.length > 0 &&
    availableVisible.every((p) => selected.includes(p._id));

  const handleCategoryFilter = (catId: string) => {
    setFilterCatId(catId === filterCatId ? "all" : catId);
    setFilterSubCatId("all");
  };

  const handleSubCategoryFilter = (subCatId: string) => {
    setFilterSubCatId(subCatId === filterSubCatId ? "all" : subCatId);
  };

  const handleToggleProduct = (productId: string) => {
    onChange(
      selected.includes(productId)
        ? selected.filter((id) => id !== productId)
        : [...selected, productId],
    );
  };

  const handleSelectAllVisible = () => {
    const ids = availableVisible.map((p) => p._id);
    onChange(
      allVisibleSelected
        ? selected.filter((id) => !ids.includes(id))
        : [...new Set([...selected, ...ids])],
    );
  };

  const filterBtnClass = (active: boolean) =>
    `px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
      active
        ? "bg-primary-500 text-white border-primary-500"
        : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
    }`;

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-sm font-medium block">
        Applicable Products
        {selected.length > 0 && (
          <span className="ml-2 text-xs text-primary-600 font-semibold">
            ({selected.length} selected)
          </span>
        )}
      </Label>

      <div>
        <p className="text-xs text-gray-500 mb-1.5">Filter by Category</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              setFilterCatId("all");
              setFilterSubCatId("all");
            }}
            className={filterBtnClass(filterCatId === "all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => handleCategoryFilter(cat._id)}
              className={filterBtnClass(filterCatId === cat._id)}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {visibleSubCats.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Filter by Sub-category</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setFilterSubCatId("all")}
              className={filterBtnClass(filterSubCatId === "all")}
            >
              All
            </button>
            {visibleSubCats.map((sc) => (
              <button
                key={sc._id}
                type="button"
                onClick={() => handleSubCategoryFilter(sc._id)}
                className={filterBtnClass(filterSubCatId === sc._id)}
              >
                {sc.subCategoryName}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleSelectAllVisible}
          className="text-xs text-primary-600 hover:underline font-medium"
        >
          {allVisibleSelected ? "Deselect all visible" : "Select all visible"}
        </button>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-gray-400 hover:text-danger-500"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="max-h-52 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
        {visibleProducts.length === 0 ? (
          <p className="text-xs text-gray-400 p-3">No products found</p>
        ) : (
          visibleProducts.map((p) => {
            const isExcluded = excludedProductIds.includes(p._id);
            const isSelected = selected.includes(p._id);
            const subCatId = subCatIdByProduct[p._id];
            const subCat = subCategories.find((sc) => sc._id === subCatId);
            return (
              <label
                key={p._id}
                className={`flex items-center gap-2 px-3 py-2 ${
                  isExcluded
                    ? "opacity-50 bg-gray-50 cursor-not-allowed"
                    : "hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isExcluded}
                  onChange={() => handleToggleProduct(p._id)}
                  className="w-4 h-4 shrink-0 rounded accent-primary-500"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-gray-800 font-medium leading-tight truncate">
                    {p.productName}
                  </span>
                  {subCat && (
                    <span className="text-[10px] text-gray-400 leading-tight">
                      {subCat.category.categoryName} › {subCat.subCategoryName}
                      {isExcluded && (
                        <span className="ml-1 text-warning-600 font-medium">
                          · in another offer
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
};

const OfferForm: React.FC<{
  formId: string;
  form: UseFormReturn<TOfferFormBase>;
  onSubmit: (data: TOfferFormBase) => Promise<void>;
  excludedIds: string[];
  adminProducts: TProductDocument[];
  categories: TCategoryDocument[];
  subCategories: ISubCategoryResponse[];
}> = ({
  formId,
  form,
  onSubmit,
  excludedIds,
  adminProducts,
  categories,
  subCategories,
}) => (
  <form
    id={formId}
    onSubmit={form.handleSubmit(onSubmit)}
    className="flex flex-col gap-4"
  >
    <UITextInput
      label="Title *"
      placeholder="e.g. Summer Sale"
      {...form.register("title")}
      error={form.formState.errors.title?.message as string | undefined}
    />
    <UITextInput
      label="Description *"
      placeholder="Short description of the offer"
      {...form.register("description")}
      error={form.formState.errors.description?.message as string | undefined}
    />
    <UITextInput
      label="Badge *"
      placeholder="e.g. SUMMER SALE"
      {...form.register("badge")}
      error={form.formState.errors.badge?.message as string | undefined}
    />
    <div className="grid grid-cols-2 gap-3">
      <Controller
        control={form.control}
        name="discountType"
        render={({ field }) => (
          <UISelectInput
            label="Discount Type *"
            options={DISCOUNT_TYPE_OPTIONS}
            selectedKey={field.value}
            onSelectionChange={(v) =>
              field.onChange(v as "percentage" | "flat")
            }
            error={
              form.formState.errors.discountType?.message as string | undefined
            }
          />
        )}
      />
      <UITextInput
        label="Discount Value *"
        type="number"
        placeholder="e.g. 20"
        {...form.register("discountValue")}
        error={
          form.formState.errors.discountValue?.message as string | undefined
        }
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <UITextInput
        label="Start Date *"
        type="date"
        {...form.register("startDate")}
        error={form.formState.errors.startDate?.message as string | undefined}
      />
      <UITextInput
        label="End Date *"
        type="date"
        {...form.register("endDate")}
        error={form.formState.errors.endDate?.message as string | undefined}
      />
    </div>
    <Controller
      control={form.control}
      name="isActive"
      render={({ field }) => (
        <Checkbox isSelected={!!field.value} onChange={field.onChange}>
          <Checkbox.Control className="w-4 h-4 rounded border-2 border-gray-300 bg-white flex items-center justify-center shrink-0">
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content className="text-sm text-gray-700">
            Active
          </Checkbox.Content>
        </Checkbox>
      )}
    />
    <Controller
      control={form.control}
      name="applicableProducts"
      render={({ field }) => (
        <ProductScopePicker
          selected={(field.value as string[]) ?? []}
          onChange={field.onChange}
          excludedProductIds={excludedIds}
          adminProducts={adminProducts}
          categories={categories}
          subCategories={subCategories}
        />
      )}
    />
    <p className="text-xs text-gray-400">
      Leave products unselected to apply the offer to all products.
    </p>
  </form>
);

const Offers: React.FC = () => {
  const { offers, getAllOffers, createOffer, updateOffer, deleteOffer } =
    useOfferStore();
  const { categories, getAllCategories } = useCategoryStore();
  const { subCategories, getAllSubCategories } = useSubCategoryStore();
  const { adminProducts, getAllProductsAdmin } = useProductStore();

  const [selectedOffer, setSelectedOffer] = useState<TOfferDocument>();
  const [selectedOfferForEdit, setSelectedOfferForEdit] =
    useState<TOfferDocument>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const createForm = useForm<TCreateOfferValidationSchema>({
    resolver: zodResolver(
      createOfferValidationSchema,
    ) as Resolver<TCreateOfferValidationSchema>,
    defaultValues: {
      discountType: "percentage",
      applicableProducts: [],
      isActive: true,
    },
  });

  const updateForm = useForm<TUpdateOfferValidationSchema>({
    resolver: zodResolver(
      updateOfferValidationSchema,
    ) as Resolver<TUpdateOfferValidationSchema>,
  });

  const onCreateSubmit = async (data: TCreateOfferValidationSchema) => {
    await createOffer(data);
    createForm.reset();
    setIsCreateOpen(false);
  };

  const onDeleteConfirm = async () => {
    setIsDeleting(true);
    await deleteOffer(selectedOffer?._id ?? "");
    setIsDeleting(false);
    setSelectedOffer(undefined);
    setIsDeleteOpen(false);
  };

  const onUpdateSubmit = async (data: TUpdateOfferValidationSchema) => {
    if (!selectedOfferForEdit?._id) return;
    await updateOffer(selectedOfferForEdit._id, data);
    setSelectedOfferForEdit(undefined);
    updateForm.reset();
    setIsUpdateOpen(false);
  };

  useEffect(() => {
    if (selectedOfferForEdit) {
      updateForm.reset({
        title: selectedOfferForEdit.title,
        description: selectedOfferForEdit.description,
        badge: selectedOfferForEdit.badge,
        discountType: selectedOfferForEdit.discountType,
        discountValue: selectedOfferForEdit.discountValue,
        applicableProducts:
          selectedOfferForEdit.applicableProducts as unknown as string[],
        startDate: new Date(selectedOfferForEdit.startDate)
          .toISOString()
          .slice(0, 10) as unknown as Date,
        endDate: new Date(selectedOfferForEdit.endDate)
          .toISOString()
          .slice(0, 10) as unknown as Date,
        isActive: selectedOfferForEdit.isActive,
      });
    }
  }, [selectedOfferForEdit, updateForm]);

  useEffect(() => {
    getAllOffers();
    getAllCategories();
    getAllSubCategories();
    getAllProductsAdmin();
  }, [
    getAllOffers,
    getAllCategories,
    getAllSubCategories,
    getAllProductsAdmin,
  ]);

  const productsInOtherOffers = useMemo(() => {
    const editingId = selectedOfferForEdit?._id;
    return offers.flatMap((o) => {
      if (o._id === editingId) return [];
      return o.applicableProducts as unknown as string[];
    });
  }, [offers, selectedOfferForEdit]);

  const allProductsInAnyOffer = useMemo(
    () => offers.flatMap((o) => o.applicableProducts as unknown as string[]),
    [offers],
  );

  const typedAdminProducts = adminProducts as unknown as TProductDocument[];

  return (
    <PageContainer>
      <AdminPageHeader
        title="Offers & Discounts"
        subtitle="Manage discount offers for products"
        actionLabel="Create Offer"
        onAction={() => setIsCreateOpen(true)}
      />

      {offers.length > 0 ? (
        <div className="mt-8 flex flex-col gap-3">
          {offers.map((offer) => {
            const active = isOfferActive(offer);
            return (
              <div
                key={offer._id}
                className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <MdLocalOffer size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">
                        {offer.title}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wide">
                        {offer.badge}
                      </span>
                      <StatusBadge
                        label={active ? "Active" : "Inactive"}
                        variant={active ? "success" : "default"}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                      {offer.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {offer.discountValue}
                      {offer.discountType === "percentage" ? "%" : "৳"} off ·{" "}
                      {formatDate(offer.startDate)} –{" "}
                      {formatDate(offer.endDate)}
                      {offer.applicableProducts.length > 0 && (
                        <>
                          {" "}
                          · {offer.applicableProducts.length} product
                          {offer.applicableProducts.length !== 1 ? "s" : ""}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="secondary"
                    onPress={() => {
                      setSelectedOfferForEdit(offer);
                      setIsUpdateOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger-soft"
                    onPress={() => {
                      setSelectedOffer(offer);
                      setIsDeleteOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <h3 className="text-center mt-30 text-gray-400">
          No offers created yet
        </h3>
      )}

      {/* Create */}
      <FormModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create Offer"
        formId="offer-create-form"
        isSubmitting={createForm.formState.isSubmitting}
        submitLabel="Create"
        scrollable
        onClose={() => createForm.reset()}
      >
        <OfferForm
          formId="offer-create-form"
          form={createForm as UseFormReturn<TOfferFormBase>}
          onSubmit={onCreateSubmit as (data: TOfferFormBase) => Promise<void>}
          excludedIds={allProductsInAnyOffer}
          adminProducts={typedAdminProducts}
          categories={categories}
          subCategories={subCategories}
        />
      </FormModal>

      {/* Update */}
      <FormModal
        isOpen={isUpdateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOfferForEdit(undefined);
            updateForm.reset();
          }
          setIsUpdateOpen(open);
        }}
        title="Update Offer"
        formId="offer-update-form"
        isSubmitting={updateForm.formState.isSubmitting}
        submitLabel="Update"
        scrollable
        onClose={() => {
          setSelectedOfferForEdit(undefined);
          updateForm.reset();
        }}
      >
        {selectedOfferForEdit && (
          <OfferForm
            formId="offer-update-form"
            form={updateForm as UseFormReturn<TOfferFormBase>}
            onSubmit={onUpdateSubmit as (data: TOfferFormBase) => Promise<void>}
            excludedIds={productsInOtherOffers}
            adminProducts={typedAdminProducts}
            categories={categories}
            subCategories={subCategories}
          />
        )}
      </FormModal>

      {/* Delete */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedOffer(undefined);
          setIsDeleteOpen(open);
        }}
        title="Delete Offer"
        message={
          selectedOffer
            ? `Delete offer "${selectedOffer.title}"? This cannot be undone.`
            : null
        }
        onConfirm={onDeleteConfirm}
        isLoading={isDeleting}
      />
    </PageContainer>
  );
};

export default Offers;
