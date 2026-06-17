import AdminPageHeader from "@/components/molecules/AdminPageHeader";
import FormModal from "@/components/molecules/FormModal";
import PageContainer from "@/components/molecules/PageContainer";
import StatusBadge from "@/components/molecules/StatusBadge";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import type { TAdminUser } from "@/store/adminUserStore";
import { useAdminUserStore } from "@/store/adminUserStore";
import { Text } from "@heroui/react";
import type { TUpdateUserAdminBodySchema } from "@shared/validators/user.validator";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const UserRow: React.FC<{
  user: TAdminUser;
  onEdit: (user: TAdminUser) => void;
}> = ({ user, onEdit }) => {
  const date = new Date(user.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div>
          <Text className="text-sm font-medium text-gray-900 block">
            {user.userName}
          </Text>
          <Text className="text-xs text-gray-400 block">{user.userEmail}</Text>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {user.userPhoneNumber}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-48">
        <span className="block truncate">{user.address}</span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge
          label={user.isVerified ? "Verified" : "Unverified"}
          variant={user.isVerified ? "success" : "warning"}
        />
      </td>
      <td className="px-4 py-3 text-xs text-gray-400">{date}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => onEdit(user)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

const Users: React.FC = () => {
  const { users, usersLoading, updateUser } = useAdminUserStore();
  const [selectedUser, setSelectedUser] = useState<TAdminUser | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const form = useForm<TUpdateUserAdminBodySchema>();

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        userName: selectedUser.userName,
        userEmail: selectedUser.userEmail,
        userPhoneNumber: selectedUser.userPhoneNumber,
        address: selectedUser.address,
      });
    }
  }, [selectedUser, form]);

  const onEditSubmit = async (data: TUpdateUserAdminBodySchema) => {
    if (!selectedUser) return;
    const success = await updateUser(selectedUser._id, data);
    if (success) {
      setIsEditOpen(false);
      setSelectedUser(null);
      form.reset();
    }
  };

  const handleEdit = (user: TAdminUser) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  return (
    <PageContainer>
      <AdminPageHeader title="Users" subtitle="Manage registered users" />

      {usersLoading ? (
        <Text className="text-center mt-30 block text-gray-400">
          Loading users...
        </Text>
      ) : users.length === 0 ? (
        <Text className="text-center mt-30 block text-gray-400">
          No users registered yet
        </Text>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name / Email
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user._id} user={user} onEdit={handleEdit} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FormModal
        isOpen={isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
            form.reset();
          }
          setIsEditOpen(open);
        }}
        title="Edit User"
        formId="user-edit-form"
        isSubmitting={form.formState.isSubmitting}
        submitLabel="Save"
        onClose={() => {
          setSelectedUser(null);
          form.reset();
        }}
      >
        <form
          id="user-edit-form"
          onSubmit={form.handleSubmit(onEditSubmit)}
          className="flex flex-col gap-4"
        >
          <UITextInput
            label="Name"
            placeholder="Enter name"
            {...form.register("userName")}
            error={form.formState.errors.userName?.message}
          />
          <UITextInput
            label="Email"
            placeholder="Enter email"
            {...form.register("userEmail")}
            error={form.formState.errors.userEmail?.message}
          />
          <UITextInput
            label="Phone"
            placeholder="01XXXXXXXXX"
            {...form.register("userPhoneNumber")}
            error={form.formState.errors.userPhoneNumber?.message}
          />
          <UITextInput
            label="Address"
            placeholder="Enter address"
            {...form.register("address")}
            error={form.formState.errors.address?.message}
          />
        </form>
      </FormModal>
    </PageContainer>
  );
};

export default Users;
