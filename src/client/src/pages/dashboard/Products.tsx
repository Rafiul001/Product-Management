import AdminPageHeader from "@/components/molecules/AdminPageHeader";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal";
import FormModal from "@/components/molecules/FormModal";
import PageContainer from "@/components/molecules/PageContainer";
import UIFileInput from "@/components/molecules/formInputs/UIFileInput";
import UINumberInput from "@/components/molecules/formInputs/UINumberInput";
import UISelectInput from "@/components/molecules/formInputs/UISelectInput";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import { useNewArrivalStore } from "@/store/newArrivalStore";
import { useProductStore } from "@/store/productStore";
import { useSubCategoryStore } from "@/store/subCategoryStore";
import { Card, Text } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TProductDocument } from "@shared/models/Product";
import {
  createProductValidationSchema,
  updateProductValidationSchema,
  type TCreateProductValidationSchema,
  type TUpdateProductValidationSchema,
} from "@shared/validators/product.validator";
import type React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

type StatusFilter = "all" | "active" | "inactive";

const Products: React.FC = () => {
  const {
    adminProducts: products,
    adminProductsPagination,
    getAllProductsAdmin,
    createProduct,
    updateProductById,
    deleteProductById,
  } = useProductStore();

  const { subCategories } = useSubCategoryStore();

  const {
    newArrivalProductIds,
    getAllNewArrivals,
    addNewArrival,
    removeNewArrival,
  } = useNewArrivalStore();

  const [selectedProduct, setSelectedProduct] = useState<TProductDocument>();
  const [selectedProductForEdit, setSelectedProductForEdit] =
    useState<TProductDocument>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [newArrivalFilter, setNewArrivalFilter] = useState(false);
  const [page, setPage] = useState(1);

  const createForm = useForm({
    resolver: zodResolver(createProductValidationSchema),
  });

  const updateForm = useForm({
    resolver: zodResolver(updateProductValidationSchema),
  });

  const subCategoryOptions = subCategories.map((sc) => ({
    label: sc.subCategoryName,
    value: sc._id ?? "",
  }));

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Server-side fetch
  useEffect(() => {
    getAllProductsAdmin({
      search: debouncedSearch || undefined,
      page,
      limit: 8,
      ...(statusFilter !== "all"
        ? {
            productStatus: (statusFilter === "active" ? "true" : "false") as
              | "true"
              | "false",
          }
        : {}),
      ...(newArrivalFilter ? { newArrivalOnly: true } : {}),
    });
  }, [
    page,
    debouncedSearch,
    statusFilter,
    newArrivalFilter,
    getAllProductsAdmin,
  ]);

  const onCreateSubmit = async (data: TCreateProductValidationSchema) => {
    await createProduct(data);
    createForm.reset();
    setIsCreateOpen(false);
  };

  const onDeleteConfirm = async () => {
    setIsDeleting(true);
    await deleteProductById(selectedProduct?._id ?? "");
    setIsDeleting(false);
    setSelectedProduct(undefined);
    setIsDeleteOpen(false);
  };

  const onUpdateSubmit = async (data: TUpdateProductValidationSchema) => {
    if (!selectedProductForEdit?._id) return;
    await updateProductById(selectedProductForEdit._id, data);
    setSelectedProductForEdit(undefined);
    updateForm.reset();
    setIsUpdateOpen(false);
  };

  useEffect(() => {
    getAllNewArrivals();
  }, [getAllNewArrivals]);

  useEffect(() => {
    if (selectedProductForEdit) {
      updateForm.reset({
        description: selectedProductForEdit.description,
        price: selectedProductForEdit.price,
        productImage: undefined,
        productName: selectedProductForEdit.productName,
        productStatus: selectedProductForEdit.productStatus,
        stockLimit: selectedProductForEdit.stockLimit,
        subCategory: selectedProductForEdit.subCategory._id.toString(),
      });
    }
  }, [selectedProductForEdit, updateForm]);

  const statusTabs: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <PageContainer>
      <AdminPageHeader
        title="Products"
        subtitle="Manage products"
        actionLabel="Create"
        onAction={() => setIsCreateOpen(true)}
      />

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                statusFilter === tab.value
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setNewArrivalFilter((v) => !v);
            setPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
            newArrivalFilter
              ? "bg-primary-500 text-white border-primary-500"
              : "bg-white text-gray-500 border-gray-200 hover:border-primary-300 hover:text-primary-600"
          }`}
        >
          New Arrivals
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-3 mb-1">
        {adminProductsPagination.total} products found
      </p>

      {products.length > 0 ? (
        <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-2">
          {products.map((item) => {
            const isNewArrival = newArrivalProductIds.has(item._id ?? "");
            return (
              <Card
                key={item._id}
                className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    alt={item.productName}
                    src={item.productImage}
                    className="h-44 object-cover w-full"
                  />
                  {/* Status badge */}
                  <span
                    className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.productStatus
                        ? "bg-success-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {item.productStatus ? "Active" : "Inactive"}
                  </span>
                  {/* New arrival badge */}
                  {isNewArrival && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-500 text-white">
                      New Arrival
                    </span>
                  )}
                </div>

                {/* Info */}
                <Card.Content className="px-3 py-3">
                  <p className="font-semibold text-gray-800 text-sm leading-tight line-clamp-1">
                    {item.productName}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">৳{item.price}</p>
                </Card.Content>

                {/* Actions */}
                <Card.Footer className="px-3 pb-3 pt-0 flex flex-col gap-2 w-full">
                  {/* Toggle row */}
                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!item._id) return;
                        await updateProductById(item._id, {
                          productStatus: !item.productStatus,
                        });
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        item.productStatus
                          ? "bg-success-50 text-success-700 hover:bg-success-100 border border-success-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      {item.productStatus ? "Active" : "Inactive"}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!item._id) return;
                        if (isNewArrival) {
                          await removeNewArrival(item._id);
                        } else {
                          await addNewArrival(item._id);
                        }
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isNewArrival
                          ? "bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      {isNewArrival ? "New Arrival" : "+ New Arrival"}
                    </button>
                  </div>

                  {/* Edit / Delete row */}
                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        if (!item._id) return;
                        setSelectedProductForEdit(item);
                        setIsUpdateOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      <HiOutlinePencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!item._id) return;
                        setSelectedProduct(item);
                        setIsDeleteOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-danger-200 text-xs font-semibold text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
                    >
                      <HiOutlineTrash className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      ) : (
        <Text className="text-center mt-20 block text-gray-400">
          {adminProductsPagination.total === 0
            ? "No products available"
            : "No products match your search"}
        </Text>
      )}

      {adminProductsPagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-8">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            ‹ Prev
          </button>

          {Array.from(
            { length: adminProductsPagination.totalPages },
            (_, i) => i + 1,
          ).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                p === page
                  ? "bg-primary-500 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            onClick={() =>
              setPage((p) =>
                Math.min(adminProductsPagination.totalPages, p + 1),
              )
            }
            disabled={page >= adminProductsPagination.totalPages}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next ›
          </button>
        </div>
      )}

      {/* Create */}
      <FormModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create Product"
        formId="product-create-form"
        isSubmitting={createForm.formState.isSubmitting}
        submitLabel="Add"
        onClose={() => createForm.reset()}
      >
        <form
          id="product-create-form"
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="flex flex-col gap-4"
        >
          <UITextInput
            label="Product Name *"
            placeholder="Enter Product Name"
            {...createForm.register("productName")}
            error={
              createForm.formState.errors.productName?.message as
                | string
                | undefined
            }
          />
          <UITextInput
            label="Product Description *"
            placeholder="Write description ..."
            {...createForm.register("description")}
            error={
              createForm.formState.errors.description?.message as
                | string
                | undefined
            }
          />
          <UINumberInput
            label="Price *"
            placeholder="Enter Price"
            {...createForm.register("price")}
            error={
              createForm.formState.errors.price?.message as string | undefined
            }
          />
          <UINumberInput
            label="Stock Limit *"
            placeholder="Enter Stock Limit"
            {...createForm.register("stockLimit")}
            error={
              createForm.formState.errors.stockLimit?.message as
                | string
                | undefined
            }
          />
          <UIFileInput
            label="Product Image *"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                createForm.setValue("productImage", file, {
                  shouldValidate: true,
                });
            }}
            error={
              createForm.formState.errors.productImage?.message as
                | string
                | undefined
            }
          />
          <Controller
            control={createForm.control}
            name="subCategory"
            render={({ field, fieldState }) => (
              <UISelectInput
                label="Sub Category *"
                options={subCategoryOptions}
                placeholder="Select sub category"
                selectedKey={field.value}
                onSelectionChange={(key) => field.onChange(key)}
                error={fieldState.error?.message}
              />
            )}
          />
        </form>
      </FormModal>

      {/* Update */}
      <FormModal
        isOpen={isUpdateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProductForEdit(undefined);
            updateForm.reset();
          }
          setIsUpdateOpen(open);
        }}
        title="Update Product"
        formId="product-update-form"
        isSubmitting={updateForm.formState.isSubmitting}
        submitLabel="Update"
        onClose={() => {
          setSelectedProductForEdit(undefined);
          updateForm.reset();
        }}
      >
        <form
          id="product-update-form"
          onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
          className="flex flex-col gap-4"
        >
          <UITextInput
            label="Product Name *"
            placeholder="Enter Product Name"
            {...updateForm.register("productName")}
            error={
              updateForm.formState.errors.productName?.message as
                | string
                | undefined
            }
          />
          <UITextInput
            label="Product Description *"
            placeholder="Write description ..."
            {...updateForm.register("description")}
            error={
              updateForm.formState.errors.description?.message as
                | string
                | undefined
            }
          />
          <UINumberInput
            label="Price *"
            placeholder="Enter Price"
            {...updateForm.register("price")}
            error={
              updateForm.formState.errors.price?.message as string | undefined
            }
          />
          <UINumberInput
            label="Stock Limit *"
            placeholder="Enter Stock Limit"
            {...updateForm.register("stockLimit")}
            error={
              updateForm.formState.errors.stockLimit?.message as
                | string
                | undefined
            }
          />
          <UIFileInput
            label="Product Image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                updateForm.setValue("productImage", file, {
                  shouldValidate: true,
                });
            }}
            error={
              updateForm.formState.errors.productImage?.message as
                | string
                | undefined
            }
          />
          <Controller
            control={updateForm.control}
            name="subCategory"
            render={({ field, fieldState }) => (
              <UISelectInput
                label="Sub Category *"
                options={subCategoryOptions}
                placeholder="Select sub category"
                selectedKey={field.value}
                onSelectionChange={(key) => field.onChange(key)}
                error={fieldState.error?.message}
              />
            )}
          />
        </form>
      </FormModal>

      {/* Delete */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(undefined);
          setIsDeleteOpen(open);
        }}
        title="Delete Product"
        message={
          selectedProduct
            ? `Want to delete this product: ${selectedProduct.productName}`
            : null
        }
        onConfirm={onDeleteConfirm}
        isLoading={isDeleting}
      />
    </PageContainer>
  );
};

export default Products;
