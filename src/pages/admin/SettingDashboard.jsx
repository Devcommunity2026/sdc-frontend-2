import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Settings } from "lucide-react";
import AdminLayout from "../../components/admin/adminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminPanel from "../../components/admin/AdminPanel";

const SettingDashboard = () => {
    return (
        <AdminLayout>
            <div className="w-full space-y-6">
                <AdminPageHeader
                    icon={Settings}
                    title="Settings"
                    description="Admin settings have been simplified and moved into the pages where they are used."
                />

                <AdminPanel className="p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">
                                Application controls moved
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground dark:text-dark-muted-foreground">
                                Open and close applications from the Applications page. This keeps the control close to the application review workflow and avoids a separate settings area.
                            </p>
                        </div>

                        <Link
                            to="/admin/application"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 dark:bg-dark-primary dark:text-dark-primary-foreground md:w-auto"
                        >
                            Go to Applications
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                </AdminPanel>
            </div>
        </AdminLayout>
    );
};

export default SettingDashboard;
