import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    ClipboardList,
    Loader2,
    Search,
    Download,
    Trash2,
    AlertTriangle,
    X,
    FileSpreadsheet,
    Calendar
} from "lucide-react";

import Slider from "../../components/admin/slider";
import Paginator from "../../components/ui/Paginator";
import DropDown from "../../components/ui/DropDown";
import AdminLayout from "../../components/admin/adminLayout";
import ApplicationCard from "../../components/admin/applicationCard";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminPanel from "../../components/admin/AdminPanel";
import { ApplicationListSkeleton } from "../../components/ui/Skeletons";
import { useAuth } from "../../contexts/AuthProvider";

import {
    fetchApplications,
    handleStateChange,
    deleteApplication,
    exportApplicationsExcel,
    deleteApplicationsBeforeDate
} from "../../controllers/admin/ApplicationDashBoard";

const ApplicationDashboard = () => {
    // ================= FILTER OPTIONS =================
    const tabs = ["All Applications", "On Hold", "Selected", "Rejected"];

    // ================= STATE =================
    const [curr, setCurr] = useState("All Applications");
    const [domain, setDomain] = useState("All Domains");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Registration open/close state
    const [applicationOpen, setApplicationOpen] = useState(true);
    const [statusLoading, setStatusLoading] = useState(true);
    const [statusSaving, setStatusSaving] = useState(false);

    // Export loading state
    const [exportingStatus, setExportingStatus] = useState("");

    // Delete modal state
    const [applicationToDelete, setApplicationToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Auth & Bulk delete before date state (Admin Only)
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const [openDateDeleteModal, setOpenDateDeleteModal] = useState(false);
    const [cutoffDate, setCutoffDate] = useState("");
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    // Feedback notification
    const [feedback, setFeedback] = useState(null);

    // ================= PAGINATION =================
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalApplications, setTotalApplications] = useState(0);

    const domainOptions = [
        "All Domains",
        "Web Development",
        "AI / Machine Learning",
        "Cybersecurity",
        "Mobile App Development",
    ];

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        try {
            localStorage.removeItem("admin_app_slider");
        } catch (e) {}
    }, []);

    // Fetch registration global status
    const fetchApplicationStatus = async () => {
        try {
            setStatusLoading(true);
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/admin/registration/status`,
                { withCredentials: true }
            );
            if (res.data.success) {
                setApplicationOpen(res.data.registrationOpen);
            }
        } catch (error) {
            console.error("Failed to fetch application status:", error);
        } finally {
            setStatusLoading(false);
        }
    };

    // Toggle registration global status
    const updateApplicationStatus = async () => {
        if (statusLoading || statusSaving) return;

        const nextStatus = !applicationOpen;
        const endpoint = nextStatus ? "enable" : "disable";

        try {
            setStatusSaving(true);
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/admin/registration/${endpoint}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                setApplicationOpen(nextStatus);
                showFeedback(`Registrations ${nextStatus ? "opened" : "paused"} successfully`, "success");
            }
        } catch (error) {
            console.error("Failed to update application status:", error);
            showFeedback(error.response?.data?.message || "Failed to update registration status", "error");
        } finally {
            setStatusSaving(false);
        }
    };

    const showFeedback = (message, type = "success") => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 4000);
    };

    // Load applications
    const loadApplications = () => {
        // Map filter tab to backend query
        let statusParam = curr;
        if (curr === "All Applications") statusParam = "All";
        else if (curr === "On Hold") statusParam = "ON_HOLD";
        else if (curr === "Selected") statusParam = "SELECTED";
        else if (curr === "Rejected") statusParam = "REJECTED";

        fetchApplications({
            page,
            limit,
            curr: statusParam,
            domain,
            search: debouncedSearch,
            setLoading,
            setError,
            setApplications,
            setTotalPages,
            setTotalApplications,
        });
    };

    useEffect(() => {
        fetchApplicationStatus();
    }, []);

    useEffect(() => {
        loadApplications();
    }, [page, limit, domain, curr, debouncedSearch]);

    // Reset to page 1 on filter change
    useEffect(() => {
        setPage(1);
    }, [domain, curr, debouncedSearch]);

    // Handle status change
    const onStatusChange = async (applicationId, newStatus) => {
        await handleStateChange(newStatus, applicationId, null, (updated) => {
            // Update local state smoothly
            setApplications((prev) =>
                prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
            );
            showFeedback(`Status updated to ${newStatus}`, "success");
        });
    };

    // Confirm and perform delete
    const confirmDelete = async () => {
        if (!applicationToDelete) return;
        setIsDeleting(true);

        try {
            const res = await deleteApplication(applicationToDelete._id, (deletedId) => {
                setApplications((prev) => prev.filter((app) => app._id !== deletedId));
                setTotalApplications((prev) => Math.max(0, prev - 1));
                showFeedback("Application deleted successfully", "success");
            });

            if (!res?.success) {
                showFeedback(res?.message || "Failed to delete application", "error");
            }
        } catch (err) {
            showFeedback("An unexpected error occurred while deleting application", "error");
        } finally {
            setIsDeleting(false);
            setApplicationToDelete(null);
        }
    };

    // Bulk delete applications submitted before date (Admin Only)
    const confirmBulkDelete = async () => {
        if (!cutoffDate) {
            showFeedback("Please select a cutoff date", "error");
            return;
        }

        setIsBulkDeleting(true);
        try {
            const res = await deleteApplicationsBeforeDate(cutoffDate);
            if (res?.success) {
                showFeedback(res.message, "success");
                setOpenDateDeleteModal(false);
                setCutoffDate("");
                loadApplications();
            } else {
                showFeedback(res?.message || "Failed to delete applications", "error");
            }
        } catch (err) {
            showFeedback("Failed to delete applications before date", "error");
        } finally {
            setIsBulkDeleting(false);
        }
    };

    // Handle Excel export
    const handleExport = async (status) => {
        await exportApplicationsExcel(status, setExportingStatus);
    };

    return (
        <AdminLayout>
            <div className="w-full space-y-6">

                {/* ================= FEEDBACK BANNER ================= */}
                {feedback && (
                    <div
                        className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between transition-all ${
                            feedback.type === "success"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-destructive/10 text-destructive border-destructive/30"
                        }`}
                    >
                        <span>{feedback.message}</span>
                        <button onClick={() => setFeedback(null)} className="cursor-pointer">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* ================= HEADER ================= */}
                <AdminPageHeader
                    icon={ClipboardList}
                    title="Career Applications"
                    description="Review applicants, update hiring decisions, export applicant lists to Excel, and control application status."
                />

                {/* ================= APPLICATION GLOBAL STATUS ================= */}
                <AdminPanel className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-lg font-semibold text-card-foreground dark:text-dark-card-foreground">
                                    Registration Portal Status
                                </h2>
                                <span
                                    className={`
                                        rounded-full px-3 py-1 text-xs font-semibold
                                        ${
                                            applicationOpen
                                                ? "bg-success/10 text-success dark:bg-dark-success/20 dark:text-dark-success"
                                                : "bg-danger/10 text-danger dark:bg-dark-danger/20 dark:text-dark-danger"
                                        }
                                    `}
                                >
                                    {statusLoading ? "Checking..." : applicationOpen ? "Open" : "Closed"}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                                {applicationOpen
                                    ? "New applicants can verify their email via OTP and submit applications."
                                    : "Career application submissions are currently paused globally."}
                            </p>
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={applicationOpen}
                            onClick={updateApplicationStatus}
                            disabled={statusLoading || statusSaving}
                            className={`
                                flex w-full items-center justify-between gap-4 rounded-xl border p-2 transition-all cursor-pointer
                                disabled:cursor-not-allowed disabled:opacity-70 md:w-[260px]
                                ${
                                    applicationOpen
                                        ? "border-success/30 bg-success/10 dark:border-dark-success/40 dark:bg-dark-success/20"
                                        : "border-border bg-secondary dark:border-dark-border dark:bg-dark-secondary"
                                }
                            `}
                        >
                            <span className="px-3 text-sm font-medium text-foreground dark:text-dark-foreground">
                                {statusSaving
                                    ? "Updating..."
                                    : applicationOpen
                                    ? "Accepting Submissions"
                                    : "Paused Submissions"}
                            </span>

                            <span
                                className={`
                                    flex h-9 w-16 shrink-0 items-center rounded-full p-1 transition-all
                                    ${
                                        applicationOpen
                                            ? "bg-success dark:bg-dark-success"
                                            : "bg-muted dark:bg-dark-muted"
                                    }
                                `}
                            >
                                <span
                                    className={`
                                        flex h-7 w-7 items-center justify-center rounded-full bg-card text-card-foreground shadow-sm
                                        transition-transform dark:bg-dark-card dark:text-dark-card-foreground
                                        ${applicationOpen ? "translate-x-7" : "translate-x-0"}
                                    `}
                                >
                                    {statusSaving && <Loader2 size={14} className="animate-spin" />}
                                </span>
                            </span>
                        </button>
                    </div>
                </AdminPanel>

                {/* ================= FILTERS & SEARCH ================= */}
                <AdminPanel className="p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        {/* Search input */}
                        <div className="relative w-full lg:w-80">
                            <Search
                                size={17}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-dark-muted-foreground"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, role..."
                                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-background dark:bg-dark-background border border-border dark:border-dark-border text-foreground dark:text-dark-foreground outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Status Slider + Domain Dropdown */}
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
                            <Slider type={tabs} curr={curr} setCurr={setCurr} setPage={setPage} />
                            <DropDown value={domain} setValue={setDomain} options={domainOptions} />
                        </div>
                    </div>

                    {/* EXPORT BUTTONS BAR (Requirement 10, 11, 12) */}
                    <div className="pt-3 border-t border-border dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                            <FileSpreadsheet size={16} className="text-emerald-600 dark:text-emerald-400" />
                            <span>Export to Excel (.xlsx):</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Export All */}
                            <button
                                type="button"
                                disabled={Boolean(exportingStatus)}
                                onClick={() => handleExport("ALL")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border dark:border-dark-border hover:bg-secondary dark:hover:bg-dark-secondary transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {exportingStatus === "ALL" ? (
                                    <Loader2 size={13} className="animate-spin" />
                                ) : (
                                    <Download size={13} />
                                )}
                                <span>Export All</span>
                            </button>

                            {/* Export Selected */}
                            <button
                                type="button"
                                disabled={Boolean(exportingStatus)}
                                onClick={() => handleExport("SELECTED")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {exportingStatus === "SELECTED" ? (
                                    <Loader2 size={13} className="animate-spin" />
                                ) : (
                                    <Download size={13} />
                                )}
                                <span>Export Selected</span>
                            </button>

                            {/* Export On Hold */}
                            <button
                                type="button"
                                disabled={Boolean(exportingStatus)}
                                onClick={() => handleExport("ON_HOLD")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {exportingStatus === "ON_HOLD" ? (
                                    <Loader2 size={13} className="animate-spin" />
                                ) : (
                                    <Download size={13} />
                                )}
                                <span>Export On Hold</span>
                            </button>

                            {/* Export Rejected */}
                            <button
                                type="button"
                                disabled={Boolean(exportingStatus)}
                                onClick={() => handleExport("REJECTED")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {exportingStatus === "REJECTED" ? (
                                    <Loader2 size={13} className="animate-spin" />
                                ) : (
                                    <Download size={13} />
                                )}
                                <span>Export Rejected</span>
                            </button>

                            {/* Delete Before Date (Admin Only) */}
                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={() => setOpenDateDeleteModal(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-colors cursor-pointer"
                                    title="Permanently delete applications submitted before a cutoff date (Admin Only)"
                                >
                                    <Calendar size={13} />
                                    <Trash2 size={13} />
                                    <span>Delete Before Date</span>
                                </button>
                            )}
                        </div>
                    </div>
                </AdminPanel>

                {/* ================= APPLICATIONS TABLE / LIST ================= */}
                <AdminPanel className="overflow-hidden">
                    {/* LOADING SKELETON */}
                    {loading && <ApplicationListSkeleton count={4} />}

                    {/* ERROR STATE */}
                    {!loading && error && (
                        <div className="p-10 text-center space-y-3">
                            <p className="text-danger dark:text-dark-danger font-medium">{error}</p>
                            <button
                                onClick={loadApplications}
                                className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-white cursor-pointer"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* APPLICATIONS LIST */}
                    {!loading && !error && applications.length > 0 && (
                        <div className="divide-y divide-border dark:divide-dark-border">
                            {applications.map((application) => (
                                <ApplicationCard
                                    key={application._id}
                                    application={application}
                                    curr={curr}
                                    onStatusChange={onStatusChange}
                                    onDeleteRequest={(app) => setApplicationToDelete(app)}
                                />
                            ))}
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!loading && !error && applications.length === 0 && (
                        <div className="p-12 text-center">
                            <h2 className="text-lg font-semibold text-foreground dark:text-dark-foreground">
                                No Applications Found
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                                {search
                                    ? `No applications matching "${search}".`
                                    : "Applications matching the selected status and domain filters will appear here."}
                            </p>
                        </div>
                    )}
                </AdminPanel>

                {/* ================= PAGINATION ================= */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                        Total Applications:{" "}
                        <span className="font-semibold text-foreground dark:text-dark-foreground">
                            {totalApplications}
                        </span>
                    </p>

                    <Paginator page={page} setPage={setPage} totalPages={totalPages} />
                </div>
            </div>

            {/* ================= DELETE CONFIRMATION MODAL (Requirement 13) ================= */}
            {applicationToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl dark:border-dark-border dark:bg-dark-card space-y-5 animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-danger/10 text-danger dark:bg-dark-danger/20 dark:text-dark-danger flex items-center justify-center shrink-0">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="space-y-1 text-left">
                                <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground">
                                    Delete Application?
                                </h3>
                                <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground leading-relaxed">
                                    Are you sure you want to delete the application for{" "}
                                    <strong className="text-foreground dark:text-dark-foreground">
                                        {applicationToDelete.name}
                                    </strong>
                                    ? This will remove the applicant data and delete the uploaded resume from Cloudinary.
                                </p>
                                <p className="text-xs font-semibold text-danger dark:text-dark-danger mt-1">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setApplicationToDelete(null)}
                                className="px-4 py-2 rounded-xl text-sm font-semibold border border-border hover:bg-secondary dark:border-dark-border dark:hover:bg-dark-secondary transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={confirmDelete}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-danger hover:bg-danger-hover text-white transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm active:scale-95"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= BULK DELETE BEFORE DATE MODAL (ADMIN ONLY) ================= */}
            {openDateDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl dark:border-dark-border dark:bg-dark-card space-y-5 animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-danger/10 text-danger dark:bg-dark-danger/20 dark:text-dark-danger flex items-center justify-center shrink-0">
                                <Calendar size={22} />
                            </div>
                            <div className="space-y-1 text-left">
                                <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground">
                                    Delete Applications Before Date
                                </h3>
                                <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground leading-relaxed">
                                    Permanently delete all candidate applications submitted before the specified date. All associated PDF resumes stored in Cloudinary will also be cleaned up.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-dark-muted-foreground">
                                Cutoff Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={cutoffDate}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setCutoffDate(e.target.value)}
                                className="w-full rounded-xl border border-border bg-secondary/30 dark:border-dark-border dark:bg-dark-secondary/30 px-4 py-2.5 text-sm font-medium text-foreground dark:text-dark-foreground outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                                All applications submitted strictly prior to this date will be permanently deleted.
                            </p>
                        </div>

                        <div className="p-3.5 rounded-xl border border-danger/30 bg-danger/5 dark:bg-dark-danger/10 flex items-start gap-2.5 text-xs text-danger dark:text-dark-danger font-medium">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            <span>
                                <strong>Admin Restricted Action:</strong> This operation deletes records and Cloudinary assets permanently. It cannot be recovered.
                            </span>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isBulkDeleting}
                                onClick={() => {
                                    setOpenDateDeleteModal(false);
                                    setCutoffDate("");
                                }}
                                className="px-4 py-2 rounded-xl text-sm font-semibold border border-border hover:bg-secondary dark:border-dark-border dark:hover:bg-dark-secondary transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={isBulkDeleting || !cutoffDate}
                                onClick={confirmBulkDelete}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-danger hover:bg-danger-hover text-white transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm active:scale-95"
                            >
                                {isBulkDeleting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Deleting Applications...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Delete Applications
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ApplicationDashboard;
