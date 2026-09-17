// api/application.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchApplications = async ({
    page,
    limit,
    curr,
    domain,
    setLoading,
    setError,
    setApplications,
    setTotalPages,
    setTotalApplications,
}) => {
    try {
        setLoading(true);
        setError("");

        let url = `${API_URL}/mod/application?page=${page}&limit=${limit}`;

        url += `&status=${encodeURIComponent(curr)}`;

        if (domain !== "All Domains") {
            url += `&domain=${encodeURIComponent(domain)}`;
        }

        const res = await axios.get(url, {
            withCredentials: true,
        });

        const apps =
            res.data.applications ||
            res.data.data ||
            res.data ||
            [];

        setApplications(Array.isArray(apps) ? apps : []);

        setTotalPages(
            res.data.totalPages ||
            res.data.pagination?.totalPages ||
            1
        );

        setTotalApplications(
            res.data.total ||
            res.data.pagination?.total ||
            apps.length ||
            0
        );
    } catch (err) {
        setError(
            err.response?.data?.message ||
            "Failed to fetch applications"
        );
        setApplications([]);
    } finally {
        setLoading(false);
    }
};

export const handleStateChange = async (
    status,
    applicationId,
    setLoading
) => {
    try {
        const id = applicationId?._id || applicationId;
        setLoading(status);

        const response = await axios.post(
            `${API_URL}/edit/application`,
            { id, status },
            { withCredentials: true }
        );

        alert(response?.data?.message || "Application Updated");
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert(
            error?.response?.data?.message ||
            "Failed To Update Application"
        );
    } finally {
        setLoading("");
    }
};

export const handleDeleteApplication = async (
    applicationId,
    setLoading,
    onSuccess
) => {
    try {
        const id = (typeof applicationId === "object" && applicationId !== null)
            ? (applicationId._id || applicationId.id)
            : applicationId;

        if (!id) {
            alert("No valid application ID provided");
            return;
        }

        setLoading("Deleting");

        const response = await axios.post(
            `${API_URL}/edit/removeApplication`,
            { id, applicationId: id },
            { withCredentials: true }
        );

        if (response.data.success) {
            if (onSuccess) {
                onSuccess(id);
            }
        } else {
            alert(response.data.message || "Failed to delete application");
        }
    } catch (error) {
        console.error("Delete application error:", error);
        alert(
            error?.response?.data?.message ||
            error?.message ||
            "Failed To Delete Application"
        );
    } finally {
        setLoading("");
    }
};