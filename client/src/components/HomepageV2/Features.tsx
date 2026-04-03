import { motion } from 'framer-motion';
import { Brain, Salad, LineChart, Target, Smartphone, Zap } from 'lucide-react';

const features = [
    {
        icon: <Brain className="w-8 h-8" />,
        title: 'Generator Antrenamente AI',
        description: 'Rutine dinamice care se adaptează la progresul tău, echipament și nivelul de energie.'
    },
    {
        icon: <Salad className="w-8 h-8" />,
        title: 'Nutriție Inteligentă',
        description: 'Planuri alimentare personalizate cu urmărire macro, adaptate obiectivelor tale.'
    },
    {
        icon: <LineChart className="w-8 h-8" />,
        title: 'Dashboard Progres',
        description: 'Vizualizează transformarea ta cu analize avansate și modelare predictivă.'
    },
    {
        icon: <Target className="w-8 h-8" />,
        title: 'Obiceiuri & Disciplină',
        description: 'Coaching comportamental pentru a construi consistență și a depăși platourile.'
    },
    {
        icon: <Smartphone className="w-8 h-8" />,
        title: 'Acces Mobil',
        description: 'Ia antrenorul tău AI oriunde cu aplicația noastră web complet responsivă.'
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: 'Ajustări în Timp Real',
        description: 'Ai ratat un antrenament? AI-ul recalibrează instantaneu întreaga săptămână.'
    }
];

export default function Features() {
    return (
        <section id="tehnologie" className="py-32 relative bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[2px] w-12 bg-[#D9FF5B]" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Tehnologie</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl italic font-black uppercase tracking-tighter">
                        Tot ce ai nevoie <br />
                        <span className="text-gray-400">pentru succes</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="p-10 border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all bg-white group"
                        >
                            <div className="mb-8 text-black group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
