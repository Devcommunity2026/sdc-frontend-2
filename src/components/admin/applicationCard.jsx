import React, { useState } from "react";
import {
    Mail,
    Phone,
    GraduationCap,
    Code2,
    FileText,
    CheckCircle2,
    Clock3,
    XCircle,
    Loader2,
    Trash2,
    ExternalLink,
    Calendar
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const statusColors = {
    Applied: "bg-info/10 text-info dark:bg-dark-info/20 dark:text-dark-info border-info/30",
    "On Hold": "bg-warning/10 text-warning dark:bg-dark-warning/20 dark:text-dark-warning border-warning/30",
    ON_HOLD: "bg-warning/10 text-warning dark:bg-dark-warning/20 dark:text-dark-warning border-warning/30",
    Selected: "bg-success/10 text-success dark:bg-dark-success/20 dark:text-dark-success border-success/30",
    SELECTED: "bg-success/10 text-success dark:bg-dark-success/20 dark:text-dark-success border-success/30",
    Rejected: "bg-danger/10 text-danger dark:bg-dark-danger/20 dark:text-dark-danger border-danger/30",
    REJECTED: "bg-danger/10 text-danger dark:bg-dark-danger/20 dark:text-dark-danger border-danger/30",
};

const formatStatusLabel = (status) => {
    if (!status) return "On Hold";
    const s = String(status).toUpperCase();
    if (s === "ON_HOLD" || s === "ON HOLD") return "ON_HOLD";
    if (s === "SELECTED") return "SELECTED";
    if (s === "REJECTED") return "REJECTED";
    return status;
};

const ApplicationCard = ({
    application,
    curr,
    onStatusChange,
    onDeleteRequest
}) => {
    const [loadingStatus, setLoadingStatus] = useState("");

    const currentStatus = formatStatusLabel(application?.status);
    const dateFormatted = application?.createdAt
        ? new Date(application.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "N/A";

    const handleUpdate = async (newStatus) => {
        if (loadingStatus) return;
        setLoadingStatus(newStatus);
        if (onStatusChange) {
            await onStatusChange(application._id, newStatus);
        }
        setLoadingStatus("");
    };

    return (
        <div className="w-full bg-card p-4 transition-all duration-300 hover:bg-secondary/40 dark:bg-dark-card dark:hover:bg-dark-secondary/40 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start">

                {/* ================= LEFT ================= */}
                <div className="flex-1 space-y-5">

                    {/* NAME + POSITION + STATUS + DATE */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground sm:text-2xl">
                                {application?.name}
                            </h2>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                    statusColors[application?.status] || statusColors.ON_HOLD
                                }`}
                            >
                                {currentStatus}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-dark-muted-foreground">
                            <Calendar size={14} />
                            <span>Applied {dateFormatted}</span>
                        </div>
                    </div>

                    {/* CONTACT INFO */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                            <Mail size={18} className="shrink-0 text-primary dark:text-dark-primary" />
                            <span className="break-all">{application?.email}</span>
                        </div>
                        <div className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                            <Phone size={18} className="shrink-0 text-primary dark:text-dark-primary" />
                            <span className="break-all">{application?.phone}</span>
                        </div>
                        <div className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                            <GraduationCap size={18} className="shrink-0 text-primary dark:text-dark-primary" />
                            <span>{application?.college} • {application?.branch}</span>
                        </div>
                        <div className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                            <Code2 size={18} className="shrink-0 text-primary dark:text-dark-primary" />
                            <span className="font-medium text-foreground dark:text-dark-foreground">
                                Year {application?.year} • {application?.domain || application?.position}
                            </span>
                        </div>
                    </div>

                    {/* SKILLS */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5 text-muted-foreground dark:text-dark-muted-foreground">
                            Technical Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {application?.skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-secondary dark:bg-dark-secondary text-secondary-foreground dark:text-dark-secondary-foreground border border-border dark:border-dark-border"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* MOTIVATION */}
                    {application?.motivation && (
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground dark:text-dark-muted-foreground">
                                Why Join SDC
                            </h3>
                            <p className="rounded-xl border border-border bg-background p-3.5 text-sm leading-relaxed text-muted-foreground dark:border-dark-border dark:bg-dark-background dark:text-dark-muted-foreground">
                                {application?.motivation}
                            </p>
                        </div>
                    )}
                </div>

                {/* ================= RIGHT LINKS ================= */}
                <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3 xl:w-[240px] xl:grid-cols-1">

                    {/* VIEW RESUME BUTTON (Cloudinary via streaming/signed URL) */}
                    {application?.resume && (
                        <a
                            href={
                                application?.resumeViewUrl ||
                                (application?._id
                                    ? `${import.meta.env.VITE_API_URL}/api/admin/application/${application._id}/resume`
                                    : application?.resume)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-primary dark:border-dark-primary/40 dark:bg-dark-primary/20 dark:text-dark-primary transition-all duration-200 hover:bg-primary/20"
                        >
                            <div className="flex items-center gap-2.5">
                                <FileText size={18} />
                                <span className="text-sm font-semibold">View Resume</span>
                            </div>
                            <ExternalLink size={15} />
                        </a>
                    )}

                    {/* GITHUB */}
                    {application?.github ? (
                        <a
                            href={application?.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl border border-border bg-background p-3 transition-all duration-200 hover:bg-secondary dark:border-dark-border dark:bg-dark-background dark:hover:bg-dark-secondary"
                        >
                            <div className="flex items-center gap-2.5">
                                <FaGithub size={18} className="text-foreground dark:text-dark-foreground" />
                                <span className="text-xs font-medium text-foreground dark:text-dark-foreground">GitHub</span>
                            </div>
                            <ExternalLink size={13} className="text-muted-foreground" />
                        </a>
                    ) : null}

                    {/* LINKEDIN */}
                    {application?.linkedin ? (
                        <a
                            href={application?.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl border border-border bg-background p-3 transition-all duration-200 hover:bg-secondary dark:border-dark-border dark:bg-dark-background dark:hover:bg-dark-secondary"
                        >
                            <div className="flex items-center gap-2.5">
                                <FaLinkedin size={18} className="text-foreground dark:text-dark-foreground" />
                                <span className="text-xs font-medium text-foreground dark:text-dark-foreground">LinkedIn</span>
                            </div>
                            <ExternalLink size={13} className="text-muted-foreground" />
                        </a>
                    ) : null}
                </div>
            </div>

            {/* ================= ACTION BUTTONS ================= */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 dark:border-dark-border">

                {/* STATUS ACTIONS */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-medium text-muted-foreground dark:text-dark-muted-foreground mr-1">
                        Change Status:
                    </span>

                    {/* SELECTED */}
                    {currentStatus !== "SELECTED" && (
                        <button
                            type="button"
                            disabled={Boolean(loadingStatus)}
                            onClick={() => handleUpdate("SELECTED")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                        >
                            {loadingStatus === "SELECTED" ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <CheckCircle2 size={13} />
                            )}
                            Select
                        </button>
                    )}

                    {/* ON HOLD */}
                    {currentStatus !== "ON_HOLD" && (
                        <button
                            type="button"
                            disabled={Boolean(loadingStatus)}
                            onClick={() => handleUpdate("ON_HOLD")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-amber-600 disabled:opacity-50 cursor-pointer"
                        >
                            {loadingStatus === "ON_HOLD" ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <Clock3 size={13} />
                            )}
                            On Hold
                        </button>
                    )}

                    {/* REJECTED */}
                    {currentStatus !== "REJECTED" && (
                        <button
                            type="button"
                            disabled={Boolean(loadingStatus)}
                            onClick={() => handleUpdate("REJECTED")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
                        >
                            {loadingStatus === "REJECTED" ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <XCircle size={13} />
                            )}
                            Reject
                        </button>
                    )}
                </div>

                {/* DELETE ACTION */}
                <div>
                    <button
                        type="button"
                        onClick={() => onDeleteRequest && onDeleteRequest(application)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 px-3.5 py-1.5 text-xs font-medium text-danger transition-all duration-200 hover:bg-danger/10 cursor-pointer"
                    >
                        <Trash2 size={14} />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationCard;
