import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, Activity } from 'lucide-react'; // Added a few mock icons for visuals

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper to determine active state style
    const getLinkStyle = (path) => {
        const isActive = location.pathname === path;
        return isActive 
            ? "flex items-center gap-3 px-4 py-3 bg-teal-50 text-teal-700 rounded-lg shadow-sm ring-1 ring-teal-100 transition-all"
            : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all";
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen z-20">
                {/* Brand Header */}
                <div className="p-8 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shadow-teal-200">
                            M
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">MediCare</h1>
                            <p className="text-xs text-teal-600 font-medium tracking-wide uppercase">CMS v1.0</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <div className="px-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Main Menu
                    </div>
                    
                    <a href="#" className={getLinkStyle('/')}> {/* Assuming root is dashboard */}
                        <LayoutDashboard size={20} className={location.pathname === '/' ? "stroke-[2px]" : "stroke-[1.5px]"} />
                        <span className="font-medium">Dashboard</span>
                    </a>


                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 capitalize truncate">{user?.role || 'Admin'}</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent px-4 py-2.5 rounded-lg transition-all text-sm font-medium"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto h-screen scroll-smooth">
                {children}
            </main>
        </div>
    );
};

export default Layout;