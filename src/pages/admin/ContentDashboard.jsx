import React, { useEffect, useState } from "react";
import { fetchUsers, handleDeleteContent } from "../../controllers/admin/contentDashboard";
import AdminLayout from "../../components/admin/adminLayout";
import ContentRow from "../../components/admin/ContentRow";
import ContentAddModal from "../../components/admin/ContentAddModal";
import ContentEditModal from "../../components/admin/ContentEditModal";
import Paginator from "../../components/ui/Paginator";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminPanel from "../../components/admin/AdminPanel";
import { FileText, Plus } from "lucide-react";

const ContentDashboard = () => {
    // ================= CONTENT TYPES =================
    const contentType = ["Blogs", "Events", "Projects"];
    const [curr, setCurr] = useState(() => {
        const saved = localStorage.getItem("admin_content_slider");
        return contentType.includes(saved) ? saved : "Blogs";
    });

    // ================= STATES =================
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openMenu, setOpenMenu] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        localStorage.setItem("admin_content_slider", curr);
    }, [curr]);

    // ================= FETCH =================
    useEffect(() => {
        fetchUsers(
            setLoading,
            page,
            curr,
            setContents,
            setTotalPages
        );
    }, [page, curr]);

    // ================= REFRESH =================
    const refreshUsers = () => {
        fetchUsers(
            setLoading,
            page,
            curr,
            setContents,
            setTotalPages
        );
    };

    return (
        <AdminLayout>
            <div className="w-full space-y-6">

                <AdminPageHeader
                    icon={FileText}
                    title="Content Studio"
                    description="Create, review, and update website content while keeping published sections organized."
                    actions={
                        <button
                            onClick={() => {
                                setOpenAddModal(true);
                                setOpenMenu(null);
                            }}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 dark:bg-dark-primary dark:text-dark-primary-foreground sm:w-auto"
                        >
                            <Plus size={17} />
                            Add {curr}
                        </button>
                    }
                />

                {/* ================= FILTERS & ACTIONS ================= */}
                <AdminPanel className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground dark:text-dark-muted-foreground">
                                Content Type
                            </p>
                            <p className="mt-1 text-sm text-foreground dark:text-dark-foreground">
                                Choose the section you want to manage.
                            </p>
                        </div>

                        <div className="flex w-full flex-wrap gap-2 rounded-xl border border-border bg-secondary p-1 dark:border-dark-border dark:bg-dark-secondary sm:inline-flex sm:w-fit">
                            {contentType.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurr(item);
                                        setPage(1);
                                        setOpenMenu(null);
                                    }}
                                    className={`min-w-0 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 sm:flex-none sm:px-5
                                        ${curr === item
                                            ? "bg-primary text-primary-foreground shadow-sm dark:bg-dark-primary dark:text-dark-primary-foreground"
                                            : "text-secondary-foreground hover:bg-muted dark:text-dark-secondary-foreground dark:hover:bg-dark-muted"
                                        }
                                    `}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </AdminPanel>

                {/* ================= TABLE ================= */}
                <AdminPanel className="overflow-x-auto">
                    {loading ? (
                        <div className="py-14 text-center text-muted-foreground dark:text-dark-muted-foreground">
                            Loading {curr.toLowerCase()}...
                        </div>
                    ) : contents.length === 0 ? (
                        <div className="py-14 text-center text-muted-foreground dark:text-dark-muted-foreground">
                            No {curr} Found
                        </div>
                    ) : (
                        <>
                            <div className="admin-table-header min-w-[760px] rounded-t-2xl">
                                <div className="flex w-[25%] items-center py-4">
                                    Title / Name
                                </div>
                                <div className="flex w-[35%] items-center py-4">
                                    Details
                                </div>
                                <div className="flex w-[20%] items-center py-4">
                                    Type
                                </div>
                                <div className="flex w-[20%] items-center justify-center">
                                    Action
                                </div>
                            </div>

                            {/* Table Body Rows */}
                            {contents.map((item, index) => (
                                <ContentRow
                                    key={item._id || index}
                                    user={item}
                                    curr={curr}
                                    openMenu={openMenu}
                                    setOpenMenu={setOpenMenu}
                                    handleDeleteContent={handleDeleteContent}
                                    refreshUsers={refreshUsers}
                                    onEditClick={(selectedItem) => {
                                        setEditingItem(selectedItem);
                                        setOpenEditModal(true);
                                    }}
                                />
                            ))}
                        </>
                    )}
                </AdminPanel>

                {/* ================= PAGINATION ================= */}
                {!loading && totalPages > 1 && (
                    <Paginator
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                    />
                )}

            </div>

            {/* ================= ADD MODAL ================= */}
            {openAddModal && (
                <ContentAddModal
                    curr={curr}
                    setOpenAddModal={setOpenAddModal}
                    refreshUsers={refreshUsers}
                />
            )}

            {/* ================= EDIT MODAL ================= */}
            {openEditModal && editingItem && (
                <ContentEditModal
                    curr={curr}
                    content={editingItem}
                    setOpenEditModal={setOpenEditModal}
                    page={page}
                    setUsers={setContents}
                    setTotalPages={setTotalPages}
                    setLoading={setLoading}
                    fetchUsers={fetchUsers}
                />
            )}
        </AdminLayout>
    );
};

export default ContentDashboard;
