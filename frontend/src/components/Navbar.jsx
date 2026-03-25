import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "About", href: "#about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed w-full z-50 glass"
    >
      <div id="#" className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#"><div className="text-2xl font-display font-bold">
          <span className="text-gradient-primary">HRMS</span>
          <span className="text-foreground/70 font-light">Lite</span>
        </div></a>

        <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-foreground transition">
              {link.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => navigate("/login")}
          className="hidden md:inline-flex px-6 py-2.5 bg-gradient-primary rounded-full font-semibold text-sm text-primary-foreground shadow-glow"
        >
          Get Started
        </button>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
