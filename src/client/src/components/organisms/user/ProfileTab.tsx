import SaveCancelBar from "@/components/molecules/SaveCancelBar";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import { useUserDashboardStore } from "@/store/userDashboardStore";
import { Spinner } from "@heroui/react";
import type React from "react";
import { useEffect, useState } from "react";

const ProfileTab: React.FC = () => {
  const {
    profile,
    profileLoading,
    profileUpdating,
    addressUpdating,
    fetchProfile,
    updateUserProfile,
    updateUserAddress,
  } = useUserDashboardStore();

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileFields, setProfileFields] = useState({
    userName: "",
    userEmail: "",
    userPhoneNumber: "",
    dateOfBirth: "",
  });

  const [editingAddress, setEditingAddress] = useState(false);
  const [addressFields, setAddressFields] = useState({
    street: "",
    area: "",
    city: "",
    postalCode: "",
  });

  const parseAddress = (raw: string) => {
    if (raw.includes("\n")) {
      const [street = "", area = "", city = "", postalCode = ""] =
        raw.split("\n");
      return { street, area, city, postalCode };
    }
    // legacy comma-separated format
    const [main = "", postalCode = ""] = raw.split(" - ");
    const parts = main.split(", ");
    return {
      street: parts[0] ?? "",
      area: parts[1] ?? "",
      city: parts[2] ?? "",
      postalCode,
    };
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEditProfile = () => {
    if (!profile) return;
    setProfileFields({
      userName: profile.userName,
      userEmail: profile.userEmail,
      userPhoneNumber: profile.userPhoneNumber,
      dateOfBirth: profile.dateOfBirth.slice(0, 10),
    });
    setEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    const ok = await updateUserProfile(profileFields);
    if (ok) setEditingProfile(false);
  };

  const handleSaveAddress = async () => {
    const { street, area, city, postalCode } = addressFields;
    if (!street.trim() || !area.trim() || !city.trim() || !postalCode.trim())
      return;
    const composed = `${street.trim()}\n${area.trim()}\n${city.trim()}\n${postalCode.trim()}`;
    const ok = await updateUserAddress(composed);
    if (ok) setEditingAddress(false);
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-base">Account Details</h3>
          {!editingProfile && (
            <button
              onClick={handleEditProfile}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {editingProfile ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UITextInput
                label="Name"
                value={profileFields.userName}
                onChange={(e) =>
                  setProfileFields((f) => ({ ...f, userName: e.target.value }))
                }
                maxLength={50}
              />
              <UITextInput
                label="Email"
                type="email"
                value={profileFields.userEmail}
                onChange={(e) =>
                  setProfileFields((f) => ({ ...f, userEmail: e.target.value }))
                }
              />
              <UITextInput
                label="Phone"
                value={profileFields.userPhoneNumber}
                onChange={(e) =>
                  setProfileFields((f) => ({
                    ...f,
                    userPhoneNumber: e.target.value,
                  }))
                }
                maxLength={11}
              />
              <UITextInput
                label="Date of Birth"
                type="date"
                value={profileFields.dateOfBirth}
                onChange={(e) =>
                  setProfileFields((f) => ({
                    ...f,
                    dateOfBirth: e.target.value,
                  }))
                }
              />
            </div>
            <SaveCancelBar
              onSave={handleSaveProfile}
              onCancel={() => setEditingProfile(false)}
              saving={profileUpdating}
              disabled={
                !profileFields.userName.trim() ||
                !profileFields.userEmail.trim() ||
                profileFields.userPhoneNumber.length !== 11
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "Name", value: profile.userName },
              { label: "Email", value: profile.userEmail },
              { label: "Phone", value: profile.userPhoneNumber },
              {
                label: "Date of Birth",
                value: new Date(profile.dateOfBirth).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  },
                ),
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="font-medium text-gray-800">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-base">
            Delivery Address
          </h3>
          {!editingAddress && (
            <button
              onClick={() => {
                setAddressFields(parseAddress(profile.address ?? ""));
                setEditingAddress(true);
              }}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {editingAddress ? (
          <div className="flex flex-col gap-3">
            <UITextInput
              label="Street / Road"
              placeholder="House no., road name"
              value={addressFields.street}
              onChange={(e) =>
                setAddressFields((f) => ({ ...f, street: e.target.value }))
              }
            />
            <UITextInput
              label="Area / Thana"
              placeholder="Area or thana"
              value={addressFields.area}
              onChange={(e) =>
                setAddressFields((f) => ({ ...f, area: e.target.value }))
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <UITextInput
                label="City / District"
                placeholder="Dhaka"
                value={addressFields.city}
                onChange={(e) =>
                  setAddressFields((f) => ({ ...f, city: e.target.value }))
                }
              />
              <UITextInput
                label="Postal Code"
                placeholder="1200"
                value={addressFields.postalCode}
                onChange={(e) =>
                  setAddressFields((f) => ({
                    ...f,
                    postalCode: e.target.value,
                  }))
                }
              />
            </div>
            <SaveCancelBar
              onSave={handleSaveAddress}
              onCancel={() => setEditingAddress(false)}
              saving={addressUpdating}
              disabled={
                !addressFields.street.trim() ||
                !addressFields.area.trim() ||
                !addressFields.city.trim() ||
                !addressFields.postalCode.trim()
              }
            />
          </div>
        ) : profile.address ? (
          (() => {
            const { street, area, city, postalCode } = parseAddress(
              profile.address,
            );
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Street / Road", value: street },
                  { label: "Area / Thana", value: area },
                  { label: "City / District", value: city },
                  { label: "Postal Code", value: postalCode },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="font-medium text-gray-800">{value || "—"}</p>
                  </div>
                ))}
              </div>
            );
          })()
        ) : (
          <span className="text-gray-400 italic text-sm">
            No address saved yet.
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
