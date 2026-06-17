import AdminPageHeader from "@/components/molecules/AdminPageHeader";
import ConfirmDeleteModal from "@/components/molecules/ConfirmDeleteModal";
import FormModal from "@/components/molecules/FormModal";
import PageContainer from "@/components/molecules/PageContainer";
import UIFileInput from "@/components/molecules/formInputs/UIFileInput";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import { useBannerStore } from "@/store/bannerStore";
import { Button, Card } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TBannerDocument } from "@shared/models/Banner";
import {
  createBannerValidationSchema,
  updateBannerValidationSchema,
  type TCreateBannerValidationSchema,
  type TUpdateBannerValidationSchema,
} from "@shared/validators/banner.validator";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Banners: React.FC = () => {
  const {
    banners,
    createBanner,
    updateBannerById,
    deleteBannerById,
    getAllBanners,
  } = useBannerStore();

  const [selectedBanner, setSelectedBanner] = useState<TBannerDocument>();
  const [selectedBannerForEdit, setSelectedBannerForEdit] =
    useState<TBannerDocument>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const createForm = useForm<TCreateBannerValidationSchema>({
    resolver: zodResolver(createBannerValidationSchema),
  });

  const updateForm = useForm<TUpdateBannerValidationSchema>({
    resolver: zodResolver(updateBannerValidationSchema),
  });

  const onCreateSubmit = async (data: TCreateBannerValidationSchema) => {
    await createBanner(data);
    createForm.reset();
    setIsCreateOpen(false);
  };

  const onDeleteConfirm = async () => {
    setIsDeleting(true);
    await deleteBannerById(selectedBanner?._id ?? "");
    setIsDeleting(false);
    setSelectedBanner(undefined);
    setIsDeleteOpen(false);
  };

  const onUpdateSubmit = async (data: TUpdateBannerValidationSchema) => {
    if (!selectedBannerForEdit?._id) return;
    await updateBannerById(selectedBannerForEdit._id, data);
    setSelectedBannerForEdit(undefined);
    updateForm.reset();
    setIsUpdateOpen(false);
  };

  useEffect(() => {
    if (selectedBannerForEdit) {
      updateForm.reset({
        title: selectedBannerForEdit.title,
        description: selectedBannerForEdit.description,
        link: selectedBannerForEdit.link,
        image: undefined,
      });
    }
  }, [selectedBannerForEdit, updateForm]);

  useEffect(() => {
    getAllBanners();
  }, [getAllBanners]);

  return (
    <PageContainer>
      <AdminPageHeader
        title="Banners"
        subtitle="Manage banners"
        actionLabel="Create"
        onAction={() => setIsCreateOpen(true)}
      />

      {banners.length > 0 ? (
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mt-10">
          {banners.map((item) => (
            <Card key={item._id}>
              <Card.Content className="overflow-visible p-0">
                <img
                  alt={item.title}
                  src={item.image}
                  className="h-50 object-cover object-top w-full"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-default-500 text-sm line-clamp-2">
                    {item.description}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-xs underline truncate block mt-1"
                  >
                    {item.link}
                  </a>
                </div>
              </Card.Content>
              <Card.Footer className="text-small gap-4">
                <Button
                  className="flex-1"
                  variant="secondary"
                  onPress={() => {
                    if (!item._id) return;
                    setSelectedBannerForEdit(item);
                    setIsUpdateOpen(true);
                  }}
                >
                  Update
                </Button>
                <Button
                  className="flex-1"
                  variant="danger-soft"
                  onPress={() => {
                    if (!item._id) return;
                    setSelectedBanner(item);
                    setIsDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        <h3 className="text-center mt-30 text-gray-400">
          Currently there are no banners available
        </h3>
      )}

      {/* Create */}
      <FormModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create Banner"
        formId="banner-create-form"
        isSubmitting={createForm.formState.isSubmitting}
        submitLabel="Add"
        onClose={() => createForm.reset()}
      >
        <form
          id="banner-create-form"
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="flex flex-col gap-4"
        >
          <UITextInput
            label="Title *"
            placeholder="Enter banner title"
            {...createForm.register("title")}
            error={
              createForm.formState.errors.title?.message as string | undefined
            }
          />
          <UITextInput
            label="Description *"
            placeholder="Enter banner description"
            {...createForm.register("description")}
            error={
              createForm.formState.errors.description?.message as
                | string
                | undefined
            }
          />
          <UITextInput
            label="Link *"
            placeholder="https://example.com"
            {...createForm.register("link")}
            error={
              createForm.formState.errors.link?.message as string | undefined
            }
          />
          <UIFileInput
            label="Image *"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                createForm.setValue("image", file, { shouldValidate: true });
            }}
            error={
              createForm.formState.errors.image?.message as string | undefined
            }
          />
        </form>
      </FormModal>

      {/* Update */}
      <FormModal
        isOpen={isUpdateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBannerForEdit(undefined);
            updateForm.reset();
          }
          setIsUpdateOpen(open);
        }}
        title="Update Banner"
        formId="banner-update-form"
        isSubmitting={updateForm.formState.isSubmitting}
        submitLabel="Update"
        onClose={() => {
          setSelectedBannerForEdit(undefined);
          updateForm.reset();
        }}
      >
        <form
          id="banner-update-form"
          onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
          className="flex flex-col gap-4"
        >
          <UITextInput
            label="Title"
            placeholder="Enter banner title"
            {...updateForm.register("title")}
            error={
              updateForm.formState.errors.title?.message as string | undefined
            }
          />
          <UITextInput
            label="Description"
            placeholder="Enter banner description"
            {...updateForm.register("description")}
            error={
              updateForm.formState.errors.description?.message as
                | string
                | undefined
            }
          />
          <UITextInput
            label="Link"
            placeholder="https://example.com"
            {...updateForm.register("link")}
            error={
              updateForm.formState.errors.link?.message as string | undefined
            }
          />
          <UIFileInput
            label="Image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                updateForm.setValue("image", file, { shouldValidate: true });
            }}
            error={
              updateForm.formState.errors.image?.message as string | undefined
            }
          />
        </form>
      </FormModal>

      {/* Delete */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedBanner(undefined);
          setIsDeleteOpen(open);
        }}
        title="Delete Banner"
        message={
          selectedBanner
            ? `Want to delete banner: ${selectedBanner.title}`
            : null
        }
        onConfirm={onDeleteConfirm}
        isLoading={isDeleting}
      />
    </PageContainer>
  );
};

export default Banners;
