import { Shield, Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await api.post("/auth/login", { password: password.trim() });
      if (data.success && data.token) {
        localStorage.setItem("ps_token", data.token);
        localStorage.setItem("ps_email", "admin"); // Fallback since email is removed
        toast.success("Welcome to Admin Dashboard");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setShake(true);
      
      let errorText = err.response?.data?.message || "Incorrect Admin Password";
      if (!err.response) {
        errorText = "Unable to connect to backend server. Please ensure it is running.";
      }
      
      setErrorMsg(errorText);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 selection:bg-purple-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[420px]"
      >
        <form 
          onSubmit={submit} 
          className={`bg-white rounded-[24px] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100/50 ${shake ? "animate-shake" : ""}`}
        >
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-[0_10px_25px_-5px_rgba(147,51,234,0.4)]"
            >
              <Shield size={28} strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-[22px] font-extrabold text-gray-900 tracking-tight">Admin Control Panel</h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">Enter your secure access key</p>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <label className="sr-only">Password</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              </div>
              <input 
                type={show ? "text" : "password"} 
                className={`block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border ${errorMsg ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-purple-500/20 focus:border-purple-500'} rounded-xl outline-none focus:bg-white focus:ring-4 transition-all duration-300 text-gray-900 text-sm font-medium placeholder:text-gray-400 placeholder:font-normal`}
                placeholder="Password" 
                value={password} 
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }} 
                required 
                autoFocus
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none" 
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errorMsg && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-center text-sm font-semibold text-red-500"
              >
                {errorMsg}
              </motion.p>
            )}

            <button 
              type="submit" 
              disabled={loading || !password.trim()}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Authenticating...</>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </div>
        </form>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}} />
    </main>
  );
}
