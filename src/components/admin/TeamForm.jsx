import React, { useState } from "react";
import axios from "axios";

import AdminLayout from "../../components/admin/AdminLayout";

const TeamForm = () => {

    const [loading, setLoading] = useState(false);

    const [imagePreview, setImagePreview] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        post: "",
        linkedin: "",
    });

    const [image, setImage] = useState(null);

    // ================= INPUT CHANGE =================
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ================= IMAGE CHANGE =================
    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setImage(file);

        setImagePreview(
            URL.createObjectURL(file)
        );
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const sendData = new FormData();

            sendData.append(
                "name",
                formData.name
            );

            sendData.append(
                "post",
                formData.post
            );

            sendData.append(
                "linkedin",
                formData.linkedin
            );

            sendData.append(
                "image",
                image
            );

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/edit/addCoreTeamMember`,
                sendData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );


            alert("Team Member Added");

            // ================= RESET =================
            setFormData({
                name: "",
                post: "",
                linkedin: "",
            });

            setImage(null);
            setImagePreview("");

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    return (
        <AdminLayout>

            <div className="w-full flex items-center justify-center py-10 px-4">

                <form
                    onSubmit={handleSubmit}
                    className="
                        w-full max-w-2xl
                        rounded-3xl
                        border border-border dark:border-dark-border
                        bg-card dark:bg-dark-card
                        shadow-sm
                        p-8
                        space-y-6
                    "
                >

                    {/* ================= TITLE ================= */}
                    <div className="space-y-2">

                        <h1 className="text-3xl font-bold text-card-foreground dark:text-dark-card-foreground">
                            Add Team Member
                        </h1>

                        <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                            Fill all required details
                        </p>
                    </div>

                    {/* ================= NAME ================= */}
                    <div className="space-y-2">

                        <label className="text-sm font-medium">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            required
                            className="
                                w-full h-12 px-4 rounded-xl
                                border border-border dark:border-dark-border
                                bg-background dark:bg-dark-background
                                outline-none
                            "
                        />
                    </div>

                    {/* ================= POST ================= */}
                    <div className="space-y-2">

                        <label className="text-sm font-medium">
                            Post
                        </label>

                        <input
                            type="text"
                            name="post"
                            value={formData.post}
                            onChange={handleChange}
                            placeholder="Enter position/post"
                            required
                            className="
                                w-full h-12 px-4 rounded-xl
                                border border-border dark:border-dark-border
                                bg-background dark:bg-dark-background
                                outline-none
                            "
                        />
                    </div>

                    {/* ================= LINKEDIN ================= */}
                    <div className="space-y-2">

                        <label className="text-sm font-medium">
                            Linkedin URL
                        </label>

                        <input
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/..."
                            required
                            className="
                                w-full h-12 px-4 rounded-xl
                                border border-border dark:border-dark-border
                                bg-background dark:bg-dark-background
                                outline-none
                            "
                        />
                    </div>

                    {/* ================= IMAGE ================= */}
                    <div className="space-y-3">

                        <label className="text-sm font-medium">
                            Upload Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            className="
                                w-full p-3 rounded-xl
                                border border-border dark:border-dark-border
                                bg-background dark:bg-dark-background
                            "
                        />

                        {/* PREVIEW */}
                        {imagePreview && (

                            <img
                                src={imagePreview}
                                alt="preview"
                                className="
                                    h-32 w-32 rounded-2xl
                                    object-cover
                                    border border-border dark:border-dark-border
                                "
                            />
                        )}
                    </div>

                    {/* ================= BUTTON ================= */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full h-12 rounded-xl
                            bg-primary dark:bg-dark-primary
                            text-primary-foreground dark:text-dark-primary-foreground
                            font-semibold
                            hover:opacity-90
                            transition
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Adding..."
                            : "Add Team Member"}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default TeamForm;