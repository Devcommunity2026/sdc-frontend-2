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

export const fetchAlumniData = async (setLoading, setAlumni, setError) => {
    try {
        setLoading?.(true);
        setError?.(null);

        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/public/alumni`
        );

        if (res.data.success) {
            setAlumni(res.data.data || []);
        } else {
            setError?.(res.data.message || "Failed to fetch alumni");
        }
    } catch (error) {
        console.error("Failed to fetch alumni", error);
        setError?.(error.response?.data?.message || "Failed to load alumni records. Please try again later.");
    } finally {
        setLoading?.(false);
    }
};