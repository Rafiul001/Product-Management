import AdminPageHeader from "@/components/molecules/AdminPageHeader";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal";
import FormModal from "@/components/molecules/FormModal";
import PageContainer from "@/components/molecules/PageContainer";
import StatusToggleChip from "@/components/molecules/StatusToggleChip";
import TablePagination from "@/components/molecules/TablePagination";
import UISelectInput from "@/components/molecules/formInputs/UISelectInput";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import { useCategoryStore } from "@/store/categoryStore";
import { useSubCategoryStore } from "@/store/subCategoryStore";
import {
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TSubCategoryDocument } from "@shared/models/SubCategory";
import {
  createSubCategoryValidationSchema,
  updateSubCategoryValidationSchema,
  type TCreateSubCategoryValidationSchema,
  type TUpdateSubCategoryValidationSchema,
} from "@shared/validators/subCategory.validator";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdDelete, MdEdit } from "react-icons/md";

const columns = [
  { name: "Sub Category Name", uid: "subCategoryName" },
  { name: "Belongs to", uid: "belongsTo" },
  { name: "Created At", uid: "createdAt" },
  { name: "Create Time", uid: "createTime" },
  { name: "Updated At", uid: "updatedAt" },
  { name: "Update Time", uid: "updateTime" },
  { name: "Status", uid: "status" },
  { name: "Actions", uid: "actions" },
];

const ROWS_PER_PAGE = 8;

const SubCategories: React.FC = () => {
  const { categories } = useCategoryStore();
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<TSubCategoryDocument>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    subCategories,
    createSubCategory,
    deleteSubCategory,
    updateSubCategory,
    getAllSubCategories,
  } = useSubCategoryStore();

  const createForm = useForm({
    resolver: zodResolver(createSubCategoryValidationSchema),
  });

  const updateForm = useForm({
    resolver: zodResolver(updateSubCategoryValidationSchema),
  });

  const pages = useMemo(
    () => Math.ceil(subCategories.length / ROWS_PER_PAGE),
    [subCategories.length],
  );

  const categoryOptions = categories.map((c) => ({
    label: c.categoryName,
    value: c._id ?? "",
  }));

  const onCreateSubmit = async (data: TCreateSubCategoryValidationSchema) => {
    await createSubCategory(data);
    createForm.reset();
    setIsCreateOpen(false);
  };

  const onDeleteConfirm = async () => {
    setIsDeleting(true);
    await deleteSubCategory(selectedSubCategory?._id ?? "");
    setIsDeleting(false);
    setSelectedSubCategory(undefined);
    setIsDeleteOpen(false);
  };

  const onUpdateSubmit = async (data: TUpdateSubCategoryValidationSchema) => {
    if (!selectedSubCategory?._id) return;
    await updateSubCategory(selectedSubCategory._id, data);
    updateForm.reset();
    setSelectedSubCategory(undefined);
    setIsUpdateOpen(false);
  };

  useEffect(() => {
    getAllSubCategories();
  }, [getAllSubCategories]);

  const pagedSubCategories = subCategories.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  return (
    <PageContainer>
      <AdminPageHeader
        title="Sub Categories"
        subtitle="Manage Sub Categories"
        actionLabel="Create"
        onAction={() => setIsCreateOpen(true)}
      />

      <Table className="mt-5">
        <Table.ScrollContainer>
          <Table.Content aria-label="Sub Category List">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  id={column.uid}
                  key={column.uid}
                  isRowHeader={column.uid === "subCategoryName"}
                  className={
                    column.uid === "subCategoryName"
                      ? "text-start"
                      : "text-center"
                  }
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={pagedSubCategories}
              renderEmptyState={() => "No rows to display."}
            >
              {(item) => (
                <TableRow key={item._id} id={item._id ?? ""}>
                  <TableCell>{item.subCategoryName}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        item.category.status
                          ? "bg-success-100 text-success-700"
                          : "bg-danger-100 text-danger-700"
                      }`}
                    >
                      {item.category ? item.category.categoryName : "--"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.updatedAt).toDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.updatedAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <StatusToggleChip
                      isActive={item.status}
                      onToggle={async () => {
                        await updateSubCategory(item._id ?? "", {
                          status: !item.status,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        isIconOnly
                        onPress={() => {
                          setSelectedSubCategory({
                            _id: item._id,
                            category: Object(item.category._id),
                            createdAt: item.createdAt,
                            status: item.status,
                            subCategoryName: item.subCategoryName,
                            updatedAt: item.updatedAt,
                          });
                          setIsDeleteOpen(true);
                        }}
                      >
                        <MdDelete className="size-8 text-danger cursor-pointer" />
                      </Button>
                      <Button
                        variant="ghost"
                        isIconOnly
                        onPress={() => {
                          setSelectedSubCategory({
                            _id: item._id,
                            category: Object(item.category._id),
                            createdAt: item.createdAt,
                            status: item.status,
                            subCategoryName: item.subCategoryName,
                            updatedAt: item.updatedAt,
                          });
                          updateForm.setValue(
                            "subCategoryName",
                            item.subCategoryName,
                          );
                          updateForm.setValue("status", item.status);
                          updateForm.setValue(
                            "category",
                            item.category._id.toString(),
                          );
                          setIsUpdateOpen(true);
                        }}
                      >
                        <MdEdit className="size-8 text-primary cursor-pointer" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <TablePagination page={page} pages={pages} onPageChange={setPage} />

      {/* Create */}
      <FormModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create Sub Category"
        formId="sub-category-create-form"
        isSubmitting={createForm.formState.isSubmitting}
        submitLabel="Add"
        onClose={() => createForm.reset()}
      >
        <form
          id="sub-category-create-form"
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="flex flex-col gap-4"
        >
          <UITextInput
            label="Sub Category Name *"
            placeholder="Enter Sub Category Name"
            {...createForm.register("subCategoryName")}
            error={
              createForm.formState.errors.subCategoryName?.message as
                | string
                | undefined
            }
          />
          <Controller
            control={createForm.control}
            name="category"
            render={({ field, fieldState }) => (
              <UISelectInput
                label="Category *"
                options={categoryOptions}
                placeholder="Select category"
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
            setSelectedSubCategory(undefined);
            updateForm.reset();
          }
          setIsUpdateOpen(open);
        }}
        title="Update Sub Category"
        formId="sub-category-update-form"
        isSubmitting={updateForm.formState.isSubmitting}
        submitLabel="Update"
        onClose={() => {
          setSelectedSubCategory(undefined);
          updateForm.reset();
        }}
      >
        <form
          id="sub-category-update-form"
          onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
          className="flex flex-col gap-4"
        >
          <UITextInput
            label="Sub Category Name"
            placeholder="Enter Sub Category Name"
            {...updateForm.register("subCategoryName")}
            error={
              updateForm.formState.errors.subCategoryName?.message as
                | string
                | undefined
            }
          />
          <Controller
            control={updateForm.control}
            name="category"
            render={({ field, fieldState }) => (
              <UISelectInput
                label="Category"
                options={categoryOptions}
                placeholder="Select category"
                selectedKey={field.value}
                onSelectionChange={(key) => field.onChange(key)}
                error={fieldState.error?.message}
              />
            )}
          />
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Status:</h3>
            <Controller
              control={updateForm.control}
              name="status"
              render={({ field }) => (
                <Switch
                  size="sm"
                  isSelected={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </form>
      </FormModal>

      {/* Delete */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedSubCategory(undefined);
          setIsDeleteOpen(open);
        }}
        title="Delete Sub Category"
        message={
          selectedSubCategory
            ? `Want to delete sub category: ${selectedSubCategory.subCategoryName}`
            : null
        }
        onConfirm={onDeleteConfirm}
        isLoading={isDeleting}
      />
    </PageContainer>
  );
};

export default SubCategories;
