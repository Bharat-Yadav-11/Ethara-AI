import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Chen",
        role: "VP of People, ScaleUp Inc.",
        text: "HRMS Lite replaced three different tools for us. The leave management alone saves our team 5 hours per week.",
        rating: 5,
    },
    {
        name: "Marcus Johnson",
        role: "CEO, TechForward",
        text: "The dashboard is genuinely beautiful. For the first time, our managers actually enjoy checking attendance reports.",
        rating: 5,
    },
    {
        name: "Priya Patel",
        role: "HR Director, GlobalCorp",
        text: "We onboarded 200 employees in a week. The import tools and smart workflows made it feel effortless.",
        rating: 5,
    },
];

const TestimonialsSection = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section id="testimonials" ref={ref} className="py-24 px-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
                        Testimonials
                    </span>

                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        Loved by{" "}
                        <span className="text-gradient-primary">HR Leaders</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: idx * 0.15 }}
                            whileHover={{ y: -8 }}
                            className="p-8 rounded-2xl border border-border bg-card shadow-card hover:shadow-glow transition-all duration-300"
                        >
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} size={16} className="fill-highlight text-highlight" />
                                ))}
                            </div>

                            <p className="text-foreground/90 leading-relaxed mb-6 text-[15px]">
                                "{t.text}"
                            </p>

                            <div>
                                <div className="font-display font-bold text-foreground">
                                    {t.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {t.role}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
