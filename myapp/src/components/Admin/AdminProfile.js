import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { initializeAdmin, adminlogout } from "../../store/adminSlice";
import "../Cart/Order.css";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { toast } from "react-hot-toast";
import Loader from "../Loader";

import AdminSidebar from "./AdminSidebar";

const AdminProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);

  const [adminData, setadminData] = useState(() => {
    const storedadminData = sessionStorage.getItem("adminData");
    return storedadminData ? JSON.parse(storedadminData) : null;
  });

  const adminId = adminData ? adminData.admin.id : null;
  const token = adminData ? adminData.token : null;
  const [name, setName] = useState(adminData ? adminData.admin.name : "");
  const [email, setEmail] = useState(adminData ? adminData.admin.email : "");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/update?adminId=${adminId}`,
        {
          name: name,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedAdminData = response.data;
      sessionStorage.setItem(
        "adminData",
        JSON.stringify({
          admin: { ...updatedAdminData, id: updatedAdminData._id },
          token: token,
        })
      );

      setadminData({
        admin: { ...updatedAdminData, id: updatedAdminData._id },
        token: token,
      });
      toast.success("Admin updated!");
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
             {/* Admin Header Banner */}
             <div className="bg-teal-600 h-32 relative">
                <div className="absolute -bottom-16 left-8">
                   <div className="w-32 h-32 rounded-3xl border-8 border-white shadow-xl bg-teal-50 flex items-center justify-center text-teal-600">
                      <i className="fa-solid fa-user-shield text-5xl"></i>
                   </div>
                </div>
             </div>

             <div className="pt-20 pb-10 px-8">
               <h1 className="text-3xl font-black text-gray-800 tracking-tight">Admin Overview</h1>
               <p className="text-gray-500 text-sm mb-8">Managing VirtualShop with authority.</p>

               <div className="grid md:grid-cols-2 gap-6 bg-teal-50/50 p-6 rounded-2xl border border-dashed border-teal-200">
                  <div className="space-y-1">
                     <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Admin Name</span>
                     <p className="text-lg font-bold text-gray-700">{name}</p>
                  </div>
                  <div className="space-y-1">
                     <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Admin Email</span>
                     <p className="text-lg font-bold text-gray-700 truncate">{email}</p>
                  </div>
                  <div className="space-y-1">
                     <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Access Level</span>
                     <p className="text-sm font-bold bg-teal-600 text-white px-3 py-1 rounded-full w-fit">Full Admin</p>
                  </div>
               </div>

               <div className="mt-10 flex gap-4 flex-wrap">
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-xl transform transition hover:-translate-y-1"
                  >
                    Edit Profile
                  </button>
                  <Link
                    to="/admin/welcome"
                    className="px-8 py-4 bg-gray-100 text-teal-700 rounded-2xl font-bold hover:bg-gray-200 transition"
                  >
                    Back to Dashboard
                  </Link>
               </div>
             </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative transform transition-all scale-100">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            
            <h2 className="text-2xl font-black text-gray-800 mb-2 truncate">Update Profile</h2>
            <p className="text-gray-400 text-sm mb-8">Revitalize your administrative identity.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-teal-500 outline-none transition font-bold text-gray-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-teal-500 outline-none transition font-bold text-gray-700"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-teal-600 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-teal-700 transform transition active:scale-95"
                >
                  SAVE CHANGES
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black hover:bg-gray-200 transition"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
