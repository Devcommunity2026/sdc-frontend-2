import axios from "axios";

export const fetchHomeData = async ({
    setEvents,
    setMentors,
    setCommunityStats,
}) => {
    try {
        const [eventsRes, mentorsRes, statsRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/public/event?page=1&limit=3`),
            axios.get(`${import.meta.env.VITE_API_URL}/public/mentor?page=1&limit=3`),
            axios.get(`${import.meta.env.VITE_API_URL}/public/stats`),
        ]);

        if (eventsRes.data.success) {
            setEvents(eventsRes.data.data);
        }

        if (mentorsRes.data.success) {
            setMentors(mentorsRes.data.data);
        }

        if (statsRes.data.success) {
            setCommunityStats([
                {
                    label: "Users",
                    value: statsRes.data.data.users || 0,
                },
                {
                    label: "Mentors",
                    value: statsRes.data.data.mentors || 0,
                },
                {
                    label: "Members",
                    value: statsRes.data.data.members || 0,
                },
                {
                    label: "Domains",
                    value: 6,
                },
            ]);
        }
    } catch (error) {
        console.error("Failed to fetch home data", error);
    }
};