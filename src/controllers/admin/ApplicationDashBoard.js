import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch applications with status filter, search query, domain filter, and pagination
 */
export const fetchApplications = async ({
    page = 1,
    limit = 10,
    curr = "All",
    domain = "All Domains",
    search = "",
    setLoading,
    setError,
    setApplications,
    setTotalPages,
    setTotalApplications,
}) => {
    try {
        if (setLoading) setLoading(true);
        if (setError) setError("");

        let url = `${API_URL}/api/admin/applications?page=${page}&limit=${limit}`;

        if (curr && curr !== "All" && curr !== "All Applications") {
            url += `&status=${encodeURIComponent(curr)}`;
        }

        if (domain && domain !== "All" && domain !== "All Domains") {
            url += `&domain=${encodeURIComponent(domain)}`;
        }

        if (search && search.trim()) {
            url += `&search=${encodeURIComponent(search.trim())}`;
        }

        const res = await axios.get(url, {
            withCredentials: true,
        });

        const apps = res.data.applications || res.data.data || [];

        if (setApplications) {
            setApplications(Array.isArray(apps) ? apps : []);
        }

        if (setTotalPages) {
            setTotalPages(res.data.pagination?.totalPages || res.data.totalPages || 1);
        }

        if (setTotalApplications) {
            setTotalApplications(
                res.data.pagination?.totalApplications ??
                res.data.pagination?.total ??
                res.data.total ??
                apps.length
            );
        }
    } catch (err) {
        // Fallback to /mod/application if needed
        try {
            let fallbackUrl = `${API_URL}/mod/application?page=${page}&limit=${limit}`;
            if (curr && curr !== "All") fallbackUrl += `&status=${encodeURIComponent(curr)}`;
            if (domain && domain !== "All Domains") fallbackUrl += `&domain=${encodeURIComponent(domain)}`;

            const fallbackRes = await axios.get(fallbackUrl, { withCredentials: true });
            const apps = fallbackRes.data.data || fallbackRes.data || [];
            if (setApplications) setApplications(apps);
            if (setTotalPages) setTotalPages(fallbackRes.data.pagination?.totalPages || 1);
            if (setTotalApplications) setTotalApplications(fallbackRes.data.pagination?.totalApplications || apps.length);
        } catch (fallbackErr) {
            console.error("Failed to fetch applications:", err);
            if (setError) setError(err.response?.data?.message || "Failed to fetch applications");
            if (setApplications) setApplications([]);
        }
    } finally {
        if (setLoading) setLoading(false);
    }
};

/**
 * Update application status (ON_HOLD, SELECTED, REJECTED)
 */
export const handleStateChange = async (
    status,
    applicationId,
    setLoadingState,
    onSuccess
) => {
    try {
        if (setLoadingState) setLoadingState(status);

        const targetId = typeof applicationId === "object" ? applicationId?._id : applicationId;

        const response = await axios.patch(
            `${API_URL}/api/admin/application/${targetId}/status`,
            { status },
            { withCredentials: true }
        );

        if (response.data.success) {
            if (onSuccess) {
                onSuccess(response.data.data);
            }
            return { success: true, message: response.data.message || "Application updated" };
        }
    } catch (error) {
        // Try fallback route /edit/application
        try {
            const targetId = typeof applicationId === "object" ? applicationId?._id : applicationId;
            const fallbackRes = await axios.post(
                `${API_URL}/edit/application`,
                { id: targetId, status },
                { withCredentials: true }
            );
            if (fallbackRes.data.success && onSuccess) {
                onSuccess(fallbackRes.data.data);
            }
            return { success: true, message: "Application updated" };
        } catch (fbErr) {
            console.error("Status update error:", error);
            const msg = error?.response?.data?.message || "Failed to update application status";
            alert(msg);
            return { success: false, message: msg };
        }
    } finally {
        if (setLoadingState) setLoadingState("");
    }
};

/**
 * Delete individual application with resume cleanup
 */
export const deleteApplication = async (applicationId, onSuccess) => {
    try {
        const targetId = typeof applicationId === "object" ? applicationId?._id : applicationId;

        if (!targetId) {
            return { success: false, message: "Invalid application ID" };
        }

        let response;
        try {
            response = await axios.delete(
                `${API_URL}/api/admin/application/${targetId}`,
                { withCredentials: true }
            );
        } catch (delErr) {
            console.warn("DELETE request failed, attempting fallback POST endpoints...", delErr?.response?.data || delErr);
            try {
                response = await axios.post(
                    `${API_URL}/api/admin/application/delete`,
                    { id: targetId },
                    { withCredentials: true }
                );
            } catch (postErr) {
                // Secondary fallback via editContent router
                response = await axios.post(
                    `${API_URL}/edit/removeApplication`,
                    { id: targetId },
                    { withCredentials: true }
                );
            }
        }

        if (response?.data?.success) {
            if (onSuccess) onSuccess(targetId);
            return { success: true, message: response.data.message || "Application deleted successfully" };
        } else {
            const msg = response?.data?.message || "Failed to delete application";
            return { success: false, message: msg };
        }
    } catch (error) {
        console.error("Delete error:", error);
        const msg = error?.response?.data?.message || error?.message || "Failed to delete application";
        return { success: false, message: msg };
    }
};

/**
 * Export applications to .xlsx format by status
 * @param {'SELECTED' | 'REJECTED' | 'ON_HOLD' | 'ALL'} status
 */
export const exportApplicationsExcel = async (status = "ALL", setExporting) => {
    const filenameMap = {
        SELECTED: "selected-candidates.xlsx",
        REJECTED: "rejected-candidates.xlsx",
        ON_HOLD: "on-hold-candidates.xlsx",
        ALL: "all-candidates.xlsx",
    };

    const targetFilename = filenameMap[status.toUpperCase()] || "all-candidates.xlsx";

    try {
        if (setExporting) setExporting(status);

        const response = await axios.get(
            `${API_URL}/api/admin/applications/export?status=${encodeURIComponent(status)}`,
            {
                withCredentials: true,
                responseType: "blob",
            }
        );

        // Create browser download link for the xlsx blob
        const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", targetFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
        console.error("Excel download failed:", error);
        alert("Failed to export Excel file. Please try again.");
    } finally {
        if (setExporting) setExporting("");
    }
};

/**
 * Bulk delete applications created strictly before a cutoff date (Admin Only)
 * @param {string} date - ISO or YYYY-MM-DD date string
 */
export const deleteApplicationsBeforeDate = async (date) => {
    try {
        if (!date) {
            return { success: false, message: "Please select a cutoff date" };
        }

        const response = await axios.post(
            `${API_URL}/api/admin/applications/delete-before-date`,
            { date },
            { withCredentials: true }
        );

        if (response?.data?.success) {
            return {
                success: true,
                message: response.data.message || "Applications deleted successfully",
                deletedCount: response.data.deletedCount ?? 0,
                resumesCleaned: response.data.resumesCleaned ?? 0
            };
        } else {
            return {
                success: false,
                message: response?.data?.message || "Failed to delete applications"
            };
        }
    } catch (error) {
        console.error("Bulk delete before date error:", error);
        const msg = error?.response?.data?.message || error?.message || "Failed to bulk delete applications";
        return { success: false, message: msg };
    }
};