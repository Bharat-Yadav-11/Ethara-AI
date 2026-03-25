import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Shield, Zap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-pink-500 selection:text-white">

      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            HRMS<span className="font-light text-white">Lite</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-white text-slate-900 rounded-full font-semibold hover:bg-blue-50 transition shadow-lg shadow-blue-500/20"
          >
            Login
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.6 }}>
            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-blue-300 font-medium mb-6 inline-block">
              🚀 The Future of Work is Here
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Manage Your Team <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                With Superpowers
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              A lightweight, beautifully designed HR system. Track attendance, manage employees, and monitor leaves in one stunning dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:scale-105 transition transform shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                Get Started Now <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white/10 border border-white/10 rounded-xl font-bold text-lg hover:bg-white/20 transition backdrop-blur-sm">
                View Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap size={32} className="text-yellow-400" />, title: "Lightning Fast", desc: "Built with the MERN stack for instant data retrieval and updates." },
              { icon: <Shield size={32} className="text-green-400" />, title: "Secure Data", desc: "Enterprise-grade security with robust validations and safe storage." },
              { icon: <Heart size={32} className="text-pink-400" />, title: "User Friendly", desc: "Designed with empathy. A UI that your team will actually love using." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition backdrop-blur-sm"
              >
                <div className="mb-4 bg-slate-900/50 w-16 h-16 rounded-lg flex items-center justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why HRMS Lite?</h2>
            <div className="space-y-4">
              {["Real-time Attendance Tracking", "Smart Leave Management", "Instant Payroll Export", "Mobile Responsive Design"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="text-blue-500" size={20} />
                  <span className="text-slate-300 text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 h-64 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition duration-500">
            <h3 className="text-4xl font-bold text-white/90">Modern UI</h3>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/10 bg-slate-900 text-center text-slate-500">
        <p>&copy; 2024 HRMS Lite. Designed with ❤️ for the Future.</p>
      </footer>
    </div>
  );
};

export default LandingPage;