const Trainers = () => {
    const trainers = [
        { name: "Alex Zoran", specialty: "Body Recomposition", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop" },
        { name: "Elena Munte", specialty: "Performance Nutrition", img: "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800&auto=format&fit=crop" },
        { name: "Radu Iron", specialty: "Hypertrophy Specialist", img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop" },
    ];

    return (
        <section id="echipa" className="py-20 md:py-24 bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none">Arhitecții <br className="hidden md:block" /> <span className="text-[#DFFF00]">Performanței</span></h2>
                    <p className="text-zinc-400 max-w-sm font-bold uppercase text-[10px] md:text-sm tracking-widest leading-relaxed">Antrenori certificați internațional care colaborează cu algoritmul nostru pentru succesul tău.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {trainers.map((t, i) => (
                        <div key={i} className="relative group overflow-hidden border-2 border-zinc-800">
                            <img src={t.img} alt={t.name} className="w-full h-[400px] md:h-[500px] object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/90 to-transparent">
                                <h4 className="text-xl md:text-2xl font-black uppercase italic mb-1">{t.name}</h4>
                                <p className="text-[#DFFF00] font-bold uppercase tracking-tighter text-xs md:text-sm">{t.specialty}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Trainers;