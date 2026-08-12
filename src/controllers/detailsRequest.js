import axios from "axios";

export const fetchProjects = async (currentPage, limit, setProjects, setTotalPages, setLoading) => {
    try {
        setLoading(true);

        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/public/project?page=${currentPage}&limit=${limit}`
        );

        if (res.data.success) {
            setProjects(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
        }
    } catch (error) {
        console.error("Failed to fetch projects", error);
    } finally {
        setLoading(false);
    }
}

export const fetchEvents = async ({
    currentPage,
    limit,
    setLoading,
    setEvents,
    setTotalPages,
}) => {
    try {
        setLoading(true);

        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/public/event?page=${currentPage}&limit=${limit}`
        );

        if (res.data.success) {
            setEvents(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
        }
    } catch (error) {
        console.error("Failed to fetch events", error);
    } finally {
        setLoading(false);
    }
};

export const fetchPeopleData = async (setLoading, setTeamMembers, setMentors) => {
    try {
        setLoading(true);

        const [teamRes, mentorRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/public/team`),

            axios.get(
                `${import.meta.env.VITE_API_URL}/public/mentor?page=1&limit=6`
            ),
        ]);

        // Team
        if (teamRes.data.success) {
    
            setTeamMembers(teamRes.data.data);
        }

        // Mentors
        if (mentorRes.data.success) {
            setMentors(mentorRes.data.data);
        }
    } catch (error) {
        console.error("Failed to fetch people data", error);
    } finally {
        setLoading(false);
    }
};

export const fetchBlogs = async (currentPage, limit, setBlogs, setTotalPages, setLoading) => {
    try {
        setLoading(true);

        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/public/blog?page=${currentPage}&limit=${limit}`
        );

        if (res.data.success) {
            setBlogs(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
        }
    } catch (error) {
        console.error("Failed to fetch blogs", error);
    } finally {
        setLoading(false);
    }
};