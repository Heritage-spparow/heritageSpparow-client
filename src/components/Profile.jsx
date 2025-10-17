import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { User, Lock, MapPin } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formErrors, setFormErrors] = useState([]);

  const {
    user,
    updateProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const currentUser = {
    firstName: user?.firstName || "Guest",
    lastName: user?.lastName || "User",
    email: user?.email || "guest@example.com",
    phone: user?.phone || "",
    addresses: user?.addresses ?? [],
  };

  // ─── Profile Update ─────────────────────────────
  const onUpdateProfile = async (data) => {
    const response = await updateProfile(data);
    if (response.success) {
      alert("Profile updated successfully!");
      reset();
    } else alert(response.error || "Failed to update profile");
  };

  // ─── Password Change ────────────────────────────
  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword)
      return alert("New password and confirmation do not match");
    const response = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    if (response.success) {
      alert("Password changed successfully!");
      reset();
    } else alert(response.error || "Failed to change password");
  };

  // ─── Address Add / Update ───────────────────────
  const onAddOrUpdateAddress = async (data) => {
    const addressData = {
      label: data.label,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.street,
      city: data.city,
      postalCode: data.zipCode,
      country: "India",
      state: data.state,
      addressLine2: data.addressLine2 || undefined,
      type: "Home",
      isDefault: editingAddress
        ? editingAddress.isDefault
        : currentUser.addresses.length === 0,
    };

    try {
      setFormErrors([]);
      const response = editingAddress
        ? await updateAddress(editingAddress.id, addressData)
        : await addAddress(addressData);

      if (response.success) {
        alert(
          editingAddress
            ? "Address updated successfully!"
            : "Address added successfully!"
        );
        setShowAddressForm(false);
        setEditingAddress(null);
        reset();
      } else {
        console.error("Address error:", response.errors);
        setFormErrors(
          response.errors?.map((e) => e.msg) || [
            response.message || "Failed to process address",
          ]
        );
      }
    } catch (error) {
      setFormErrors([error.message || "Network error"]);
    }
  };

  // ─── Reusable Card ──────────────────────────────
  const Card = ({ children }) => (
    <div className="bg-white/80 backdrop-blur-lg border border-neutral-200    -2xl p-8 shadow-md hover:shadow-lg transition-all duration-300">
      {children}
    </div>
  );

  // ─── Sidebar ────────────────────────────────────
  const Sidebar = () => (
    <div className="lg:w-64 shrink-0">
      <div className="bg-white/80 backdrop-blur-md    -2xl p-6 shadow-sm border border-neutral-200">
        <nav className="space-y-2">
          {[
            { id: "profile", label: "Profile Information", icon: <User size={18} /> },
            { id: "security", label: "Security", icon: <Lock size={18} /> },
            { id: "addresses", label: "Addresses", icon: <MapPin size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3    -xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#737144] text-white shadow"
                  : "text-[var(--color-bg)] hover:bg-neutral-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  // ─── Profile Section ────────────────────────────
  const ProfileSection = () => (
    <div className="space-y-8">
      <Card>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28    bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center overflow-hidden">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-light text-[var(--color-bg)]">
                {currentUser.firstName[0]}
                {currentUser.lastName[0]}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-bg)]">
              {currentUser.firstName} {currentUser.lastName}
            </h2>
            <p className="text-[var(--color-bg)]">{currentUser.email}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-[var(--color-bg)] mb-6">
          Personal Information
        </h3>
        <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "firstName", label: "First Name", defaultValue: currentUser.firstName },
              { name: "lastName", label: "Last Name", defaultValue: currentUser.lastName },
              { name: "email", label: "Email", defaultValue: currentUser.email },
              { name: "phone", label: "Phone", defaultValue: currentUser.phone },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-sm text-[var(--color-bg)]">{f.label}</label>
                <input
                  type="text"
                  defaultValue={f.defaultValue}
                  {...register(f.name, { required: `${f.label} is required` })}
                  className="w-full px-4 py-3    -xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#737144]/30"
                />
                {errors[f.name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[f.name].message}</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#737144] text-white px-8 py-3 cursor-pointer  font-medium  transition-all"
            >
              Update Profile
            </button>
          </div>
        </form>
      </Card>
    </div>
  );

  // ─── Security Section ───────────────────────────
  const SecuritySection = () => (
    <div className="space-y-8">
      <Card>
        <h3 className="text-xl font-semibold text-[var(--color-bg)] mb-6">
          Change Password
        </h3>
        <form onSubmit={handleSubmit(onChangePassword)} className="space-y-6">
          {[
            { name: "currentPassword", label: "Current Password" },
            { name: "newPassword", label: "New Password" },
            { name: "confirmPassword", label: "Confirm New Password" },
          ].map((f, i) => (
            <div key={i}>
              <label className="text-sm text-[var(--color-bg)]">{f.label}</label>
              <input
                type="password"
                {...register(f.name, { required: `${f.label} is required` })}
                className="w-full px-4 py-3    -xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#737144]/30"
              />
              {errors[f.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[f.name].message}</p>
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#737144] text-white px-8 py-3    -xl font-medium hover:bg-neutral-200 transition-all"
            >
              Change Password
            </button>
          </div>
        </form>
      </Card>
    </div>
  );

  // ─── Address Section ────────────────────────────
  const AddressSection = () => (
    <div className="space-y-8">
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[var(--color-bg)] mb-4 md:mb-0">
            Saved Addresses
          </h3>
          <button
            onClick={() => {
              setShowAddressForm(true);
              setEditingAddress(null);
              setFormErrors([]);
            }}
            className="bg-[#737144] text-white px-6 py-2    -xl font-medium hover:bg-neutral-200 transition-all"
          >
            Add New Address
          </button>
        </div>

        {showAddressForm && (
          <div className="p-6 bg-neutral-50 border border-gray-200    -xl mb-6">
            <form onSubmit={handleSubmit(onAddOrUpdateAddress)} className="space-y-4">
              {formErrors.length > 0 && (
                <div className="mb-4 p-4 bg-red-50    -xl">
                  {formErrors.map((e, i) => (
                    <p key={i} className="text-red-600 text-sm">{e}</p>
                  ))}
                </div>
              )}
              {["label", "firstName", "lastName", "phone", "street", "city", "state", "zipCode"].map((f) => (
                <div key={f}>
                  <label className="text-sm text-[var(--color-bg)] capitalize">{f}</label>
                  <input
                    type="text"
                    {...register(f, { required: `${f} is required` })}
                    className="w-full px-4 py-3    -xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#737144]/30"
                  />
                  {errors[f] && (
                    <p className="text-red-500 text-sm mt-1">{errors[f].message}</p>
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700    -xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#737144] text-white    -xl font-medium hover:bg-neutral-200 transition-all"
                >
                  {editingAddress ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        )}

        {currentUser.addresses.length > 0 ? (
          <div className="space-y-4">
            {currentUser.addresses.map((a, i) => (
              <div
                key={i}
                className="p-6 border border-gray-200    -xl bg-white/70 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="font-medium text-[var(--color-bg)]">{a.label}</p>
                    <p className="text-[var(--color-bg)] text-sm">
                      {a.firstName} {a.lastName}
                    </p>
                    <p className="text-[var(--color-bg)] text-sm">{a.phone}</p>
                    <p className="text-[var(--color-bg)] text-sm">
                      {a.address}, {a.city}, {a.state} {a.postalCode}
                    </p>
                  </div>
                  <div className="flex gap-3 text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingAddress(a);
                        setShowAddressForm(true);
                      }}
                      className="text-[#737144] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAddress(a.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    {!a.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(a.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[var(--color-bg)]">
            No addresses saved yet.
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        <Sidebar />
        <div className="flex-1">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "security" && <SecuritySection />}
          {activeTab === "addresses" && <AddressSection />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
