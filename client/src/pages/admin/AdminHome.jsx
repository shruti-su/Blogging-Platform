import React, { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  UsersIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import AdminService from "@/services/api/admin-file-permission";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import CategoryService from "@/services/api/category";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";

function AdminHome() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalUsers: 0,
    totalCategories: 0,
  });
  const [userBlogCounts, setUserBlogCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersWithBlogs, categoryData] = await Promise.all([
          AdminService.getUserBlogCounts(),
          CategoryService.getAllCategories(),
        ]);
        const totalBlogs = usersWithBlogs.reduce(
          (sum, user) => sum + user.blogCount,
          0
        );
        setStats({
          totalBlogs,
          totalUsers: usersWithBlogs.length,
          totalCategories: categoryData.categories.length,
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

  const nameBodyTemplate = (rowData) => (
    <Link
      to={`/admin/user/${rowData._id}`}
      className="text-purple-600 hover:text-purple-800 dark:text-purple-400 font-semibold transition"
    >
      {rowData.name}
    </Link>
  );

  const openDialog = (e) => {
    e.preventDefault();
    setDialogVisible(true);
  };

  return (
    <div className="p-6 mt-9 space-y-8">
      {/* Top Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Blogs Card */}
        <Card className="shadow-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl transition transform hover:scale-105 hover:shadow-2xl">
          <CardBody>
            <div className="flex items-center justify-between">
              <Typography variant="h3" className="text-white ">
                Total Blogs
              </Typography>
              <div className="p-2 bg-white/20 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <Typography variant="h2" className="mt-4 font-extrabold text-white">
              {loading ? "..." : stats.totalBlogs}
            </Typography>
            <Typography
              as="a"
              href="#"
              onClick={openDialog}
              className="text-base font-medium text-purple-100 hover:text-white underline mt-2 cursor-pointer"
            >
              Click here for details
            </Typography>
          </CardBody>
        </Card>

        {/* Total Users Card */}
        <Card className="shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl transition transform hover:scale-105 hover:shadow-2xl">
          <CardBody>
            <div className="flex items-center justify-between">
              <Typography variant="h3" className="text-white ">
                Total Users
              </Typography>
              <div className="p-2 bg-white/20 rounded-lg">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <Typography variant="h2" className="mt-4 font-extrabold text-white">
              {loading ? "..." : stats.totalUsers}
            </Typography>
            <Typography
              as="a"
              href="#"
              onClick={openDialog}
              className="text-base font-medium text-purple-100 hover:text-white underline mt-2 cursor-pointer"
            >
              Click here for details
            </Typography>
          </CardBody>
        </Card>

        {/* Total Categories Card */}
        <Card className="shadow-xl bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl transition transform hover:scale-105 hover:shadow-2xl">
          <CardBody>
            <div className="flex items-center justify-between">
              <Typography variant="h3" className="text-white ">
                Total Categories
              </Typography>
              <div className="p-2 bg-white/20 rounded-lg">
                <TagIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <Typography variant="h2" className="mt-4 font-extrabold text-white">
              {loading ? "..." : stats.totalCategories}
            </Typography>
            <Link to="/admin/category-list">
              <Typography
                as="span"
                className="text-base font-medium text-purple-100 hover:text-white underline mt-2 cursor-pointer"
              >
                Click here for details
              </Typography>
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Dialog with DataTable */}
      <Dialog
        header="📊 User Contributions"
        visible={dialogVisible}
        style={{ width: "75vw", maxWidth: "900px" }}
        onHide={() => setDialogVisible(false)}
        modal
        className="dark:bg-gray-900 rounded-xl"
      >
        <DataTable
          value={userBlogCounts}
          loading={loading}
          paginator
          rows={10}
          emptyMessage="No users found."
          className="p-datatable-sm"
        >
          <Column
            field="name"
            header="User Name"
            sortable
            body={nameBodyTemplate}
          />
          <Column field="email" header="Email" sortable />
          <Column field="role" header="Role" sortable />
          <Column
            field="blogCount"
            header="Blogs Posted"
            sortable
            body={(rowData) => (
              <div className="text-center font-semibold text-purple-600 dark:text-purple-400">
                {rowData.blogCount}
              </div>
            )}
          />
        </DataTable>
      </Dialog>
    </div>
  );
}

export default AdminHome;
