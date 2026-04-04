const Transformations = () => {
    const cases = [
        { name: "Andrei V.", before: "95kg", after: "82kg", time: "12 Săptămâni", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop" },
        { name: "Maria L.", before: "28%", after: "19%", time: "8 Săptămâni", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop" },
    ];

    return (
        <section id="transformări" className="py-20 md:py-24 overflow-hidden bg-black">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic mb-12 border-l-8 border-[#DFFF00] pl-6 leading-tight">Rezultate<br />Fără Filtru</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {cases.map((c, i) => (
                        <div key={i} className="group relative border-4 border-black bg-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                            <div className="h-64 sm:h-80 md:h-96 relative overflow-hidden">
                                <img src={c.img} alt={c.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-black italic uppercase text-[10px]">După Program</div>
                            </div>
                            <div className="p-6 md:p-8 border-t-4 border-black">
                                <div className="flex justify-between items-end mb-4">
                                    <h3 className="text-2xl md:text-3xl font-black uppercase italic">{c.name}</h3>
                                    <span className="bg-[#DFFF00] px-3 md:px-4 py-1 font-black italic text-xs md:text-sm border-2 border-black">{c.time}</span>
                                </div>
                                <div className="flex gap-4 md:gap-8">
                                    <div><p className="text-[10px] font-bold uppercase text-zinc-500 tracking-tighter">Inițial</p><p className="text-lg md:text-xl font-black italic">{c.before}</p></div>
                                    <div className="w-px h-8 md:h-10 bg-zinc-200"></div>
                                    <div><p className="text-[10px] font-bold uppercase text-zinc-500 tracking-tighter">Prezent</p><p className="text-lg md:text-xl font-black italic text-green-600">{c.after}</p></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Transformations;