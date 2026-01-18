import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                toast.success('Welcome back!');
                navigate('/');
            } else {
                toast.error(result.message || 'Invalid credentials');
            }
        } catch {
            toast.error('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            <Toaster position="top-right" />

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
                <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-600 mb-4">
                        <ShieldCheck size={24} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">MediCare Portal</h2>
                    <p className="text-sm text-slate-500 mt-2">Secure access for medical staff only.</p>
                </div>

                <div className="p-8 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-3 rounded-lg text-white bg-slate-900 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    Verifying
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <LogIn className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
