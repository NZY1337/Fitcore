import { Check, Target, Trophy } from 'lucide-react';

const Core = () => {
    const stats = [
        { label: "Utilizatori Activi", value: "250K+" },
        { label: "Calorii Arse", value: "1.2B" },
        { label: "Acuratețe AI", value: "99.4%" },
    ];
    return (
        <section id="tehnologie" className="py-20 md:py-24 bg-black text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 border-b border-zinc-800 pb-16 md:pb-20">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center md:text-left">
                            <h3 className="text-5xl md:text-6xl font-black text-[#DFFF00] italic mb-2 tracking-tighter">{s.value}</h3>
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] md:text-sm">{s.label}</p>
                        </div>
                    ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center mt-16 md:mt-20">
                    <div className="grid grid-cols-2 gap-3 md:gap-4 order-2 lg:order-1">
                        <div className="space-y-3 md:space-y-4">
                            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop" className="w-full h-48 md:h-64 object-cover grayscale rounded-sm" alt="Workout" />
                            <div className="bg-[#DFFF00] p-4 md:p-6 h-40 md:h-48 flex flex-col justify-end border-2 border-black">
                                <Target className="text-black w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-4" />
                                <h4 className="text-black font-black uppercase leading-none text-base md:text-xl italic">Precizie<br />Biometrică</h4>
                            </div>
                        </div>
                        <div className="space-y-3 md:space-y-4 pt-8 md:pt-12">
                            <div className="bg-zinc-900 p-4 md:p-6 h-40 md:h-48 flex flex-col justify-end border-2 border-zinc-700">
                                <Trophy className="text-[#DFFF00] w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-4" />
                                <h4 className="text-white font-black uppercase leading-none text-base md:text-xl italic">Performanță<br />Maximă</h4>
                            </div>
                            <img src="https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=600&auto=format&fit=crop" className="w-full h-48 md:h-64 object-cover grayscale rounded-sm" alt="Stats" />
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-6 md:mb-8 leading-tight">Senzația unui coach personal, inteligența unui supercomputer.</h2>
                        <p className="text-zinc-400 text-base md:text-lg mb-8 md:mb-10 leading-relaxed font-medium">Algoritmii noștri procesează peste 50 de parametri în timp real pentru a-ți oferi exact antrenamentul de care ai nevoie astăzi.</p>
                        <ul className="space-y-4 md:space-y-6">
                            {['Planuri adaptate zilnic', 'Analiză video a posturii', 'Integrare Smartwatch completă'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 md:gap-4 text-white font-bold uppercase italic tracking-tighter text-xs md:text-sm">
                                    <div className="w-5 h-5 md:w-6 md:h-6 bg-[#DFFF00] flex items-center justify-center shrink-0"><Check className="text-black w-3 h-3 md:w-4 md:h-4" /></div>{item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Core;