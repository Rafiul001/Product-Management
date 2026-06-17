import AdminPageHeader from "@/components/molecules/AdminPageHeader";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal";
import FormModal from "@/components/molecules/FormModal";
import PageContainer from "@/components/molecules/PageContainer";
import TablePagination from "@/components/molecules/TablePagination";
import UIFileInput from "@/components/molecules/formInputs/UIFileInput";
import UINumberInput from "@/components/molecules/formInputs/UINumberInput";
import UISelectInput from "@/components/molecules/formInputs/UISelectInput";
import { useProductStore } from "@/store/productStore";
import { useStockEntryStore } from "@/store/stockEntryStore";
import type { TStockEntryDocument } from "@/types/stockEntry.types";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createStockEntryClientSchema,
  type TCreateStockEntryClientSchema,
  type TCreateStockEntryValidationSchema,
} from "@shared/validators/stockEntry.validator";
import type React from "react";
import { useMemo, useState } from "react";
import {
  Controller,
  type Resolver,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { MdAdd, MdDelete, MdVisibility } from "react-icons/md";

const columns = [
  { name: "Date", uid: "date" },
  { name: "Products", uid: "products" },
  { name: "Total Cost", uid: "totalCost" },
  { name: "Challan", uid: "challan" },
  { name: "Actions", uid: "actions" },
];

const ROWS_PER_PAGE = 8;

const StockEntries: React.FC = () => {
  const { stockEntries, createStockEntry, deleteStockEntryById } =
    useStockEntryStore();
  const { adminProducts, getAllProductsAdmin } = useProductStore();

  const [selectedEntry, setSelectedEntry] = useState<TStockEntryDocument>();
  const [viewEntry, setViewEntry] = useState<TStockEntryDocument>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [page, setPage] = useState(1);

  const createForm = useForm<TCreateStockEntryClientSchema>({
    resolver: zodResolver(
      createStockEntryClientSchema,
    ) as Resolver<TCreateStockEntryClientSchema>,
    defaultValues: {
      productList: [{ product: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: createForm.control,
    name: "productList",
  });

  const watchedProductList = useWatch({
    control: createForm.control,
    name: "productList",
  });

  const pages = useMemo(
    () => Math.ceil(stockEntries.length / ROWS_PER_PAGE),
    [stockEntries.length],
  );

  const productOptions = adminProducts.map((p) => ({
    label: p.productName,
    value: p._id ?? "",
  }));

  const getAvailableCapacity = (productId: string, rowIndex: number) => {
    const product = adminProducts.find((p) => p._id === productId);
    if (!product) return 0;

    const alreadyInOtherRows = watchedProductList.reduce(
      (
        sum: number,
        row: { product: string; quantity: number; unitPrice: number },
        idx: number,
      ) => {
        if (idx === rowIndex || row.product !== productId) return sum;
        return sum + (Number(row.quantity) || 0);
      },
      0,
    );

    return (
      (product.stockLimit ?? 0) - (product.quantity ?? 0) - alreadyInOtherRows
    );
  };

  const onCreateSubmit = async (data: TCreateStockEntryClientSchema) => {
    try {
      await createStockEntry(
        data as unknown as TCreateStockEntryValidationSchema,
      );
      createForm.reset({
        productList: [{ product: "", quantity: 1, unitPrice: 0 }],
      });
      setIsCreateOpen(false);
    } catch {
      // Error toast shown by store; keep modal open
    }
  };

  const onDeleteConfirm = async () => {
    setIsDeleting(true);
    await deleteStockEntryById(selectedEntry?._id ?? "");
    setIsDeleting(false);
    setSelectedEntry(undefined);
    setIsDeleteOpen(false);
  };

  const pagedEntries = stockEntries.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  return (
    <PageContainer>
      <AdminPageHeader
        title="Stock Entries"
        subtitle="Manage stock entries"
        actionLabel="Create"
        onAction={() => setIsCreateOpen(true)}
      />

      <Table className="mt-5">
        <Table.ScrollContainer>
          <Table.Content aria-label="Stock Entry List">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  id={column.uid}
                  key={column.uid}
                  isRowHeader={column.uid === "date"}
                  className={
                    column.uid === "date" ? "text-start" : "text-center"
                  }
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={pagedEntries}
              renderEmptyState={() => "No stock entries to display."}
            >
              {(item) => (
                <TableRow key={item._id} id={item._id ?? ""}>
                  <TableCell>
                    {new Date(item.createdAt).toDateString()}
                  </TableCell>
                  <TableCell>{item.productList.length}</TableCell>
                  <TableCell>৳{item.totalCost.toLocaleString()}</TableCell>
                  <TableCell>
                    <a
                      href={item.challanImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline text-sm"
                    >
                      View
                    </a>
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      isIconOnly
                      onPress={() => {
                        setViewEntry(item);
                        setIsViewOpen(true);
                      }}
                    >
                      <MdVisibility className="size-5 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      isIconOnly
                      onPress={() => {
                        setSelectedEntry(item);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <MdDelete className="size-5 text-danger" />
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
        onOpenChange={(open) => {
          if (!open)
            createForm.reset({
              productList: [{ product: "", quantity: 1, unitPrice: 0 }],
            });
          setIsCreateOpen(open);
        }}
        title="Create Stock Entry"
        formId="stock-entry-create-form"
        isSubmitting={createForm.formState.isSubmitting}
        submitLabel="Create"
        size="lg"
        onClose={() =>
          createForm.reset({
            productList: [{ product: "", quantity: 1, unitPrice: 0 }],
          })
        }
      >
        <form
          id="stock-entry-create-form"
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Product List</h3>
              <Button
                size="sm"
                variant="secondary"
                onPress={() =>
                  append({ product: "", quantity: 1, unitPrice: 0 })
                }
                type="button"
              >
                <MdAdd className="mr-1" />
                Add Product
              </Button>
            </div>

            {(
              createForm.formState.errors.productList as
                | { message?: string }
                | undefined
            )?.message && (
              <p className="text-danger-500 text-xs">
                {
                  (
                    createForm.formState.errors.productList as {
                      message?: string;
                    }
                  ).message
                }
              </p>
            )}

            {fields.map((field, index) => {
              const selectedProductId =
                watchedProductList[index]?.product ?? "";
              const available = selectedProductId
                ? getAvailableCapacity(selectedProductId, index)
                : null;
              const rowErrors =
                createForm.formState.errors.productList?.[index];

              return (
                <div
                  key={field.id}
                  className="flex gap-2 items-start border rounded-lg p-3"
                >
                  <div className="flex-1 flex flex-col gap-2">
                    <Controller
                      control={createForm.control}
                      name={`productList.${index}.product`}
                      render={({ field: f, fieldState }) => (
                        <UISelectInput
                          label="Product *"
                          options={productOptions}
                          placeholder="Select product"
                          selectedKey={f.value}
                          onSelectionChange={(key) => {
                            f.onChange(key);
                            getAllProductsAdmin();
                          }}
                          error={fieldState.error?.message}
                        />
                      )}
                    />

                    {available !== null && (
                      <p
                        className={`text-xs ${available <= 0 ? "text-danger" : "text-default-400"}`}
                      >
                        Available to stock:{" "}
                        <span className="font-semibold">
                          {Math.max(0, available)}
                        </span>{" "}
                        unit(s)
                      </p>
                    )}

                    <div className="flex gap-2">
                      <UINumberInput
                        label="Quantity *"
                        placeholder="Qty"
                        className="flex-1"
                        {...createForm.register(
                          `productList.${index}.quantity`,
                        )}
                        error={
                          rowErrors?.quantity?.message as string | undefined
                        }
                      />
                      <UINumberInput
                        label="Unit Price *"
                        placeholder="Price"
                        className="flex-1"
                        {...createForm.register(
                          `productList.${index}.unitPrice`,
                        )}
                        error={
                          rowErrors?.unitPrice?.message as string | undefined
                        }
                      />
                    </div>
                  </div>

                  {fields.length > 1 && (
                    <Button
                      isIconOnly
                      variant="danger-soft"
                      size="sm"
                      type="button"
                      className="mt-6"
                      onPress={() => remove(index)}
                    >
                      <MdDelete />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <UIFileInput
            label="Challan Image *"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                createForm.setValue("challanImage", file, {
                  shouldValidate: true,
                });
            }}
            error={
              createForm.formState.errors.challanImage?.message as
                | string
                | undefined
            }
          />
        </form>
      </FormModal>

      {/* View */}
      <Modal
        isOpen={isViewOpen}
        onOpenChange={(open) => {
          if (!open) setViewEntry(undefined);
          setIsViewOpen(open);
        }}
      >
        <Modal.Backdrop>
          <Modal.Container placement="center">
            <Modal.Dialog>
              <ModalHeader>
                Stock Entry Details
                <Modal.CloseTrigger />
              </ModalHeader>
              <ModalBody>
                {viewEntry && (
                  <>
                    <p className="text-sm text-default-500">
                      Date: {new Date(viewEntry.createdAt).toDateString()}
                    </p>
                    <Table className="mt-2">
                      <Table.ScrollContainer>
                        <Table.Content aria-label="Product list">
                          <TableHeader>
                            <TableColumn id="product" isRowHeader>
                              Product
                            </TableColumn>
                            <TableColumn id="quantity" className="text-center">
                              Quantity
                            </TableColumn>
                            <TableColumn id="unitPrice" className="text-center">
                              Unit Price
                            </TableColumn>
                            <TableColumn id="subtotal" className="text-center">
                              Subtotal
                            </TableColumn>
                          </TableHeader>
                          <TableBody>
                            {viewEntry.productList.map((item, index) => (
                              <TableRow key={index} id={String(index)}>
                                <TableCell>
                                  {item.product.productName}
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                  ৳{item.unitPrice.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  ৳
                                  {(
                                    item.quantity * item.unitPrice
                                  ).toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table.Content>
                      </Table.ScrollContainer>
                    </Table>
                    <div className="flex justify-between items-center mt-2 font-semibold">
                      <span>Total Cost</span>
                      <span>৳{viewEntry.totalCost.toLocaleString()}</span>
                    </div>
                    <div className="mt-2">
                      <a
                        href={viewEntry.challanImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline text-sm"
                      >
                        View Challan Image
                      </a>
                    </div>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="secondary"
                  onPress={() => {
                    setViewEntry(undefined);
                    setIsViewOpen(false);
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Delete */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedEntry(undefined);
          setIsDeleteOpen(open);
        }}
        title="Delete Stock Entry"
        message={
          selectedEntry
            ? `Are you sure you want to delete the stock entry from ${new Date(
                selectedEntry.createdAt,
              ).toDateString()}? This action cannot be undone.`
            : null
        }
        onConfirm={onDeleteConfirm}
        isLoading={isDeleting}
      />
    </PageContainer>
  );
};

export default StockEntries;
