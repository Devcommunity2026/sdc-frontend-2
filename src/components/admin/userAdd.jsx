import React from 'react'
import { handleAddMember } from '../../controllers/admin/userDashboard';
import { useState } from 'react';
import ModalCloseButton from '../ui/ModalCloseButton';

const UserAdd = ({
    curr,
    setOpenAddModal,
    setLoading,
    page,
    setUsers,
    setTotalPages,
    fetchUsers
}) => {

    const [formData, setFormData] = useState({
        name: "",
        post: "",
        description: "",
        company: "",
        passingYear: "",
        linkedin: "",
        image: null,
    });
    const [submitLoading, setSubmitLoading] = useState(false);
   

    return (
        <div className="modal-overlay">
            <div className="modal-panel w-full max-w-lg p-6 space-y-5">

                {/* HEADER */}
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-foreground dark:text-dark-foreground">
                        Add {curr}
                    </h2>

                    <ModalCloseButton
                        variant="inline"
                        onClick={() => setOpenAddModal(false)}
                    />
                </div>


                {/* NAME */}
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none"
                />

                {/* COMPANY (ALUMNI ONLY) */}
                {curr === "Alumni" && (
                    <input
                        type="text"
                        placeholder="Company Name (e.g. Google, Microsoft)"
                        value={formData.company}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                company: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none"
                    />
                )}

                {/* PASSING YEAR (ALUMNI ONLY) */}
                {curr === "Alumni" && (
                    <input
                        type="number"
                        placeholder="Passing Year (e.g. 2022)"
                        min="1900"
                        max="2100"
                        value={formData.passingYear}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                passingYear: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none"
                    />
                )}

                {/* POST */}
                {curr === "Team" && (
                    <input
                        type="text"
                        placeholder="Post"
                        value={formData.post}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                post: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none"
                    />
                )}

                {/* DESCRIPTION */}
                {curr === "Mentor" && (
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none min-h-[120px]"
                    />
                )}

                {/* LINKEDIN */}
                {curr !== "Alumni" && (
                    <input
                        type="text"
                        placeholder="LinkedIn URL"
                        value={formData.linkedin}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                linkedin: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-transparent outline-none"
                    />
                )}

                {/* IMAGE */}
                {curr !== "Alumni" && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                image: e.target.files[0],
                            });
                        }}
                        className="w-full"
                    />
                )}

                {/* SUBMIT */}
                <button
                    onClick={() =>
                        handleAddMember({
                            formData,
                            curr,
                            setSubmitLoading,
                            setLoading,
                            page,
                            setUsers,
                            setTotalPages,
                            setOpenAddModal,
                            setFormData,
                            fetchUsers
                        })
                    }
                    disabled={submitLoading}
                    className={`w-full py-3 rounded-xl font-medium transition-all duration-200
                            
                                ${submitLoading
                            ? "bg-primary/70 cursor-not-allowed text-primary-foreground dark:bg-dark-primary/70 dark:text-dark-primary-foreground"
                            : "bg-primary hover:opacity-90 text-primary-foreground dark:bg-dark-primary dark:text-dark-primary-foreground"
                        }
                            `}
                >
                    {submitLoading ? (
                        <div className="flex items-center justify-center gap-2">

                            <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground dark:border-dark-primary-foreground/30 dark:border-t-dark-primary-foreground rounded-full animate-spin" />

                            <span>
                                Adding {curr}...
                            </span>
                        </div>
                    ) : (
                        `Add ${curr}`
                    )}
                </button>
            </div>
        </div >
    )
}

export default UserAdd
