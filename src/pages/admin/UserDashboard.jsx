import React, { useEffect, useMemo, useState } from "react";
import { fetchUsers } from "../../controllers/admin/userDashboard";
import Loader from "../../components/Loader";
import Slider from "../../components/admin/slider";
import UserAdd from "../../components/admin/userAdd";
import UserEditModal from "../../components/admin/UserEditModal";
import UserRow from "../../components/admin/userRow";
import Paginator from "../../components/ui/Paginator";

import AdminLayout from "../../components/admin/adminLayout";
import { useAuth } from "../../contexts/AuthProvider";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminPanel from "../../components/admin/AdminPanel";
import { Plus, Users } from "lucide-react";

const UserDashboard = ({ defaultType }) => {
    const { user } = useAuth();
    const storedRole = useMemo(() => {
        if (user?.role) return user.role;

        try {
            return JSON.parse(localStorage.getItem("user"))?.role;
        } catch {
            return null;
        }
    }, [user]);
    const isAdmin = storedRole === "admin";

    const userType = useMemo(
        () => (isAdmin ? ["All", "Team", "Mentor", "Alumni"] : ["Team", "Mentor", "Alumni"]),
        [isAdmin]
    );

    const [selectedType, setSelectedType] = useState(() => {
        if (defaultType && (defaultType === "Alumni" || userType.includes(defaultType))) {
            return defaultType;
        }
        const saved = localStorage.getItem("admin_user_slider");
        return userType.includes(saved) ? saved : userType[0];
    });

    useEffect(() => {
        if (defaultType && userType.includes(defaultType)) {
            setSelectedType(defaultType);
        }
    }, [defaultType, userType]);

    const curr = userType.includes(selectedType) ? selectedType : userType[0];

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        localStorage.setItem("admin_user_slider", curr);
    }, [curr]);

    const [openMenu, setOpenMenu] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers(setLoading, page, curr, setUsers, setTotalPages);
    }, [page, curr]);


    const refreshUsers = () => {
        fetchUsers(
            setLoading,
            page,
            curr,
            setUsers,
            setTotalPages
        );
    };

    return (
        <AdminLayout>

            <div className="w-full space-y-6">

                <AdminPageHeader
                    icon={Users}
                    title="User Management"
                    description={isAdmin ? "Manage platform users, roles, team members, mentors, and alumni from one workspace." : "Manage team members, mentors, and alumni available to moderator permissions."}
                    actions={
                        curr !== "All" && (
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
                        )
                    }
                />

                {/* ================= FILTERS ================= */}
                <AdminPanel className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground dark:text-dark-muted-foreground">
                                Directory
                            </p>
                            <p className="mt-1 text-sm text-foreground dark:text-dark-foreground">
                                Switch between user groups without leaving the page.
                            </p>
                        </div>

                        <Slider type={userType} curr={curr} setCurr={setSelectedType} setPage={setPage} />
                    </div>
                </AdminPanel>

                {/* ================= TABLE ================= */}
                <AdminPanel className="overflow-x-auto">

                    {/* ================= LOADING ================= */}
                    {loading ? (
                        <div className="py-14 text-center text-muted-foreground dark:text-dark-muted-foreground">
                            <Loader lable={`Loading ${curr.toLowerCase()}...`} />

                        </div>
                    ) : users.length === 0 ? (

                        /* ================= EMPTY ================= */
                        <div className="py-14 text-center text-muted-foreground dark:text-dark-muted-foreground">
                            No {curr} Found
                        </div>

                    ) : (

                        /* ================= DATA ================= */
                        <>

                            <div className="admin-table-header min-w-[760px] rounded-t-2xl ">
                                <div className="flex w-[25%] items-center py-4">
                                    Name
                                </div>
                                <div className="flex w-[35%] items-center break-all py-4">
                                    {curr === "Alumni" ? "Company" : "Details"}
                                </div>
                                <div className="flex w-[20%] items-center py-4">
                                    {curr === "Alumni" ? "Passing Year" : "Role"}
                                </div>
                                <div className="relative flex w-[20%] items-center justify-center">
                                    Action
                                </div>
                            </div>
                            {
                                users.map((user, index) => (
                                    <UserRow
                                        key={user._id}
                                        user={user}
                                        index={index}
                                        curr={curr}
                                        openMenu={openMenu}
                                        setOpenMenu={setOpenMenu}
                                        setLoading={setLoading}
                                        page={page}
                                        setUsers={setUsers}
                                        setTotalPages={setTotalPages}
                                        refreshUsers={refreshUsers}
                                        onEditClick={(selectedUser) => {
                                            setEditingUser(selectedUser);
                                            setOpenEditModal(true);
                                        }}
                                    />
                                ))
                            }
                        </>
                    )
                    }
                </AdminPanel>

                {/* ================= PAGINATION ================= */}
                {!loading && totalPages > 1 && <Paginator
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />}
            </div>

            {/* ================= ADD MODAL ================= */}
            {openAddModal && (
                <UserAdd
                    curr={curr}
                    setOpenAddModal={setOpenAddModal}
                    setLoading={setLoading}
                    page={page}
                    setUsers={setUsers}
                    setTotalPages={setTotalPages}
                    fetchUsers={fetchUsers}
                />
            )}

            {/* ================= EDIT MODAL ================= */}
            {openEditModal && editingUser && (
                <UserEditModal
                    curr={curr}
                    user={editingUser}
                    setOpenEditModal={setOpenEditModal}
                    page={page}
                    setUsers={setUsers}
                    setTotalPages={setTotalPages}
                    setLoading={setLoading}
                    fetchUsers={fetchUsers}
                />
            )}
        </AdminLayout>
    );
};

export default UserDashboard;
