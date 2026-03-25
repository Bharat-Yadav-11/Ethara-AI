import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const navigate = useNavigate();

    return (
        <section ref={ref} className="py-24 px-6 bg-background">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7 }}
                className="max-w-4xl mx-auto relative"
            >
                <div className="absolute -inset-2 bg-gradient-hero rounded-3xl opacity-30 blur-2xl" />

                <div className="relative rounded-3xl border border-border bg-card p-12 md:p-16 text-center shadow-card">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        Ready to Transform
                        <br />
                        <span className="text-gradient-hero">
                            Your HR Workflow?
                        </span>
                    </h2>

                    <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                        Join thousands of companies already using HRMS Lite.
                        Start your free trial today — no credit card required.
                    </p>

                    <button
                        onClick={() => navigate("/login")}
                        className="group px-10 py-4 bg-gradient-hero rounded-xl font-bold text-lg text-primary-foreground hover:scale-105 transition-transform duration-300 shadow-glow inline-flex items-center gap-2"
                    >
                        Get Started Free
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>
        </section>
    );
};

export default CTASection;
