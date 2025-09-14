import React, { useState, useEffect } from "react";
import { DocumentTextIcon, UsersIcon } from "@heroicons/react/24/outline";
import AdminService from "@/services/api/admin-file-permission";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function AdminHome() {
  const [stats, setStats] = useState({ totalBlogs: 0, totalUsers: 0 });
  const [userBlogCounts, setUserBlogCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersWithBlogs = await AdminService.getUserBlogCounts();
        const totalBlogs = usersWithBlogs.reduce(
          (sum, user) => sum + user.blogCount,
          0
        );
        setStats({
          totalBlogs,
          totalUsers: usersWithBlogs.length,
        });
        setUserBlogCounts(usersWithBlogs);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 mt-9 space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Blogs Card */}
        <Card className="shadow-lg dark:bg-gray-800">
          <CardBody>
            <div className="flex items-center justify-between">
              <Typography
                variant="h6"
                color="blue-gray"
                className="dark:text-gray-300"
              >
                Total Blogs
              </Typography>
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <Typography
              variant="h2"
              color="blue-gray"
              className="mt-4 font-extrabold dark:text-white"
            >
              {loading ? "..." : stats.totalBlogs}
            </Typography>
          </CardBody>
        </Card>

        {/* Total Users Card */}
        <Card className="shadow-lg dark:bg-gray-800">
          <CardBody>
            <div className="flex items-center justify-between">
              <Typography
                variant="h6"
                color="blue-gray"
                className="dark:text-gray-300"
              >
                Total Users
              </Typography>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <Typography
              variant="h2"
              color="blue-gray"
              className="mt-4 font-extrabold dark:text-white"
            >
              {loading ? "..." : stats.totalUsers}
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* User Blog Counts Table */}
      <Card className="shadow-lg dark:bg-gray-800">
        <CardBody>
          <Typography
            variant="h5"
            color="blue-gray"
            className="mb-4 dark:text-white"
          >
            User Contributions
          </Typography>
          <DataTable
            value={userBlogCounts}
            loading={loading}
            paginator
            rows={10}
            emptyMessage="No users found."
          >
            <Column field="name" header="User Name" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="role" header="Role" sortable />
            <Column
              field="blogCount"
              header="Blogs Posted"
              sortable
              body={(rowData) => (
                <div className="text-center">{rowData.blogCount}</div>
              )}
            />
          </DataTable>
        </CardBody>
      </Card>
    </div>
  );
}

export default AdminHome;
