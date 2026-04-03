import { motion } from 'framer-motion';

const steps = [
    {
        number: '01',
        title: 'Introdu Obiectivele',
        description: 'Spune-i AI-ului starea ta actuală, fizicul țintă, echipamentul disponibil și preferințele alimentare.'
    },
    {
        number: '02',
        title: 'AI Creează Planul',
        description: 'Primești instantaneu un protocol de antrenament și nutriție complet personalizat, bazat pe știință.'
    },
    {
        number: '03',
        title: 'Urmărește & Evoluează',
        description: 'Înregistrează sesiunile. AI-ul învață biologia ta și optimizează continuu planul pentru rezultate maxime.'
    }
];

export default function HowItWorks() {
    return (
        <section id="programe" className="py-32 relative overflow-hidden bg-white border-t-2 border-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-[2px] w-12 bg-[#D9FF5B]" />
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Cum funcționează</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl italic font-black uppercase tracking-tighter mb-12">
                            Transformarea <br />
                            <span className="text-gray-400">ta începe aici</span>
                        </h2>

                        <div className="space-y-12">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.2 }}
                                    className="flex gap-8"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-black text-[#D9FF5B] flex items-center justify-center font-black italic text-2xl shadow-[4px_4px_0px_0px_#000000]">
                                            {step.number}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-3">{step.title}</h3>
                                        <p className="text-gray-500 font-medium leading-relaxed">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative"
                    >
                        <div className="bg-black p-2 shadow-[8px_8px_0px_0px_#000000] transform rotate-2">
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"
                                    alt="Fitness App Interface"
                                    className="w-full h-full object-cover grayscale"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/20" />

                                <div className="absolute bottom-0 left-0 right-0 bg-[#D9FF5B] p-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="font-black italic uppercase tracking-tighter text-black text-xl">Progres Săptămânal</div>
                                        <div className="text-black font-black italic text-2xl">+12%</div>
                                    </div>
                                    <div className="h-4 bg-black/10 rounded-none overflow-hidden">
                                        <div className="h-full bg-black w-[75%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
