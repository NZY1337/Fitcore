import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black italic text-xl">F</div>
                    <span className="text-xl font-black italic tracking-tighter uppercase">Fitcore</span>
                </div>

                <div className="hidden md:flex items-center gap-10 text-[13px] font-bold tracking-widest uppercase">
                    <a href="#programe" className="hover:text-gray-500 transition-colors">Programe</a>
                    <a href="#tehnologie" className="hover:text-gray-500 transition-colors">Tehnologie</a>
                    <a href="#transformari" className="hover:text-gray-500 transition-colors">Transformări</a>
                    <a href="#echipa" className="hover:text-gray-500 transition-colors">Echipa</a>
                    <a href="#preturi" className="hover:text-gray-500 transition-colors">Prețuri</a>
                </div>

                <div className="hidden md:block">
                    <button className="bg-black text-white px-8 py-3 font-bold text-sm tracking-widest uppercase hover:bg-gray-800 transition-all">
                        Începe Acum
                    </button>
                </div>

                <button
                    className="md:hidden text-black"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-6 shadow-xl"
                >
                    <a href="#programe" className="text-sm font-bold tracking-widest uppercase" onClick={() => setMobileMenuOpen(false)}>Programe</a>
                    <a href="#tehnologie" className="text-sm font-bold tracking-widest uppercase" onClick={() => setMobileMenuOpen(false)}>Tehnologie</a>
                    <a href="#transformari" className="text-sm font-bold tracking-widest uppercase" onClick={() => setMobileMenuOpen(false)}>Transformări</a>
                    <a href="#echipa" className="text-sm font-bold tracking-widest uppercase" onClick={() => setMobileMenuOpen(false)}>Echipa</a>
                    <a href="#preturi" className="text-sm font-bold tracking-widest uppercase" onClick={() => setMobileMenuOpen(false)}>Prețuri</a>
                    <button className="bg-black text-white px-8 py-4 font-bold text-sm tracking-widest uppercase">Începe Acum</button>
                </motion.div>
            )}
        </nav>
    );
}
