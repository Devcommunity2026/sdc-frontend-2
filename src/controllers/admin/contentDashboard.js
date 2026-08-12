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

        // ================= BLOGS =================
        if (curr === "Blogs") {

            res = await axios.get(
                `${API_URL}/mod/blog?page=${page}&limit=10`,
                {
                    withCredentials: true
                }
            );

            setUsers(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
        }

        // ================= EVENTS =================
        else if (curr === "Events") {

            res = await axios.get(
                `${API_URL}/mod/event?page=${page}&limit=10`,
                {
                    withCredentials: true
                }
            );

            setUsers(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
        }

        // ================= PROJECTS =================
        else if (curr === "Projects") {

            res = await axios.get(
                `${API_URL}/mod/project?page=${page}&limit=10`, 
                {
                    withCredentials: true
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

export const handleRoleChange = async (id, role) => {
    try {
        console.log("Change Role:", id, role);

        // await axios.post(
        //     `${API_URL}/admin/editRole`,
        //     { role, id },
        //     { withCredentials: true }
        // );

    } catch (error) {
        console.log(error);
    }
};

export const handleBanUser = async (id) => {
    try {

        await axios.patch(
            `${API_URL}/mod/ban-user/${id}`,
            {},
            { withCredentials: true }
        );

    } catch (error) {
        console.log(error);
    }
};

export const handleDeleteMember = async (
    id,
    curr,
    fetchAgain
) => {

    try {

        // TEAM DELETE
        if (curr === "Team") {

            await axios.post(
                `${API_URL}/edit/removeCoreTeamMember`,
                { id },
                {
                    withCredentials: true,
                }
            );
        }

        // MENTOR DELETE
        else if (curr === "Mentor") {

            await axios.post(
                `${API_URL}/edit/removeMentor`,
                { id },
                {
                    withCredentials: true,
                }
            );
        }

        fetchAgain();

    } catch (error) {
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

        // ================= BLOG DELETE =================
        else if (curr === "Blogs") {

            await axios.post(
                `${API_URL}/edit/removeBlog`,
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

export const handleEditContent = async ({
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
        const data = new FormData();
        data.append("id", id);
        data.append("name", formData.name);
        data.append("description", formData.description);
        if (formData.image) {
            data.append("image", formData.image);
        }

        if (curr === "Events") {
            data.append("subHeading", formData.subHeading);
            data.append("date", formData.date);
            data.append("form", formData.form);

            await axios.post(`${API_URL}/edit/editEvent`, data, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } else if (curr === "Projects") {
            data.append("subHeading", formData.subHeading);
            data.append("live", formData.live);
            data.append(
                "techStack",
                Array.isArray(formData.techStack)
                    ? JSON.stringify(formData.techStack)
                    : JSON.stringify(
                        formData.techStack
                            .split(",")
                            .map((item) => item.trim())
                      )
            );

            await axios.post(`${API_URL}/edit/editProject`, data, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } else if (curr === "Blogs") {
            data.append("title", formData.name);
            data.append("subHeading", formData.subHeading);
            data.append("subtitle", formData.subHeading);
            data.append("formattedContent", formData.description);
            data.append("author", formData.author);
            data.append("readTime", formData.readTime || "5 min read");
            data.append("tags", formData.tags || "");
            if (formData.date) {
                data.append("date", formData.date);
            }

            await axios.post(`${API_URL}/edit/editBlog`, data, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }

        await fetchUsers(
            setLoading,
            page,
            curr,
            setUsers,
            setTotalPages
        );
        setOpenEditModal(false);
        alert(`${curr === "Blogs" ? "Blog" : curr === "Events" ? "Event" : "Project"} updated successfully`);
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to edit content");
    } finally {
        setSubmitLoading(false);
    }
};
