import React, { useState } from "react";
import axios from "axios";
import ModalCloseButton from "../ui/ModalCloseButton";

const ContentAddModal = ({ curr, setOpenAddModal, refreshUsers }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        subHeading: "",
        description: "",
        live: "",
        form: "",
        date: "",
        techStack: "",
        author: "",
        readTime: "",
        tags: "",
        image: null,
    });

    const insertFormat = (syntaxBefore, syntaxAfter = "") => {
        const textarea = document.getElementById("blog-description");
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start, end);

        const replacement = syntaxBefore + (selected || "text") + syntaxAfter;
        const newValue = text.substring(0, start) + replacement + text.substring(end);

        setFormData({
            ...formData,
            description: newValue
        });

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + syntaxBefore.length, start + syntaxBefore.length + (selected || "text").length);
        }, 0);
    };

    const handleAddMember = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const data = new FormData();

            // Name acts as title/name
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("image", formData.image);

            // ================= EVENTS =================
            if (curr === "Events") {
                data.append("subHeading", formData.subHeading);
                data.append("date", formData.date);
                data.append("form", formData.form);

                await axios.post(
                    `${API_URL}/edit/addEvent`,
                    data,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            // ================= PROJECTS =================
            else if (curr === "Projects") {
                data.append("subHeading", formData.subHeading);
                data.append("live", formData.live);
                data.append(
                    "techStack",
                    JSON.stringify(
                        formData.techStack
                            .split(",")
                            .map((item) => item.trim())
                    )
                );

                await axios.post(
                    `${API_URL}/edit/addProject`,
                    data,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            // ================= BLOGS =================
            else if (curr === "Blogs") {
                const blogData = new FormData();
                blogData.append("title", formData.name);
                blogData.append("subHeading", formData.subHeading);
                blogData.append("subtitle", formData.subHeading);
                blogData.append("description", formData.description);
                blogData.append("formattedContent", formData.description);
                blogData.append("author", formData.author);
                blogData.append("readTime", formData.readTime || "5 min read");
                blogData.append("tags", formData.tags || "");
                if (formData.date) {
                    blogData.append("date", formData.date);
                }
                blogData.append("image", formData.image);

                await axios.post(
                    `${API_URL}/edit/addBlog`,
                    blogData,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            refreshUsers();
            setOpenAddModal(false);
        } catch (error) {
            console.error("Error adding content:", error);
            alert(error.response?.data?.message || "Failed to add content");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay overflow-y-auto py-10">
            <div className="modal-panel modal-panel-scroll w-full max-w-lg p-6 space-y-5 my-auto custom-scrollbar">
                
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

                <form onSubmit={handleAddMember} className="modal-form-scroll space-y-4 text-left">
                    {/* NAME / TITLE */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                            {curr === "Blogs" ? "Title *" : "Name *"}
                        </label>
                        <input
                            type="text"
                            required
                            placeholder={curr === "Blogs" ? "Blog Title" : "Name"}
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground outline-none text-sm"
                        />
                    </div>

                    {/* SUB HEADING */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                            Sub Heading *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Sub Heading"
                            value={formData.subHeading}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    subHeading: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground outline-none text-sm"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                            {curr === "Blogs" ? "Formatted Content (Markdown) *" : "Description / Body *"}
                        </label>
                        {curr === "Blogs" && (
                            <div className="flex flex-wrap gap-1 p-1.5 rounded-t-xl border border-b-0 border-border dark:border-dark-border bg-muted/40 dark:bg-dark-muted/10">
                                <button
                                    type="button"
                                    onClick={() => insertFormat("## ", "\n")}
                                    className="px-2 py-1 rounded text-xs font-bold hover:bg-secondary dark:hover:bg-dark-secondary transition text-foreground dark:text-dark-foreground cursor-pointer"
                                    title="Heading 2"
                                >
                                    H2
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertFormat("### ", "\n")}
                                    className="px-2 py-1 rounded text-xs font-bold hover:bg-secondary dark:hover:bg-dark-secondary transition text-foreground dark:text-dark-foreground cursor-pointer"
                                    title="Heading 3"
                                >
                                    H3
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertFormat("**", "**")}
                                    className="px-2 py-1 rounded text-xs font-bold hover:bg-secondary dark:hover:bg-dark-secondary transition text-foreground dark:text-dark-foreground cursor-pointer"
                                    title="Bold"
                                >
                                    Bold
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertFormat("*", "*")}
                                    className="px-2 py-1 rounded text-xs font-bold hover:bg-secondary dark:hover:bg-dark-secondary transition text-foreground dark:text-dark-foreground cursor-pointer"
                                    title="Italic"
                                >
                                    Italic
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertFormat("- ", "\n")}
                                    className="px-2 py-1 rounded text-xs font-bold hover:bg-secondary dark:hover:bg-dark-secondary transition text-foreground dark:text-dark-foreground cursor-pointer"
                                    title="Bullet List"
                                >
                                    List
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertFormat("`", "`")}
                                    className="px-2 py-1 rounded text-xs font-bold hover:bg-secondary dark:hover:bg-dark-secondary transition text-foreground dark:text-dark-foreground cursor-pointer"
                                    title="Inline Code"
                                >
                                    Code
                                </button>
                            </div>
                        )}
                        <textarea
                            id="blog-description"
                            required
                            placeholder={curr === "Blogs" ? "Write your blog content here using formatting tools or markdown syntax..." : "Detailed description content..."}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            className={`w-full px-4 py-2.5 border border-border dark:border-dark-border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground outline-none text-sm min-h-[150px] ${curr === "Blogs" ? "rounded-b-xl border-t-0" : "rounded-xl"}`}
                        />
                    </div>

                    {/* EVENTS & BLOGS DATE */}
                    {(curr === "Events" || curr === "Blogs") && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Date {curr === "Events" && "*"}
                            </label>
                            <input
                                type="date"
                                required={curr === "Events"}
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        date: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground outline-none text-sm"
                            />
                        </div>
                    )}

                    {/* EVENTS SPECIFIC */}
                    {curr === "Events" && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                Registration Form URL *
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://..."
                                value={formData.form}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        form: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground outline-none text-sm"
                            />
                        </div>
                    )}

                    {/* PROJECTS SPECIFIC */}
                    {curr === "Projects" && (
                        <>


                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                    Live Project URL *
                                </label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://..."
                                    value={formData.live}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            live: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground outline-none text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                    Tech Stack (comma separated) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="React, Tailwind, Node.js"
                                    value={formData.techStack}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            techStack: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground outline-none text-sm"
                                />
                            </div>
                        </>
                    )}

                    {/* BLOGS SPECIFIC */}
                    {curr === "Blogs" && (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                    Author Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Author"
                                    value={formData.author}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            author: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground outline-none text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                    Read Time (e.g., 5 min read) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="5 min read"
                                    value={formData.readTime}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            readTime: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground outline-none text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="React, WebDev, CSS"
                                    value={formData.tags}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            tags: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground outline-none text-sm"
                                />
                            </div>
                        </>
                    )}

                    {/* IMAGE FILE UPLOAD */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
                            Upload Thumbnail Image *
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    image: e.target.files[0],
                                });
                            }}
                            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 dark:file:bg-dark-primary/10 dark:file:text-dark-primary cursor-pointer"
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-4 rounded-xl bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Adding..." : `Add ${curr}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContentAddModal;
