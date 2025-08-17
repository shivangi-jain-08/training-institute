import React, { useState } from "react";
import {
  MessageSquare,
  Trash2,
  Phone,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  formatDate,
  getSubscriptionStatus,
  getStatusColor,
  getDaysUntilExpiry,
} from "../../utils/dateHelpers";

const MemberTable = ({ members, onSendReminder, onDeleteMember }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const getStatusBadge = (status) => {
    const badges = {
      active: "badge-success",
      "expiring-soon": "badge-warning",
      expired: "badge-danger",
    };
    return badges[status] || "badge-gray";
  };

  const toggleRowExpansion = (memberId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-secondary-100 dark:border-secondary-800">
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-50 dark:divide-secondary-800">
            {members.map((member, index) => {
              const status = getSubscriptionStatus(member.subscriptionEndDate);
              const daysLeft = getDaysUntilExpiry(member.subscriptionEndDate);

              return (
                <tr
                  key={member._id}
                  className="hover:bg-secondary-50/50 dark:hover:bg-secondary-800/50 transition-colors duration-200 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                          {member.fullName}
                        </div>
                        <div className="text-xs text-secondary-500 dark:text-secondary-400">
                          Age: {member.age}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-800 rounded-lg flex items-center justify-center">
                        <Phone className="h-4 w-4 text-secondary-500 dark:text-secondary-400" />
                      </div>
                      <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {member.contactNumber}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-secondary-400 dark:text-secondary-500" />
                      <span className="text-sm text-secondary-900 dark:text-secondary-100">
                        {formatDate(member.joinDate)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {formatDate(member.subscriptionEndDate)}
                      </div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400">
                        {daysLeft < 0
                          ? `Expired ${Math.abs(daysLeft)} days ago`
                          : daysLeft === 0
                          ? "Expires today"
                          : `${daysLeft} days left`}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={getStatusBadge(status)}>
                      {status === "expiring-soon"
                        ? "Expiring Soon"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSendReminder(member._id)}
                        className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200"
                        title="Send WhatsApp Reminder"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onDeleteMember(member._id)}
                        className="p-2 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-all duration-200"
                        title="Delete Member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {member.lastReminderSent && (
                      <div className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                        Last reminder: {formatDate(member.lastReminderSent)}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4">
        {members.map((member, index) => {
          const status = getSubscriptionStatus(member.subscriptionEndDate);
          const daysLeft = getDaysUntilExpiry(member.subscriptionEndDate);
          const isExpanded = expandedRows.has(member._id);

          return (
            <div
              key={member._id}
              className="bg-white dark:bg-secondary-900 rounded-xl border border-secondary-200 dark:border-secondary-800 animate-slide-up relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Card Header - Always Visible */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleRowExpansion(member._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 truncate">
                        {member.fullName}
                      </div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400">
                        Age: {member.age}
                      </div>
                      <div className="mt-1">
                        <span className={getStatusBadge(status)}>
                          {status === "expiring-soon"
                            ? "Expiring Soon"
                            : status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {/* Expand/Collapse Button */}
                    <button className="p-2 text-secondary-400">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-secondary-100 dark:border-secondary-800 animate-slide-down overflow-hidden">
                  <div className="pt-4 space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-800 rounded-lg flex items-center justify-center">
                          <Phone className="h-4 w-4 text-secondary-500 dark:text-secondary-400" />
                        </div>
                        <div>
                          <div className="text-xs text-secondary-500 dark:text-secondary-400">
                            Contact Number
                          </div>
                          <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                            {member.contactNumber}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-800 rounded-lg flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-secondary-500 dark:text-secondary-400" />
                        </div>
                        <div>
                          <div className="text-xs text-secondary-500 dark:text-secondary-400">
                            Join Date
                          </div>
                          <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                            {formatDate(member.joinDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Information */}
                    <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-3">
                      <div className="text-xs font-medium text-secondary-600 dark:text-secondary-400 mb-2">
                        Subscription Details
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-secondary-700 dark:text-secondary-300">
                            End Date:
                          </span>
                          <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                            {formatDate(member.subscriptionEndDate)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-secondary-700 dark:text-secondary-300">
                            Days Left:
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              daysLeft < 0
                                ? "text-danger-600"
                                : daysLeft <= 7
                                ? "text-warning-600"
                                : "text-success-600"
                            }`}
                          >
                            {daysLeft < 0
                              ? `Expired ${Math.abs(daysLeft)} days ago`
                              : daysLeft === 0
                              ? "Expires today"
                              : `${daysLeft} days left`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Last Reminder Info */}
                    {member.lastReminderSent && (
                      <div className="text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-800/50 p-2 rounded-lg">
                        <span className="font-medium">Last reminder sent:</span>{" "}
                        {formatDate(member.lastReminderSent)}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 pt-2 border-t border-secondary-100 dark:border-secondary-800">
                      <button
                        onClick={() => onSendReminder(member._id)}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-primary-50 hover:bg-primary-100 text-primary-700 hover:text-primary-800 rounded-lg transition-all duration-200 font-medium text-sm"
                        title="Send WhatsApp Reminder"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Send Reminder</span>
                      </button>

                      <button
                        onClick={() => onDeleteMember(member._id)}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-danger-50 hover:bg-danger-100 text-danger-700 hover:text-danger-800 rounded-lg transition-all duration-200 font-medium text-sm"
                        title="Delete Member"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberTable;
