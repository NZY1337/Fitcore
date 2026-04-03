import { motion } from 'framer-motion';

const testimonials = [
    {
        quote: "FitCore AI este singura platformă care se adaptează când sunt obosit. Rezultate reale în timp record.",
        author: "Marcus T.",
        role: "Software Engineer",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop"
    },
    {
        quote: "Planul de nutriție este magic. Mănânc ce îmi place și totuși îmi ating macro-urile perfect.",
        author: "Sarah J.",
        role: "Marketing Director",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
    },
    {
        quote: "Ca fondator, nu am timp de planificare. Deschid aplicația, fac ce zice AI-ul și rezultatele apar.",
        author: "David L.",
        role: "Startup Founder",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
    }
];

export default function Testimonials() {
    return (
        <section id="transformari" className="py-32 relative bg-gray-50 border-t-2 border-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[2px] w-12 bg-[#D9FF5B]" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Transformări</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl italic font-black uppercase tracking-tighter">
                        Oameni reali. <br />
                        <span className="text-gray-400">Rezultate reale.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="p-10 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000]"
                        >
                            <p className="text-xl font-bold italic mb-10 leading-relaxed">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center gap-5">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    className="w-16 h-16 border-2 border-black grayscale"
                                    referrerPolicy="no-referrer"
                                />
                                <div>
                                    <div className="font-black italic uppercase tracking-tighter text-lg">{testimonial.author}</div>
                                    <div className="text-xs font-bold uppercase text-gray-400 tracking-widest">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
