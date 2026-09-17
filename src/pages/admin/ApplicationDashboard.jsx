import React, { useEffect, useState } from "react";
import axios from "axios";

import Slider from '../../components/admin/slider'
import Paginator from "../../components/ui/Paginator";
import DropDown from "../../components/ui/DropDown";

import { fetchApplications } from "../../controllers/admin/ApplicationDashBoard";
import AdminLayout from "../../components/admin/adminLayout";
import ApplicationCard from "../../components/admin/applicationCard";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminPanel from "../../components/admin/AdminPanel";
import { ApplicationListSkeleton } from "../../components/ui/Skeletons";
import { ClipboardList, Loader2 } from "lucide-react";

const ApplicationDashboard = () => {
    // ================= FILTER OPTIONS =================
    const tabs = ["Applied", "On Hold", "Rejected", "Selected"];

    // ================= STATE =================
    const [curr, setCurr] = useState(() => {
        const saved = localStorage.getItem("admin_app_slider");
        return tabs.includes(saved) ? saved : "Applied";
    });
    const [domain, setDomain] = useState("All Domains");

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [applicationOpen, setApplicationOpen] = useState(true);
    const [statusLoading, setStatusLoading] = useState(true);
    const [statusSaving, setStatusSaving] = useState(false);

    // ================= PAGINATION =================
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [totalPages, setTotalPages] = useState(1);
    const [totalApplications, setTotalApplications] = useState(0);

    useEffect(() => {
        localStorage.setItem("admin_app_slider", curr);
    }, [curr]);

    const domainOptions = [
        "All Domains",
        "Web Development",
        "AI / Machine Learning",
        "Cybersecurity",
        "Mobile App Development",
    ];

    const fetchApplicationStatus = async () => {
        try {
            setStatusLoading(true);

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/registration/status`, {
                withCredentials: true,
            });

            if (res.data.success) {
                setApplicationOpen(res.data.registrationOpen);
            }
        } catch (error) {
            console.error("Failed to fetch application status:", error);
        } finally {
            setStatusLoading(false);
        }
    };

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
            }
        } catch (error) {
            console.error("Failed to update application status:", error);
            alert(error.response?.data?.message || "Failed to update application status.");
        } finally {
            setStatusSaving(false);
        }
    };

    useEffect(() => {
        fetchApplicationStatus();
    }, []);

    // ================= FETCH ON CHANGE =================
    useEffect(() => {
        fetchApplications({
            page,
            limit,
            curr,
            domain,
            setLoading,
            setError,
            setApplications,
            setTotalPages,
            setTotalApplications,
        });
    }, [page, limit, domain, curr]);

    // ================= RESET PAGE =================
    useEffect(() => { setPage(1); }, [domain, curr]);

    const handleDeleteSuccess = (deletedId) => {
        setApplications((prev) => prev.filter((app) => app._id !== deletedId));
        setTotalApplications((prev) => Math.max(0, prev - 1));
    };

    return (
        <AdminLayout>
            <div className="w-full space-y-6">

                {/* ================= HEADER ================= */}
                <AdminPageHeader
                    icon={ClipboardList}
                    title="Applications"
                    description="Review applicants, update application status, and control whether new submissions are open."
                />

                {/* ================= APPLICATION STATUS ================= */}
                <AdminPanel className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-lg font-semibold text-card-foreground dark:text-dark-card-foreground">
                                    Applications
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
                                    ? "New applicants can submit their forms."
                                    : "New application submissions are currently paused."}
                            </p>
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={applicationOpen}
                            onClick={updateApplicationStatus}
                            disabled={statusLoading || statusSaving}
                            className={`
                                flex w-full items-center justify-between gap-4 rounded-xl border p-2 transition-all
                                disabled:cursor-not-allowed disabled:opacity-70 md:w-[260px]
                                ${
                                    applicationOpen
                                        ? "border-success/30 bg-success/10 dark:border-dark-success/40 dark:bg-dark-success/20"
                                        : "border-border bg-secondary dark:border-dark-border dark:bg-dark-secondary"
                                }
                            `}
                        >
                            <span className="px-3 text-sm font-medium text-foreground dark:text-dark-foreground">
                                {statusSaving ? "Updating" : applicationOpen ? "Open Applications" : "Closed Applications"}
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

                {/* ================= FILTERS ================= */}
                <AdminPanel className="p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground dark:text-dark-muted-foreground">
                                Review Queue
                            </p>
                            <p className="mt-1 text-sm text-foreground dark:text-dark-foreground">
                                Filter by decision status and domain.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
                            <Slider type={tabs} curr={curr} setCurr={setCurr} setPage={setPage} />

                            <DropDown value={domain} setValue={setDomain} options={domainOptions} />
                        </div>
                    </div>
                </AdminPanel>

                {/* ================= TABLE ================= */}
                <AdminPanel className="overflow-hidden">
                    {/* ================= LOADING ================= */}
                    {loading && (
                        <ApplicationListSkeleton count={4} />
                    )}

                    {/* ================= ERROR ================= */}
                    {!loading && error && (
                        <div className="p-10 text-center">
                            <p className="text-danger dark:text-dark-danger">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* ================= APPLICATIONS ================= */}
                    {!loading &&
                        !error &&
                        applications.length > 0 && (
                            <div className="divide-y divide-border dark:divide-dark-border">

                                {applications.map((application) => (
                                    <ApplicationCard
                                        key={application._id}
                                        application={application}
                                        curr={curr}
                                        onDelete={handleDeleteSuccess}
                                    />
                                ))}
                            </div>
                        )}

                    {/* ================= EMPTY ================= */}
                    {!loading &&
                        !error &&
                        applications.length === 0 && (
                            <div className="p-10 text-center">

                                <h2
                                    className="
                                        text-lg font-semibold
                                        text-foreground dark:text-dark-foreground
                                    "
                                >
                                    No Applications Found
                                </h2>

                                <p
                                    className="
                                        mt-2 text-sm
                                        text-muted-foreground dark:text-dark-muted-foreground
                                    "
                                >
                                    Applications matching the selected filters
                                    will appear here.
                                </p>
                            </div>
                        )}
                </AdminPanel>

                {/* ================= PAGINATION ================= */}
                <div className="flex flex-col md:flex-row items-center justify-between  gap-4 "   >

                    {/* TOTAL */}
                    <p className="  text-sm text-muted-foreground dark:text-dark-muted-foreground "   >
                        Total Applications:{" "}
                        <span className="font-semibold text-foreground dark:text-dark-foreground">
                            {totalApplications}
                        </span>
                    </p>

                    <Paginator page={page} setPage={setPage} totalPages={totalPages} />
                </div>
            </div>
        </AdminLayout>
    );
};

export default ApplicationDashboard;
