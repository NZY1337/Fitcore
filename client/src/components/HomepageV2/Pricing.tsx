import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Free',
        description: 'Perfect pentru început',
        price: { monthly: 0, yearly: 0 },
        features: [
            'Generare antrenamente AI de bază',
            'Librărie standard exerciții',
            'Urmărire progres simplă',
            'Acces comunitate'
        ]
    },
    {
        name: 'Pro',
        description: 'Pentru transformări serioase',
        price: { monthly: 19, yearly: 15 },
        popular: true,
        features: [
            'Personalizare AI avansată',
            'Planificare nutriție smart',
            'Ajustări plan în timp real',
            'Dashboard analize detaliate',
            'Suport prioritar'
        ]
    },
    {
        name: 'Premium',
        description: 'Experiența supremă de coaching',
        price: { monthly: 39, yearly: 29 },
        features: [
            'Tot ce include Pro',
            'Review lunar cu expert',
            'Rețete meal prep custom',
            'Verificare formă via video AI',
            'Acces timpuriu la funcții noi'
        ]
    }
];

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(true);

    return (
        <section id="preturi" className="py-32 relative bg-white border-t-2 border-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[2px] w-12 bg-[#D9FF5B]" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Prețuri</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl italic font-black uppercase tracking-tighter mb-12">
                        Alege planul <br />
                        <span className="text-gray-400">tău de luptă</span>
                    </h2>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`text-sm font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${!isYearly ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                        >
                            Lunar
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`text-sm font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${isYearly ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                        >
                            Anual <span className="text-[#D9FF5B] bg-black px-2 py-0.5 ml-2">-20%</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`relative p-10 border-2 border-black shadow-[4px_4px_0px_0px_#000000] transition-all ${plan.popular ? 'bg-[#D9FF5B]' : 'bg-white'
                                }`}
                        >
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">{plan.name}</h3>
                            <p className="text-sm font-bold text-black/60 mb-8 h-10">{plan.description}</p>

                            <div className="mb-10">
                                <span className="text-6xl font-black italic">${isYearly ? plan.price.yearly : plan.price.monthly}</span>
                                <span className="text-xl font-bold uppercase">/lună</span>
                            </div>

                            <button className={`w-full py-5 font-black italic uppercase tracking-tighter text-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] mb-10 transition-all ${plan.popular ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'
                                }`}>
                                Începe Acum
                            </button>

                            <ul className="space-y-5">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-4 text-sm font-bold uppercase tracking-tight">
                                        <Check className="w-5 h-5 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
