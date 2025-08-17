import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { memberAPI } from "../../services/api";
import { ArrowLeft, Save, UserPlus, CalendarCheck } from "lucide-react";
import { formatDateForInput } from "../../utils/dateHelpers";

const AddMember = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    contactNumber: "",
    joinDate: formatDateForInput(new Date()),
    subscriptionEndDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      setError("Please enter a valid age (1-120)");
      return;
    }

    if (!formData.contactNumber.trim()) {
      setError("Contact number is required");
      return;
    }

    if (!formData.joinDate) {
      setError("Join date is required");
      return;
    }

    if (!formData.subscriptionEndDate) {
      setError("Subscription end date is required");
      return;
    }

    const joinDate = new Date(formData.joinDate);
    const endDate = new Date(formData.subscriptionEndDate);

    if (endDate <= joinDate) {
      setError("Subscription end date must be after join date");
      return;
    }

    try {
      setLoading(true);

      const memberData = {
        ...formData,
        age: parseInt(formData.age),
        joinDate: new Date(formData.joinDate).toISOString(),
        subscriptionEndDate: new Date(
          formData.subscriptionEndDate
        ).toISOString(),
      };

      await memberAPI.createMember(memberData);
      navigate("/members", {
        state: { message: "Member added successfully!" },
      });
    } catch (error) {
      console.error("Error creating member:", error);
      setError(error.response?.data?.message || "Failed to create member");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (
      Object.values(formData).some(
        (value) => value && value !== formatDateForInput(new Date())
      )
    ) {
      if (
        confirm(
          "Are you sure you want to cancel? All unsaved changes will be lost."
        )
      ) {
        navigate("/members");
      }
    } else {
      navigate("/members");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center space-x-4 animate-slide-up">
        <button
          onClick={handleCancel}
          className="p-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Add New Member
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400">
            Enter member details to add them to the system
          </p>
        </div>
      </div>

      {/* Form */}
      <div
        className="card p-8 animate-slide-up"
        style={{ animationDelay: "100ms" }}
      >
        {error && (
          <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl animate-slide-down">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
              <p className="text-danger-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter contact number with country code (e.g., +919876543210)"
                  required
                />
                <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-800 p-3 rounded-lg">
                  💡 Include country code for WhatsApp messages
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className="space-y-6 pt-6 border-t border-secondary-100 dark:border-secondary-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-soft">
                <CalendarCheck className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Subscription Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Join Date *
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Subscription End Date *
                </label>
                <input
                  type="date"
                  name="subscriptionEndDate"
                  value={formData.subscriptionEndDate}
                  onChange={handleInputChange}
                  className="input-field"
                  min={formData.joinDate}
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-end pt-8 border-t border-secondary-100 dark:border-secondary-800">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary w-full sm:w-auto"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 h-12"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Adding Member...</span>
                </div>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Add Member</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;
