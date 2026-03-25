import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle } from "lucide-react";

const items = [
    "Real-time Attendance Tracking",
    "Smart Leave Management",
    "Instant Payroll Export",
    "Mobile Responsive Design",
    "Custom Role Permissions",
    "Automated Compliance Reports",
];

const AboutSection = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section id="about" ref={ref} className="py-24 px-6 bg-surface/30">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7 }}
                        className="flex-1"
                    >
                        <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
                            Why Choose Us
                        </span>

                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
                            Built for Modern{" "}
                            <span className="text-gradient-primary">
                                HR Teams
                            </span>
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {items.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle className="text-success shrink-0" size={20} />
                                    <span className="text-foreground/80">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40, rotate: 6 }}
                        animate={inView ? { opacity: 1, x: 0, rotate: 3 } : {}}
                        whileHover={{ rotate: 0, scale: 1.02 }}
                        transition={{ duration: 0.7 }}
                        className="flex-1 h-72 md:h-80 w-full bg-gradient-hero rounded-2xl shadow-glow flex items-center justify-center cursor-pointer"
                    >
                        <div className="text-center">
                            <h3 className="text-5xl font-display font-bold text-primary-foreground/90 mb-2">
                                Modern UI
                            </h3>
                            <p className="text-primary-foreground/60 text-sm">
                                Designed for delight
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
