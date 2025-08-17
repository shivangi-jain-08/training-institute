import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { memberAPI } from "../../services/api";
import {
  Search,
  Filter,
  UserPlus,
  MessageSquare,
  X,
  SlidersHorizontal,
} from "lucide-react";
import MemberTable from "./MemberTable";
import Loading from "../Common/Loading";
import { getSubscriptionStatus } from "../../utils/dateHelpers";

const MemberList = () => {
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const membersPerPage = 10;

  useEffect(() => {
    const filter = searchParams.get("filter");
    const search = searchParams.get("search");
    if (filter) {
      setStatusFilter(filter);
    }
    if (search) {
      setSearchTerm(search);
    }
    fetchAllMembers();
  }, [searchParams]);

  // Frontend filtering logic
  const filteredMembers = useMemo(() => {
    let filtered = [...allMembers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((member) =>
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.contactNumber.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((member) => {
        const status = getSubscriptionStatus(member.subscriptionEndDate);
        return status === statusFilter;
      });
    }

    return filtered;
  }, [allMembers, searchTerm, statusFilter]);

  // Pagination logic
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * membersPerPage;
    const endIndex = startIndex + membersPerPage;
    return filteredMembers.slice(startIndex, endIndex);
  }, [filteredMembers, currentPage, membersPerPage]);

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  // Calculate member stats from frontend data
  const memberStats = useMemo(() => {
    const stats = {
      all: allMembers.length,
      active: 0,
      "expiring-soon": 0,
      expired: 0,
    };

    allMembers.forEach((member) => {
      const status = getSubscriptionStatus(member.subscriptionEndDate);
      if (stats[status] !== undefined) {
        stats[status]++;
      }
    });

    return stats;
  }, [allMembers]);

  const fetchAllMembers = async () => {
    try {
      setLoading(true);
      // Fetch all members
      const response = await memberAPI.getMembers({
        page: 1,
        limit: 1000, 
      });
      setAllMembers(response.data.members);
      setError(null);
    } catch (error) {
      console.error("Error fetching members:", error);
      setError("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); 

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1); 

    const params = new URLSearchParams(searchParams);
    if (filter !== "all") {
      params.set("filter", filter);
    } else {
      params.delete("filter");
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all";

  const handleSendReminder = async (memberId) => {
    try {
      await memberAPI.sendReminder(memberId);
      alert("Reminder sent successfully!");
      // Update the specific member's lastReminderSent
      setAllMembers(prevMembers =>
        prevMembers.map(member =>
          member._id === memberId
            ? { ...member, lastReminderSent: new Date(), reminderCount: (member.reminderCount || 0) + 1 }
            : member
        )
      );
    } catch (error) {
      console.error("Error sending reminder:", error);
      alert("Failed to send reminder");
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      await memberAPI.deleteMember(memberId);
      setAllMembers(prevMembers => prevMembers.filter(member => member._id !== memberId));
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member");
    }
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const filterOptions = [
    { value: "all", label: "All Members", count: memberStats.all },
    { value: "active", label: "Active", count: memberStats.active },
    {
      value: "expiring-soon",
      label: "Expiring Soon",
      count: memberStats["expiring-soon"],
    },
    { value: "expired", label: "Expired", count: memberStats.expired },
  ];

  if (loading && allMembers.length === 0) {
    return <Loading text="Loading members..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Members
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Manage your institute members
          </p>
        </div>

        <Link
          to="/members/add"
          className="btn-primary inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add New Member</span>
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="card p-4 sm:p-6 animate-slide-up">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2 relative"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"></div>
            )}
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:items-center lg:justify-between lg:space-x-6">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field pl-12 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-secondary-500">
              <Filter className="h-5 w-5" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="input-field w-auto min-w-[160px]"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          {/* <div className="text-sm text-secondary-500 dark:text-secondary-400">
            Showing {paginatedMembers.length} of {filteredMembers.length} members
          </div> */}
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden mt-4 space-y-4 border-t border-secondary-100 dark:border-secondary-800 pt-4">
            <div className="grid grid-cols-2 gap-3">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleFilterChange(option.value);
                    setShowFilters(false);
                  }}
                  className={`p-3 rounded-xl border transition-all ${
                    statusFilter === option.value
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      : "border-secondary-200 bg-white text-secondary-700 hover:border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                  }`}
                >
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-400">
                    {option.count} members
                  </div>
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  clearFilters();
                  setShowFilters(false);
                }}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}

            {/* Mobile results count */}
            {/* <div className="text-center text-sm text-secondary-500 dark:text-secondary-400">
              Showing {paginatedMembers.length} of {filteredMembers.length} members
            </div> */}
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-800">
            <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
              <Filter className="h-4 w-4" />
              <span>Active filters:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md dark:bg-primary-900/20 dark:text-primary-400">
                  Search: "{searchTerm}"
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md dark:bg-primary-900/20 dark:text-primary-400">
                  Status:{" "}
                  {filterOptions.find((f) => f.value === statusFilter)?.label}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-secondary-500 hover:text-secondary-700 text-sm font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="card p-4 bg-danger-50 border-danger-200 animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
              <p className="text-danger-700 font-medium">{error}</p>
            </div>
            <button
              onClick={fetchAllMembers}
              className="text-danger-600 hover:text-danger-700 font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div
        className="card animate-slide-up"
        style={{ animationDelay: "200ms" }}
      >
        {loading ? (
          <div className="p-8">
            <Loading text="Loading members..." />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UserPlus className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No members found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters to find what you're looking for"
                : "Get started by adding your first member to the system"}
            </p>
            {hasActiveFilters ? (
              <button onClick={clearFilters} className="btn-secondary mr-3">
                Clear Filters
              </button>
            ) : null}
            <Link to="/members/add" className="btn-primary">
              Add New Member
            </Link>
          </div>
        ) : (
          <MemberTable
            members={paginatedMembers}
            onSendReminder={handleSendReminder}
            onDeleteMember={handleDeleteMember}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-600 text-center sm:text-left">
            Page {currentPage} of {totalPages} ({filteredMembers.length} total results)
          </p>

          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
            >
              Previous
            </button>

            {/* Page numbers for desktop */}
            <div className="hidden sm:flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      page === currentPage
                        ? "bg-primary-500 text-white"
                        : "text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;