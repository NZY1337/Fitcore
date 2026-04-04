import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const faqs = [
        { q: "Trebuie să fiu avansat pentru a folosi FitCore?", a: "Absolut nu. AI-ul nostru începe de la nivelul tău actual." },
        { q: "Cum funcționează analiza video?", a: "Folosim camera telefonului tău pentru a detecta 17 puncte cheie ale corpului în timp real." },
        { q: "Pot anula abonamentul oricând?", a: "Da, fără întrebări ascunse. Poți anula din setările contului cu un singur click." }
    ];

    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 md:px-8">
                <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-12 text-center">Întrebări <span className="bg-black text-[#DFFF00] px-3 md:px-4">Frecvente</span></h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className={`border-4 border-black transition-all ${openIndex === i ? 'bg-zinc-50 shadow-[4px_4px_0px_0px_#000]' : 'bg-white'}`}>
                            <button onClick={() => setOpenIndex(openIndex === i ? -1 : i)} className="w-full p-5 md:p-6 flex justify-between items-center text-left gap-4">
                                <span className="text-base md:text-xl font-black uppercase italic">{faq.q}</span>
                                {openIndex === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </button>
                            <AnimatePresence>{openIndex === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden"><div className="p-5 md:p-6 pt-0 text-zinc-600 font-medium border-t-2 border-black/5">{faq.a}</div></motion.div>}</AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ