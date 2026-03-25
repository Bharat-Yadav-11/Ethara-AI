const Footer = () => {
    const links = {
        Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
        Company: ['About', 'Blog', 'Careers', 'Contact'],
        Legal: ['Privacy', 'Terms', 'Security'],
    };

    return (
        <footer className="border-t border-border bg-card/50 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-12">

                    {/* Branding */}
                    <div className="mb-10 md:mb-0">
                        <div className="text-2xl font-display font-bold mb-4">
                            <span className="text-gradient-primary">HRMS</span>
                            <span className="text-foreground/70 font-light">Lite</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            The modern HR platform built for teams that value simplicity and power.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-3 md:gap-40 gap-12">
                        {Object.entries(links).map(([category, items]) => (
                            <div key={category}>
                                <h4 className="font-display font-bold text-foreground mb-4">
                                    {category}
                                </h4>
                                <ul className="space-y-2">
                                    {items.map((item) => (
                                        <li key={item}>
                                            <a
                                                href="#"
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} HRMS Lite. Designed with ❤️ for the future of work.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
