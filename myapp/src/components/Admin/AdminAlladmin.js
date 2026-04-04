import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeAdmin } from "../../store/adminSlice";
import Loader from "../Loader";
import AdminSidebar from "./AdminSidebar";

const AdminAlladmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);

  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/admin/alladmin`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredUser =
    searchTerm !== ""
      ? users.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : users;

  if (!isAuthenticated) return null;

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
        <div className="flex-1 mt-6">
          <h1 className="text-orange-500 font-extrabold text-2xl tracking-widest uppercase mb-6 text-center lg:text-left">
             Active Marketplace Sellers
          </h1>

          <div className="search-container mx-auto lg:mx-0">
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <table className="users-table">
              <thead>
                <tr>
                   <th>Seller ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredUser.map((user) => (
                  <tr key={user._id}>
                     <td className="font-mono text-[10px] text-gray-400">#{user._id.slice(-6)}</td>
                    <td className="font-bold">{user.name}</td>
                    <td className="text-gray-500">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAlladmin;
