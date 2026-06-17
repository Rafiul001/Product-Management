import AdminPageHeader from "@/components/molecules/AdminPageHeader";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal";
import FormModal from "@/components/molecules/FormModal";
import PageContainer from "@/components/molecules/PageContainer";
import StatusToggleChip from "@/components/molecules/StatusToggleChip";
import TablePagination from "@/components/molecules/TablePagination";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import { useCategoryStore } from "@/store/categoryStore";
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
import type { TCategoryDocument } from "@shared/models/Category";
import {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
  type TCreateCategoryValidationSchema,
  type TUpdateCategoryValidationSchema,
} from "@shared/validators/category.validator";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdDelete, MdEdit } from "react-icons/md";

const columns = [
  { name: "Category Name", uid: "categoryName" },
  { name: "Created At", uid: "createdAt" },
  { name: "Create Time", uid: "createTime" },
  { name: "Updated At", uid: "updatedAt" },
  { name: "Update Time", uid: "updateTime" },
  { name: "Status", uid: "status" },
  { name: "Actions", uid: "actions" },
];

const ROWS_PER_PAGE = 8;

const Categories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<TCategoryDocument>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    categories,
    createCategory,
    deleteCategory,
    updateCategory,
    getAllCategories,
  } = useCategoryStore();

  const createForm = useForm({
    resolver: zodResolver(createCategoryValidationSchema),
  });

  const updateForm = useForm({
    resolver: zodResolver(updateCategoryValidationSchema),
  });

  const pages = useMemo(
    () => Math.ceil(categories.length / ROWS_PER_PAGE),
    [categories.length],
  );

  const onCreateSubmit = async (data: TCreateCategoryValidationSchema) => {
    await createCategory(data);
    createForm.reset();
    setIsCreateOpen(false);
  };

  const onDeleteConfirm = async () => {
    setIsDeleting(true);
    await deleteCategory(selectedCategory?._id ?? "");
    setIsDeleting(false);
    setSelectedCategory(undefined);
    setIsDeleteOpen(false);
  };

  const onUpdateSubmit = async (data: TUpdateCategoryValidationSchema) => {
    if (!selectedCategory?._id) return;
    await updateCategory(selectedCategory._id, data);
    updateForm.reset();
    setSelectedCategory(undefined);
    setIsUpdateOpen(false);
  };

  useEffect(() => {
    if (selectedCategory) {
      updateForm.reset({
        categoryName: selectedCategory.categoryName,
        status: selectedCategory.status,
      });
    }
  }, [selectedCategory, updateForm]);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const pagedCategories = categories.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  return (
    <PageContainer>
      <AdminPageHeader
        title="Categories"
        subtitle="Manage categories"
        actionLabel="Create"
        onAction={() => setIsCreateOpen(true)}
      />

      <Table className="mt-5">
        <Table.ScrollContainer>
          <Table.Content aria-label="Category List">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  id={column.uid}
                  key={column.uid}
                  isRowHeader={column.uid === "categoryName"}
                  className={
                    column.uid === "categoryName" ? "text-start" : "text-center"
                  }
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={pagedCategories}
              renderEmptyState={() => "No rows to display."}
            >
              {(item) => (
                <TableRow key={item._id} id={item._id ?? ""}>
                  <TableCell>{item.categoryName}</TableCell>
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
                        if (!item._id) return;
                        await updateCategory(item._id, {
                          status: !item.status,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      isIconOnly
                      onPress={() => {
                        setSelectedCategory(item);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <MdDelete className="size-8 text-danger" />
                    </Button>
                    <Button
                      variant="ghost"
                      isIconOnly
                      onPress={() => {
                        setSelectedCategory(item);
                        setIsUpdateOpen(true);
                      }}
                    >
                      <MdEdit className="size-8 text-primary" />
                    </Button>
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
        title="Create Category"
        formId="category-create-form"
        isSubmitting={createForm.formState.isSubmitting}
        submitLabel="Add"
        onClose={() => createForm.reset()}
      >
        <form
          id="category-create-form"
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
        >
          <UITextInput
            label="Category Name"
            placeholder="Enter Category Name"
            {...createForm.register("categoryName")}
            error={
              createForm.formState.errors.categoryName?.message as
                | string
                | undefined
            }
          />
        </form>
      </FormModal>

      {/* Update */}
      <FormModal
        isOpen={isUpdateOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedCategory(undefined);
          setIsUpdateOpen(open);
        }}
        title="Update Category"
        formId="category-update-form"
        isSubmitting={updateForm.formState.isSubmitting}
        submitLabel="Update"
        onClose={() => setSelectedCategory(undefined)}
      >
        <form
          id="category-update-form"
          onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
          className="flex flex-col gap-4"
        >
          <UITextInput
            label="Category Name"
            placeholder="Enter Category Name"
            {...updateForm.register("categoryName")}
            error={
              updateForm.formState.errors.categoryName?.message as
                | string
                | undefined
            }
          />
          <div className="flex items-center justify-between">
            <h3>Status:</h3>
            <Controller
              control={updateForm.control}
              name="status"
              render={({ field }) => (
                <Switch isSelected={field.value} onChange={field.onChange}>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch>
              )}
            />
          </div>
        </form>
      </FormModal>

      {/* Delete */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedCategory(undefined);
          setIsDeleteOpen(open);
        }}
        title="Delete Category"
        message={
          selectedCategory
            ? `Want to delete category: ${selectedCategory.categoryName}`
            : null
        }
        onConfirm={onDeleteConfirm}
        isLoading={isDeleting}
      />
    </PageContainer>
  );
};

export default Categories;
