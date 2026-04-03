import { motion } from 'framer-motion';

export default function SocialProof() {
    return (
        <section className="py-16 border-y-2 border-black bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-[10px] font-black text-black/40 mb-10 uppercase tracking-[0.4em]">
                    Folosit de peste 10,000+ sportivi din întreaga lume
                </p>

                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-80">
                    {['Men\'s Health', 'TechCrunch', 'Wired', 'Forbes', 'GQ'].map((logo, i) => (
                        <motion.div
                            key={logo}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="text-2xl font-black italic tracking-tighter"
                        >
                            {logo}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
