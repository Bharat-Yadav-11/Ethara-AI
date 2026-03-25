import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
    Zap,
    Shield,
    Heart,
    BarChart3,
    CalendarCheck,
    Users,
    Globe,
    BellRing,
} from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        desc: "Instant data retrieval and seamless real-time updates across your entire organization.",
        color: "text-highlight",
        bgColor: "bg-highlight/10",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        desc: "Bank-grade encryption with role-based access control and audit logs.",
        color: "text-success",
        bgColor: "bg-success/10",
    },
    {
        icon: Heart,
        title: "Loved by Teams",
        desc: "An interface your team will actually enjoy using every single day.",
        color: "text-accent",
        bgColor: "bg-accent/10",
    },
    {
        icon: BarChart3,
        title: "Smart Analytics",
        desc: "AI-powered insights to track productivity, trends, and workforce health.",
        color: "text-info",
        bgColor: "bg-info/10",
    },
    {
        icon: CalendarCheck,
        title: "Leave Management",
        desc: "Automated leave workflows with approval chains and calendar sync.",
        color: "text-primary",
        bgColor: "bg-primary/10",
    },
    {
        icon: Users,
        title: "Team Directory",
        desc: "Beautiful org charts and employee profiles with instant search.",
        color: "text-secondary",
        bgColor: "bg-secondary/10",
    },
    {
        icon: Globe,
        title: "Global Ready",
        desc: "Multi-timezone, multi-currency support for distributed teams worldwide.",
        color: "text-highlight",
        bgColor: "bg-highlight/10",
    },
    {
        icon: BellRing,
        title: "Smart Notifications",
        desc: "Context-aware alerts via email, Slack, and in-app with zero noise.",
        color: "text-success",
        bgColor: "bg-success/10",
    },
];

const FeaturesSection = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section
            id="features"
            ref={ref}
            className="py-24 px-6 bg-background"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
                        Features
                    </span>

                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        Everything You Need to
                        <br />
                        <span className="text-gradient-primary">Run Your Team</span>
                    </h2>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From attendance to analytics, HRMS Lite has every tool your HR team
                        needs — beautifully packaged in one powerful platform.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 },
                            }}
                            className="group p-6 rounded-2xl border border-border bg-card hover:bg-surface-hover transition-all duration-300 shadow-card hover:shadow-glow"
                        >
                            <div
                                className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                            >
                                <feature.icon className={feature.color} size={24} />
                            </div>

                            <h3 className="text-lg font-display font-bold text-foreground mb-2">
                                {feature.title}
                            </h3>

                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
