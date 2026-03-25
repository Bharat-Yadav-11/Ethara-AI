import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { UserPlus, Settings, Rocket } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        step: "01",
        title: "Create Your Account",
        desc: "Sign up in under 60 seconds. No credit card required — start your free trial instantly.",
    },
    {
        icon: Settings,
        step: "02",
        title: "Configure Your Workspace",
        desc: "Import employees, set leave policies, and customize workflows to match your organization.",
    },
    {
        icon: Rocket,
        step: "03",
        title: "Launch & Scale",
        desc: "Invite your team and start managing. Real-time dashboards keep you in control as you grow.",
    },
];

const HowItWorksSection = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section id="how-it-works" ref={ref} className="py-24 px-6 bg-surface/30">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
                        How It Works
                    </span>

                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        Up and Running in{" "}
                        <span className="text-gradient-primary">Minutes</span>
                    </h2>

                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Three simple steps to transform how you manage your people.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40" />

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: idx * 0.2 }}
                            className="relative text-center"
                        >
                            <div className="relative mx-auto w-20 h-20 mb-6">
                                <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-20 blur-lg" />
                                <div className="relative w-20 h-20 bg-card border border-border rounded-2xl flex items-center justify-center shadow-card">
                                    <step.icon className="text-primary" size={32} />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shadow-glow">
                                    {step.step}
                                </div>
                            </div>

                            <h3 className="text-xl font-display font-bold text-foreground mb-3">
                                {step.title}
                            </h3>

                            <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
