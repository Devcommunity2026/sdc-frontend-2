import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUsers = async (
    setLoading,
    page,
    curr,
    setUsers,
    setTotalPages
) => {
    try {
        setLoading(true);

        let res;

        // ================= ALL USERS (sorted by role) =================
        if (curr === "All") {
            // Use new admin endpoint that returns users sorted by role hierarchy and then name
            res = await axios.get(
                `${API_URL}/admin/sortedUsers`,
                {
                    withCredentials: true,
                }
            );

            const allUsers = res.data.data || [];
            setUsers(allUsers);
            setTotalPages(1);
        }

        // ================= TEAM =================
        else if (curr === "Team") {
            res = await axios.get(
                `${API_URL}/mod/team?page=${page}&limit=10`,
                {
                    withCredentials: true,
                }
            );

            setUsers(res.data.data || []);
            setTotalPages(1);
        }

        // ================= MENTOR =================
        else if (curr === "Mentor") {
            res = await axios.get(
                `${API_URL}/mod/mentor?page=${page}&limit=10`,
                {
                    withCredentials: true,
                }
            );

            setUsers(res.data.data || []);
            setTotalPages(1);
        }

        // ================= ALUMNI =================
        else if (curr === "Alumni") {
            res = await axios.get(
                `${API_URL}/mod/alumni?page=${page}&limit=10`,
                {
                    withCredentials: true,
                }
            );

            setUsers(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
        }
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};

export const handleRoleChange = async (
    email,
    role,
    setOpenMenu,
    setLoading,
    page,
    curr,
    setUsers,
    setTotalPages
) => {
    try {
        const res = await axios.post(
            `${API_URL}/admin/editRole`,
            {
                role,
                email,
            },
            {
                withCredentials: true,
            }
        );

        if (!res.data.success) {
            alert(res.data.message);
            return;
        }

        setOpenMenu(null);

        fetchUsers(
            setLoading,
            page,
            curr,
            setUsers,
            setTotalPages
        );
    } catch (error) {
        if (error.response?.status === 403) {
            alert("You are not authorized to perform this action.");
        } else {
            alert("Something went wrong. Please try again.");
        }

        console.log(error);
    }
};

export const handleBanUser = async (
    email,
    isBanned,
    setOpenMenu,
    refreshUsers
) => {
    try {
        const operation = isBanned ? "remove" : "add";
        const action = isBanned ? "unban" : "ban";

        if (!confirm(`Are you sure you want to ${action} this user?`)) {
            return;
        }

        await axios.post(
            `${API_URL}/admin/banEdit`,
            { email, operation },
            {
                withCredentials: true,
            }
        );

        setOpenMenu?.(null);
        refreshUsers?.();
    } catch (error) {
        alert(error.response?.data?.message || "Ban operation failed");
        console.log(error);
    }
};

export const handleDeleteUser = async (
    email,
    setOpenMenu,
    refreshUsers
) => {
    try {
        if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
            return;
        }

        await axios.post(
            `${API_URL}/admin/deleteUser`,
            { email },
            {
                withCredentials: true,
            }
        );

        setOpenMenu?.(null);
        refreshUsers?.();
    } catch (error) {
        alert(error.response?.data?.message || "Delete user failed");
        console.log(error);
    }
};

export const handleDeleteMember = async (
    id,
    curr,
    fetchAgain
) => {
    try {
        if (!confirm(`Are you sure you want to permanently delete this ${curr === "Team" ? "Team Member" : curr}?`)) {
            return;
        }

        // ================= TEAM DELETE =================
        if (curr === "Team") {
            await axios.post(
                `${API_URL}/edit/removeCoreTeamMember`,
                { id },
                {
                    withCredentials: true,
                }
            );
        }

        // ================= MENTOR DELETE =================
        else if (curr === "Mentor") {
            await axios.post(
                `${API_URL}/edit/removeMentor`,
                { id },
                {
                    withCredentials: true,
                }
            );
        }

        // ================= ALUMNI DELETE =================
        else if (curr === "Alumni") {
            await axios.post(
                `${API_URL}/edit/removeAlumni`,
                { id },
                {
                    withCredentials: true,
                }
            );
        }

        fetchAgain();
    } catch (error) {
        alert(error.response?.data?.message || `Failed to delete ${curr}`);
        console.log(error);
    }
};

export const handleDeleteContent = async (
    id,
    curr,
    refreshUsers
) => {
    try {
        // ================= EVENT DELETE =================
        if (curr === "Events") {
            await axios.post(
                `${API_URL}/edit/removeEvent`,
                { id },
                {
                    withCredentials: true,
                }
            );
        }

        // ================= PROJECT DELETE =================
        else if (curr === "Projects") {
            await axios.post(
                `${API_URL}/edit/removeProject`,
                { id },
                {
                    withCredentials: true,
                }
            );
        }

        refreshUsers();
    } catch (error) {
        console.log(error);
    }
};

export const handleAddMember = async ({
    formData,
    curr,
    setSubmitLoading,
    setLoading,
    page,
    setUsers,
    setTotalPages,
    setOpenAddModal,
    setFormData,
    fetchUsers,
}) => {
    try {
        setSubmitLoading(true);

        if (curr === "Alumni") {
            const trimmedName = formData.name?.trim();
            const trimmedCompany = formData.company?.trim();
            const parsedYear = Number(formData.passingYear);

            if (!trimmedName || !trimmedCompany || !formData.passingYear || isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
                alert("Please provide Name, Company, and a valid Passing Year (between 1900 and 2100)");
                setSubmitLoading(false);
                return;
            }

            await axios.post(
                `${API_URL}/edit/addAlumni`,
                {
                    name: trimmedName,
                    company: trimmedCompany,
                    passingYear: parsedYear,
                },
                {
                    withCredentials: true,
                }
            );
        } else {
            const data = new FormData();

            data.append("name", formData.name);
            data.append("linkedin", formData.linkedin);
            data.append("image", formData.image);

            if (curr === "Team") {
                data.append("post", formData.post);

                await axios.post(
                    `${API_URL}/edit/addCoreTeamMember`,
                    data,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else if (curr === "Mentor") {
                data.append("description", formData.description);

                await axios.post(
                    `${API_URL}/edit/addMentor`,
                    data,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }
        }

        await fetchUsers(
            setLoading,
            page,
            curr,
            setUsers,
            setTotalPages
        );

        setOpenAddModal(false);

        setFormData({
            name: "",
            post: "",
            description: "",
            company: "",
            passingYear: "",
            linkedin: "",
            image: null,
        });
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || `Failed to add ${curr}`);
    } finally {
        setSubmitLoading(false);
    }
};

export const handleEditMember = async ({
    id,
    formData,
    curr,
    setSubmitLoading,
    setLoading,
    page,
    setUsers,
    setTotalPages,
    setOpenEditModal,
    fetchUsers,
}) => {
    try {
        setSubmitLoading(true);

        if (curr === "Alumni") {
            const trimmedName = formData.name?.trim();
            const trimmedCompany = formData.company?.trim();
            const parsedYear = Number(formData.passingYear);

            if (!trimmedName || !trimmedCompany || !formData.passingYear || isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
                alert("Please provide Name, Company, and a valid Passing Year (between 1900 and 2100)");
                setSubmitLoading(false);
                return;
            }

            await axios.post(
                `${API_URL}/edit/editAlumni`,
                {
                    id,
                    name: trimmedName,
                    company: trimmedCompany,
                    passingYear: parsedYear,
                },
                {
                    withCredentials: true,
                }
            );
        } else {
            const data = new FormData();
            data.append("id", id);
            data.append("name", formData.name);
            data.append("linkedin", formData.linkedin);
            if (formData.image) {
                data.append("image", formData.image);
            }

            if (curr === "Team") {
                data.append("post", formData.post);

                await axios.post(`${API_URL}/edit/editCoreTeamMember`, data, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else if (curr === "Mentor") {
                data.append("description", formData.description);

                await axios.post(`${API_URL}/edit/editMentor`, data, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
        }

        await fetchUsers(
            setLoading,
            page,
            curr,
            setUsers,
            setTotalPages
        );
        setOpenEditModal(false);
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to edit member");
    } finally {
        setSubmitLoading(false);
    }
};