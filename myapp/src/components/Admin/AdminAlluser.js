import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAdmin } from '../../store/adminSlice';
import Loader from '../Loader';
import AdminSidebar from './AdminSidebar';

const AdminAlluser=()=> {
    const [users, setUsers] = useState([]);
    const [loading,setLoading]=useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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
            setLoading(true)
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/alluser`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }finally{
                setLoading(false)
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
      };
      const filteredUser = searchTerm !== '' ?
        users.filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) :
        users;

    if(!isAuthenticated) return null;

    if(loading){
        return <Loader/>
    }
    return (
        <div className="flex min-h-screen bg-gray-50 mt-16">
            <AdminSidebar />
            <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
            
    
        
        
        <div className='order2'>
        <h1 class=" text-orange-500 font-bold text-xl">All Users</h1>
            <div className="search-container">
            <input
            type="text"
            placeholder="Search user..."
            value={searchTerm}
            onChange={handleSearch}
            />
            <i class="fa-solid fa-magnifying-glass absolute right-2 top-5 text-yellow-500"></i>
        </div>
                
                 <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUser.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>
        </div>
    </div>
  );
};

export default AdminAlluser;
