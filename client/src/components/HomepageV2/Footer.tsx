export default function Footer() {
    return (
        <footer className="py-20 bg-white border-t-2 border-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black italic text-xl">F</div>
                            <span className="text-xl font-black italic tracking-tighter uppercase">Fitcore</span>
                        </div>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed uppercase tracking-tight">
                            Platforma de fitness inteligentă care se adaptează la tine. Antrenează-te mai smart, mănâncă mai bine.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-black italic uppercase tracking-tighter mb-6">Produs</h4>
                        <ul className="space-y-3 text-sm font-bold uppercase tracking-tight text-gray-400">
                            <li><a href="#" className="hover:text-black transition-colors">Programe</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Prețuri</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Transformări</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Descarcă App</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black italic uppercase tracking-tighter mb-6">Companie</h4>
                        <ul className="space-y-3 text-sm font-bold uppercase tracking-tight text-gray-400">
                            <li><a href="#" className="hover:text-black transition-colors">Despre Noi</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Cariere</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black italic uppercase tracking-tighter mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm font-bold uppercase tracking-tight text-gray-400">
                            <li><a href="#" className="hover:text-black transition-colors">Confidențialitate</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Termeni & Condiții</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Politica Cookie</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                    <p>© {new Date().getFullYear()} FitCore AI Inc. Toate drepturile rezervate.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-black transition-colors">Twitter</a>
                        <a href="#" className="hover:text-black transition-colors">Instagram</a>
                        <a href="#" className="hover:text-black transition-colors">YouTube</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
