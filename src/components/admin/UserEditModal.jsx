import React, { useState } from "react";
import { handleEditMember } from "../../controllers/admin/userDashboard";
import ModalCloseButton from "../ui/ModalCloseButton";

const UserEditModal = ({ curr, user, setOpenEditModal, page, setUsers, setTotalPages, setLoading, fetchUsers }) => {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || "",
        post: user.post || "",
        description: user.description || "",
        company: user.company || "",
        passingYear: user.passingYear || "",
        linkedin: user.linkedin || user.linkedIn || "",
        image: null,
    });

    const handleEdit = (e) => {
        e.preventDefault();
        handleEditMember({
            id: user._id,
            formData,
            curr,
            setSubmitLoading,
            setLoading,
            page,
            setUsers,
            setTotalPages,
            setOpenEditModal,
            fetchUsers,
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-panel w-full max-w-lg p-6 space-y-5">
                
                {/* HEADER */}
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-foreground dark:text-dark-foreground">
                        Edit {curr === "Team" ? "Team Member" : curr}
                    </h2>
                    <ModalCloseButton
                        variant="inline"
                        onClick={() => setOpenEditModal(false)}
                    />
                </div>

                <form onSubmit={handleEdit} className="space-y-4 text-left">
                    {/* NAME */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                            Name *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none text-sm text-foreground dark:text-dark-foreground"
                        />
                    </div>

                    {/* COMPANY (ALUMNI ONLY) */}
                    {curr === "Alumni" && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Company *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Company"
                                value={formData.company}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        company: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none text-sm text-foreground dark:text-dark-foreground"
                            />
                        </div>
                    )}

                    {/* PASSING YEAR (ALUMNI ONLY) */}
                    {curr === "Alumni" && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Passing Year *
                            </label>
                            <input
                                type="number"
                                required
                                placeholder="Passing Year"
                                min="1900"
                                max="2100"
                                value={formData.passingYear}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        passingYear: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none text-sm text-foreground dark:text-dark-foreground"
                            />
                        </div>
                    )}

                    {/* POST (TEAM ONLY) */}
                    {curr === "Team" && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Post *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Post"
                                value={formData.post}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        post: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none text-sm text-foreground dark:text-dark-foreground"
                            />
                        </div>
                    )}

                    {/* DESCRIPTION (MENTOR ONLY) */}
                    {curr === "Mentor" && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Description *
                            </label>
                            <textarea
                                required
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none min-h-[120px] text-sm text-foreground dark:text-dark-foreground"
                            />
                        </div>
                    )}

                    {/* LINKEDIN */}
                    {curr !== "Alumni" && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                LinkedIn URL *
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="LinkedIn URL"
                                value={formData.linkedin}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        linkedin: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none text-sm text-foreground dark:text-dark-foreground"
                            />
                        </div>
                    )}

                    {/* IMAGE FILE UPLOAD */}
                    {curr !== "Alumni" && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Upload Image (leave empty to keep current)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        image: e.target.files[0],
                                    });
                                }}
                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 dark:file:bg-dark-primary/10 dark:file:text-dark-primary cursor-pointer text-foreground dark:text-dark-foreground"
                            />
                        </div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={submitLoading}
                        className="w-full py-3 rounded-xl font-medium transition-all duration-200 bg-primary hover:opacity-90 text-white disabled:opacity-50 cursor-pointer"
                    >
                        {submitLoading ? "Updating..." : `Update ${curr === "Team" ? "Team Member" : curr}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;
