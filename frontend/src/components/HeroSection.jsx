import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroDashboard from "../assets/hero-dashboard.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-screen flex items-center">
      {/* Background blobs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/2 w-[300px] h-[300px] bg-accent/15 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface text-sm text-primary font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Now in Public Beta — Join 2,000+ Teams
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight mb-8 leading-[1.05]"
          >
            Manage Your Team
            <br />
            <span className="text-gradient-hero">With Superpowers</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            A lightweight, beautifully crafted HR platform. Track attendance,
            manage employees, and streamline leaves — all from one stunning dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate("/login")}
              className="group px-8 py-4 bg-gradient-hero rounded-xl font-bold text-lg text-primary-foreground hover:scale-105 transition-transform duration-300 shadow-glow flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="px-8 py-4 glass rounded-xl font-semibold text-lg text-foreground hover:bg-surface-hover transition-colors flex items-center justify-center gap-2">
              <Play size={18} className="text-primary" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-4 bg-gradient-primary rounded-2xl opacity-20 blur-2xl" />
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-card">
            <img
              src={heroDashboard}
              alt="HRMS Lite Dashboard Preview"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
