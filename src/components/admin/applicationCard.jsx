import React, { useState } from "react";
import { Mail, Phone, GraduationCap, Code2, FileText, CheckCircle2, Clock3, XCircle, Trash2, Loader2 } from "lucide-react";
import { handleStateChange, handleDeleteApplication } from '../../controllers/admin/ApplicationDashBoard';

import { FaGithub, FaLinkedin } from "react-icons/fa";

const statusColors = {
    Applied: "bg-info/10 text-info dark:bg-dark-info/20 dark:text-dark-info",
    "On Hold": "bg-warning/10 text-warning dark:bg-dark-warning/20 dark:text-dark-warning",
    Selected: "bg-success/10 text-success dark:bg-dark-success/20 dark:text-dark-success",
    Rejected: "bg-danger/10 text-danger dark:bg-dark-danger/20 dark:text-dark-danger",
};

const ApplicationCard = ({ application, curr, onDelete }) => {
    const [loading, setLoading] = useState("");

    const handleDeleteClick = async () => {
        const applicantName = application?.name ? ` for "${application.name}"` : "";
        const confirmed = window.confirm(
            `Are you sure you want to permanently delete this rejected application${applicantName}? This will remove it completely from the database and cannot be undone.`
        );
        if (!confirmed) return;

        await handleDeleteApplication(application?._id || application, setLoading, onDelete);
    };


    return (
        <div className="w-full bg-card p-4 transition-all duration-300 hover:bg-secondary/40 dark:bg-dark-card dark:hover:bg-dark-secondary/40 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start">

                {/* ================= LEFT ================= */}
                <div className="flex-1 space-y-5">

                    {/* NAME + STATUS */}
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground sm:text-2xl">
                            {application?.name}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[application?.status]}`}>
                            {application?.status}
                        </span>
                    </div>

                    {/* CONTACT INFO */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                            <Mail size={18} />
                            <span className="break-all">{application?.email}</span>
                        </div>
                        <div className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                            <Phone size={18} />
                            <span className="break-all">{application?.phone}</span>
                        </div>
                        <div className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                            <GraduationCap size={18} />
                            <span>{application?.college} • {application?.branch}</span>
                        </div>
                        <div className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                            <Code2 size={18} />
                            <span>Year {application?.year} • {application?.domain}</span>
                        </div>
                    </div>

                    {/* SKILLS */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 text-foreground dark:text-dark-foreground">
                            Skills
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
                    <div>
                        <h3 className="text-sm font-semibold mb-2 text-foreground dark:text-dark-foreground">
                            Motivation
                        </h3>
                        <p className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-muted-foreground dark:border-dark-border dark:bg-dark-background dark:text-dark-muted-foreground">
                            {application?.motivation}
                        </p>
                    </div>
                </div>

                {/* ================= RIGHT ================= */}
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[260px] xl:grid-cols-1">

                    {/* GITHUB */}
                    <a
                        href={application?.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:bg-secondary dark:border-dark-border dark:bg-dark-background dark:hover:bg-dark-secondary"
                    >
                        <FaGithub size={20} className="text-foreground dark:text-dark-foreground" />
                        <div>
                            <p className="text-sm font-semibold text-foreground dark:text-dark-foreground">GitHub</p>
                            <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">View Profile</p>
                        </div>
                    </a>

                    {/* LINKEDIN */}
                    <a
                        href={application?.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:bg-secondary dark:border-dark-border dark:bg-dark-background dark:hover:bg-dark-secondary"
                    >
                        <FaLinkedin size={20} className="text-foreground dark:text-dark-foreground" />
                        <div>
                            <p className="text-sm font-semibold text-foreground dark:text-dark-foreground">LinkedIn</p>
                            <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">View Profile</p>
                        </div>
                    </a>

                    {/* RESUME */}
                    {(application?.resumeUrl || application?.resume) ? (
                        <div className="flex flex-col justify-between gap-2 rounded-xl border border-border bg-background p-3.5 dark:border-dark-border dark:bg-dark-background">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <FileText size={18} className="text-primary dark:text-dark-primary shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-foreground dark:text-dark-foreground truncate" title={application?.resumeOriginalName || "Resume"}>
                                        {application?.resumeOriginalName || "Resume Document"}
                                    </p>
                                    <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                                        Uploaded Document
                                    </p>
                                </div>
                            </div>
                            <a
                                href={application?.resumeUrl || application?.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground dark:bg-dark-primary/20 dark:text-dark-primary dark:hover:bg-dark-primary dark:hover:text-dark-primary-foreground"
                            >
                                <FileText size={13} /> View Resume
                            </a>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-background/50 p-4 opacity-70 dark:border-dark-border dark:bg-dark-background/50">
                            <FileText size={20} className="text-muted-foreground dark:text-dark-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground dark:text-dark-muted-foreground">
                                    Resume not uploaded
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ================= ACTION BUTTONS ================= */}
            <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-5 dark:border-dark-border">

                {/* ACCEPT */}
                {curr !== "Selected" && (
                    <button
                        disabled={loading != ""}
                        onClick={() => handleStateChange("Selected", application?._id || application, setLoading)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-success px-5 py-2.5 text-sm font-medium text-success-foreground transition-all duration-200 hover:bg-success-hover disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-success dark:hover:bg-dark-success-hover sm:flex-none"
                    >
                        {loading == "Selected" ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                        {loading == "Selected" ? "Updating..." : "Accept"}
                    </button>
                )}

                {/* ON HOLD */}
                {curr !== "On Hold" && (
                    <button
                        disabled={loading != ""}
                        onClick={() => handleStateChange("On Hold", application?._id || application, setLoading)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-warning px-5 py-2.5 text-sm font-medium text-warning-foreground transition-all duration-200 hover:bg-warning-hover disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-warning dark:hover:bg-dark-warning-hover sm:flex-none"
                    >
                        {loading == "On Hold" ? <Loader2 size={18} className="animate-spin" /> : <Clock3 size={18} />}
                        {loading == "On Hold" ? "Updating..." : "On Hold"}
                    </button>
                )}

                {/* REJECT */}
                {curr !== "Rejected" && (
                    <button
                        disabled={loading != ""}
                        onClick={() => handleStateChange("Rejected", application?._id || application, setLoading)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger px-5 py-2.5 text-sm font-medium text-danger-foreground transition-all duration-200 hover:bg-danger-hover disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-danger dark:hover:bg-dark-danger-hover sm:flex-none"
                    >
                        {loading == "Rejected" ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                        {loading == "Rejected" ? "Updating..." : "Reject"}
                    </button>
                )}

                {/* DELETE (Only for Rejected applications) */}
                {(curr === "Rejected" || application?.status === "Rejected") && (
                    <button
                        disabled={loading != ""}
                        onClick={handleDeleteClick}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger px-5 py-2.5 text-sm font-medium text-danger-foreground transition-all duration-200 hover:bg-danger-hover disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-danger dark:hover:bg-dark-danger-hover sm:flex-none"
                    >
                        {loading == "Deleting" ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        {loading == "Deleting" ? "Deleting..." : "Delete"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ApplicationCard;
