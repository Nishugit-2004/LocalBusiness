import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAdmin } from '../../store/adminSlice';
import AdminSidebar from './AdminSidebar';
import Loader from '../Loader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0d9488', '#f97316', '#3b82f6', '#8b5cf6', '#ec4899'];

const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);

    const adminData = JSON.parse(localStorage.getItem('adminData'));
    const adminName = adminData?.admin?.name;

    useEffect(() => {
        dispatch(initializeAdmin());
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/order/seller-analytics`, {
                    headers: { Authorization: `Bearer ${adminData?.token}` }
                });
                setAnalytics(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load analytics.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [isAuthenticated, adminData]);

    if (!isAuthenticated) {
        navigate('/admin/login');
        return null;
    }

    if (loading) return <Loader />;

    return (
        <div className="flex min-h-screen bg-gray-50 mt-16">
            <AdminSidebar />
            <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
                <h2 className="text-3xl font-black text-orange-600 mb-8 mt-5 tracking-tight uppercase border-b-4 border-orange-500 pb-2 inline-block">
                     {adminName ? `${adminName}'s Analytics Dash` : 'Analytics Dashboard'}
                </h2>

                {error ? (
                    <p className="text-red-500 font-bold text-lg">{error}</p>
                ) : (
                    <div className="max-w-6xl mx-auto space-y-10 border border-gray-100 rounded-3xl p-8 bg-white shadow-2xl">
                        
                        {/* KPI Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-8 shadow-lg text-white transform transition hover:-translate-y-1">
                                <h3 className="text-teal-100 font-bold text-sm tracking-widest uppercase mb-2">Total Revenue</h3>
                                <p className="text-5xl font-black flex items-center">
                                    <i className="fa-solid fa-indian-rupee-sign text-3xl mr-3 opacity-70"></i> 
                                    {analytics?.totalRevenue?.toLocaleString('en-IN') || 0}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-8 shadow-lg text-white transform transition hover:-translate-y-1">
                                <h3 className="text-orange-100 font-bold text-sm tracking-widest uppercase mb-2">Total Orders Served</h3>
                                <p className="text-5xl font-black">{analytics?.totalOrders || 0}</p>
                            </div>
                        </div>

                        {/* Charts Area */}
                        {analytics?.popularItems && analytics.popularItems.length > 0 ? (
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
                                
                                {/* Bar Chart: Revenue by Item */}
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-gray-700 font-bold text-lg mb-6"><i className="fa-solid fa-chart-column text-teal-600 mr-2"></i> Revenue by Top Items</h3>
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={analytics.popularItems} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                                                <XAxis dataKey="_id" tick={{fill: '#6B7280', fontSize: 12}} tickLine={false} axisLine={false}/>
                                                <YAxis tick={{fill: '#6B7280', fontSize: 12}} tickLine={false} axisLine={false}/>
                                                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}/>
                                                <Bar dataKey="revenue" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Pie Chart: Units Sold */}
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-gray-700 font-bold text-lg mb-6"><i className="fa-solid fa-chart-pie text-orange-500 mr-2"></i> Units Sold Breakdown</h3>
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={analytics.popularItems}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={70}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="quantitySold"
                                                    nameKey="_id"
                                                >
                                                    {analytics.popularItems.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}/>
                                                <Legend iconType="circle" wrapperStyle={{fontSize: "12px", paddingTop: "20px"}}/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                
                             </div>
                        ) : (
                            <div className="bg-orange-50 text-orange-600 p-8 rounded-3xl text-center font-bold">
                                <i className="fa-solid fa-chart-area text-4xl mb-3 opacity-50 block"></i>
                                Not enough data to generate charts.
                            </div>
                        )}
                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAnalytics;
