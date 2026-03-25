import { Users, TrendingUp, Clock, Award } from "lucide-react";

const stats = [
    { icon: Users, value: "2,500+", label: "Active Companies", color: "text-primary" },
    { icon: TrendingUp, value: "99.9%", label: "Uptime Guaranteed", color: "text-success" },
    { icon: Clock, value: "3hrs", label: "Saved Per Week", color: "text-highlight" },
    { icon: Award, value: "4.9/5", label: "User Satisfaction", color: "text-secondary" },
];

const StatsSection = () => {
    return (
        <section className="py-20 border-y border-border bg-surface/50">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, idx) => (
                    <div key={idx}>
                        <stat.icon className={`mx-auto mb-3 ${stat.color}`} size={28} />
                        <div className="text-3xl md:text-4xl font-display font-bold mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StatsSection;
