// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     Check,
//     Menu,
//     X,
//     Play,
//     Zap,
//     Target,
//     Trophy,
//     Plus,
//     Minus,
//     Smartphone
// } from 'lucide-react';

// import { useAppContext } from '../../context/AppContext';
// import { Link } from 'react-router';

// // --- Components ---

// const Navbar = () => {
//     const [isScrolled, setIsScrolled] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const { session } = useAppContext();

//     useEffect(() => {
//         const handleScroll = () => setIsScrolled(window.scrollY > 50);
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     const navItems = ['Programe', 'Tehnologie', 'Transformări', 'Echipa', 'Prețuri'];

//     return (
//         <>
//             <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isMobileMenuOpen ? 'bg-white/90 backdrop-blur-lg py-4 shadow-sm' : 'bg-transparent py-8'}`}>
//                 <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <div className="w-10 h-10 bg-black flex items-center justify-center rotate-3">
//                             <span className="text-[#DFFF00] font-black text-xl italic">F</span>
//                         </div>
//                         <span className="font-black text-2xl tracking-tighter text-black uppercase italic">FitCore</span>
//                     </div>

//                     <div className="hidden lg:flex items-center gap-10">
//                         {navItems.map((item) => (
//                             <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold uppercase tracking-widest text-black hover:text-[#DFFF00] transition-colors relative group">
//                                 {item}
//                                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
//                             </a>
//                         ))}
//                     </div>

//                     <div className="flex items-center gap-4">
//                         <div className="hidden md:flex items-center gap-4">
//                             {session ? (
//                                 <Link to="/dashboard">
//                                     <button className="bg-black text-white px-8 py-3 font-bold uppercase tracking-tighter text-sm hover:bg-[#DFFF00] hover:text-black transition-all transform hover:-rotate-2 border-2 border-black">
//                                         Dashboard
//                                     </button>
//                                 </Link>
//                             ) : (
//                                 <Link to="/signup">
//                                     <button className="bg-black text-white px-8 py-3 font-bold uppercase tracking-tighter text-sm hover:bg-[#DFFF00] hover:text-black transition-all transform hover:-rotate-2 border-2 border-black">
//                                         Începe Acum
//                                     </button>
//                                 </Link>
//                             )}
//                         </div>
//                         <button className="lg:hidden p-2 text-black" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
//                             {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
//                         </button>
//                     </div>
//                 </div>
//             </nav>

//             <AnimatePresence>
//                 {isMobileMenuOpen && (
//                     <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-40 bg-white pt-24 px-6 lg:hidden flex flex-col gap-6">
//                         {navItems.map((item) => (
//                             <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black uppercase italic text-black border-b-2 border-zinc-100 pb-2">
//                                 {item}
//                             </a>
//                         ))}
//                         <div className="mt-4">
//                             {session ? (
//                                 <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
//                                     <button className="bg-black text-white w-full py-5 font-black uppercase italic text-xl border-4 border-black shadow-[6px_6px_0px_0px_#DFFF00]">Dashboard</button>
//                                 </Link>
//                             ) : (
//                                 <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
//                                     <button className="bg-black text-white w-full py-5 font-black uppercase italic text-xl border-4 border-black shadow-[6px_6px_0px_0px_#DFFF00]">Începe Acum</button>
//                                 </Link>
//                             )}
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </>
//     );
// };

// const Hero = () => (
//     <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-20 overflow-hidden bg-white">
//         <div className="absolute right-[-0%] top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-10 md:opacity-100">
//             <h1 className="text-[25vw] font-black text-zinc-200 leading-none uppercase italic">FITNESS</h1>
//         </div>
//         <div className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 items-center gap-12 relative z-10">
//             <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left">
//                 <div className="flex items-center justify-center lg:justify-start gap-4 mb-6"><span className="h-0.5 w-8 md:w-12 bg-[#DFFF00]"></span><span className="text-black font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Viitorul este AI</span></div>
//                 <h2 className="text-4xl sm:text-3xl md:text-6xl  font-black text-black leading-[0.95] uppercase italic mb-8">
//                     Nu doar <br className="hidden sm:block" />
//                     antrenament. <br className="hidden sm:block" />
//                     {/* Am schimbat text-transparent în text-black pentru a fi vizibil mereu */}
//                     <span className="bg-black text-white px-4 py-2 inline-block mt-2 sm:mt-0 transform -rotate-2">
//                         Evoluție.
//                     </span>
//                 </h2>
//                 <p className="text-zinc-500 text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">Platforma de fitness care se adaptează biologic la nevoile tale. Folosim inteligența artificială pentru a-ți depăși limitele umane.</p>
//                 <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
//                     <button className="px-8 md:px-10 py-4 md:py-5 bg-[#DFFF00] text-black font-black uppercase italic text-base md:text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all border-2 border-black">Start Trial Gratuit</button>
//                     <button className="px-8 md:px-10 py-4 md:py-5 border-2 border-black text-black font-black uppercase italic text-base md:text-lg flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all"><Play className="fill-current w-4 h-4 md:w-5 md:h-5" /> Video Demo</button>
//                 </div>
//             </motion.div>
//             <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative mt-12 lg:mt-0">
//                 <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-24 h-24 md:w-40 md:h-40 bg-[#DFFF00] -z-10 animate-pulse"></div>
//                 <div className="relative border-[6px] md:border-[10px] border-black overflow-hidden transform rotate-2 shadow-2xl bg-zinc-200">
//                     <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop" alt="Athlete" className="w-full h-[400px] md:h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700" />
//                     <div className="absolute bottom-0 left-0 bg-black text-[#DFFF00] p-4 md:p-6 w-full">
//                         <div className="flex justify-between items-center">
//                             <div><p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Sesiune Activă</p><p className="text-lg md:text-xl font-black italic">INTENSITATE: 98%</p></div>
//                             <Zap className="w-6 h-6 md:w-8 md:h-8" />
//                         </div>
//                     </div>
//                 </div>
//             </motion.div>
//         </div>
//     </section>
// );

// const Features = () => {
//     const stats = [
//         { label: "Utilizatori Activi", value: "250K+" },
//         { label: "Calorii Arse", value: "1.2B" },
//         { label: "Acuratețe AI", value: "99.4%" },
//     ];
//     return (
//         <section id="tehnologie" className="py-20 md:py-24 bg-black text-white overflow-hidden">
//             <div className="max-w-7xl mx-auto px-6 md:px-8">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 border-b border-zinc-800 pb-16 md:pb-20">
//                     {stats.map((s, i) => (
//                         <div key={i} className="text-center md:text-left">
//                             <h3 className="text-5xl md:text-6xl font-black text-[#DFFF00] italic mb-2 tracking-tighter">{s.value}</h3>
//                             <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] md:text-sm">{s.label}</p>
//                         </div>
//                     ))}
//                 </div>
//                 <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center mt-16 md:mt-20">
//                     <div className="grid grid-cols-2 gap-3 md:gap-4 order-2 lg:order-1">
//                         <div className="space-y-3 md:space-y-4">
//                             <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop" className="w-full h-48 md:h-64 object-cover grayscale rounded-sm" alt="Workout" />
//                             <div className="bg-[#DFFF00] p-4 md:p-6 h-40 md:h-48 flex flex-col justify-end border-2 border-black">
//                                 <Target className="text-black w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-4" />
//                                 <h4 className="text-black font-black uppercase leading-none text-base md:text-xl italic">Precizie<br />Biometrică</h4>
//                             </div>
//                         </div>
//                         <div className="space-y-3 md:space-y-4 pt-8 md:pt-12">
//                             <div className="bg-zinc-900 p-4 md:p-6 h-40 md:h-48 flex flex-col justify-end border-2 border-zinc-700">
//                                 <Trophy className="text-[#DFFF00] w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-4" />
//                                 <h4 className="text-white font-black uppercase leading-none text-base md:text-xl italic">Performanță<br />Maximă</h4>
//                             </div>
//                             <img src="https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=600&auto=format&fit=crop" className="w-full h-48 md:h-64 object-cover grayscale rounded-sm" alt="Stats" />
//                         </div>
//                     </div>
//                     <div className="order-1 lg:order-2">
//                         <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-6 md:mb-8 leading-tight">Senzația unui coach personal, inteligența unui supercomputer.</h2>
//                         <p className="text-zinc-400 text-base md:text-lg mb-8 md:mb-10 leading-relaxed font-medium">Algoritmii noștri procesează peste 50 de parametri în timp real pentru a-ți oferi exact antrenamentul de care ai nevoie astăzi.</p>
//                         <ul className="space-y-4 md:space-y-6">
//                             {['Planuri adaptate zilnic', 'Analiză video a posturii', 'Integrare Smartwatch completă'].map((item, i) => (
//                                 <li key={i} className="flex items-center gap-3 md:gap-4 text-white font-bold uppercase italic tracking-tighter text-xs md:text-sm">
//                                     <div className="w-5 h-5 md:w-6 md:h-6 bg-[#DFFF00] flex items-center justify-center shrink-0"><Check className="text-black w-3 h-3 md:w-4 md:h-4" /></div>{item}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// const Transformations = () => {
//     const cases = [
//         { name: "Andrei V.", before: "95kg", after: "82kg", time: "12 Săptămâni", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop" },
//         { name: "Maria L.", before: "28%", after: "19%", time: "8 Săptămâni", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop" },
//     ];
//     return (
//         <section id="transformări" className="py-20 md:py-24 bg-white overflow-hidden">
//             <div className="max-w-7xl mx-auto px-6 md:px-8">
//                 <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-12 border-l-8 border-[#DFFF00] pl-6 leading-tight">Rezultate<br />Fără Filtru</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
//                     {cases.map((c, i) => (
//                         <div key={i} className="group relative border-4 border-black bg-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
//                             <div className="h-64 sm:h-80 md:h-96 relative overflow-hidden">
//                                 <img src={c.img} alt={c.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
//                                 <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-black italic uppercase text-[10px]">După Program</div>
//                             </div>
//                             <div className="p-6 md:p-8 border-t-4 border-black">
//                                 <div className="flex justify-between items-end mb-4">
//                                     <h3 className="text-2xl md:text-3xl font-black uppercase italic">{c.name}</h3>
//                                     <span className="bg-[#DFFF00] px-3 md:px-4 py-1 font-black italic text-xs md:text-sm border-2 border-black">{c.time}</span>
//                                 </div>
//                                 <div className="flex gap-4 md:gap-8">
//                                     <div><p className="text-[10px] font-bold uppercase text-zinc-500 tracking-tighter">Inițial</p><p className="text-lg md:text-xl font-black italic">{c.before}</p></div>
//                                     <div className="w-px h-8 md:h-10 bg-zinc-200"></div>
//                                     <div><p className="text-[10px] font-bold uppercase text-zinc-500 tracking-tighter">Prezent</p><p className="text-lg md:text-xl font-black italic text-green-600">{c.after}</p></div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// const Trainers = () => {
//     const trainers = [
//         { name: "Alex Zoran", specialty: "Body Recomposition", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop" },
//         { name: "Elena Munte", specialty: "Performance Nutrition", img: "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800&auto=format&fit=crop" },
//         { name: "Radu Iron", specialty: "Hypertrophy Specialist", img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop" },
//     ];
//     return (
//         <section id="echipa" className="py-20 md:py-24 bg-black text-white">
//             <div className="max-w-7xl mx-auto px-6 md:px-8">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
//                     <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none">Arhitecții <br className="hidden md:block" /> <span className="text-[#DFFF00]">Performanței</span></h2>
//                     <p className="text-zinc-400 max-w-sm font-bold uppercase text-[10px] md:text-sm tracking-widest leading-relaxed">Antrenori certificați internațional care colaborează cu algoritmul nostru pentru succesul tău.</p>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//                     {trainers.map((t, i) => (
//                         <div key={i} className="relative group overflow-hidden border-2 border-zinc-800">
//                             <img src={t.img} alt={t.name} className="w-full h-[400px] md:h-[500px] object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
//                             <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/90 to-transparent">
//                                 <h4 className="text-xl md:text-2xl font-black uppercase italic mb-1">{t.name}</h4>
//                                 <p className="text-[#DFFF00] font-bold uppercase tracking-tighter text-xs md:text-sm">{t.specialty}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// const AppPromotion = () => (
//     <section className="py-20 md:py-24 bg-[#DFFF00] overflow-hidden">
//         <div className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 items-center gap-12 md:gap-16">
//             <div className="relative order-2 lg:order-1">
//                 <div className="w-60 md:w-72 h-[500px] md:h-[600px] bg-black rounded-[2.5rem] md:rounded-[3rem] border-[6px] md:border-[8px] border-zinc-900 mx-auto relative overflow-hidden shadow-[15px_15px_0px_0px_rgba(0,0,0,0.1)] md:shadow-[30px_30px_0px_0px_rgba(0,0,0,0.1)]">
//                     <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="App Screen" />
//                     <div className="absolute top-0 w-full h-10 md:h-12 bg-black/20 backdrop-blur-md flex items-center justify-center"><div className="w-12 md:w-16 h-3 md:h-4 bg-black rounded-full"></div></div>
//                 </div>
//             </div>
//             <div className="order-1 lg:order-2 text-center lg:text-left">
//                 <h2 className="text-4xl md:text-6xl font-black uppercase italic text-black mb-8 leading-none">Puterea în buzunarul tău</h2>
//                 <p className="text-black/70 text-lg md:text-xl font-bold mb-10 max-w-md mx-auto lg:mx-0">Sync complet cu Apple Health, Google Fit și Garmin. Monitorizează tot, de la pași la somn.</p>
//                 <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
//                     <button className="bg-black text-white px-6 md:px-8 py-4 rounded-xl font-black uppercase italic flex items-center justify-center gap-3 hover:scale-105 transition-all"><Smartphone className="w-5 h-5 md:w-6 md:h-6" /> App Store</button>
//                     <button className="bg-black text-white px-6 md:px-8 py-4 rounded-xl font-black uppercase italic flex items-center justify-center gap-3 hover:scale-105 transition-all"><Play className="w-5 h-5 md:w-6 md:h-6 fill-current" /> Play Store</button>
//                 </div>
//             </div>
//         </div>
//     </section>
// );

// const FAQ = () => {
//     const [openIndex, setOpenIndex] = useState(0);
//     const faqs = [
//         { q: "Trebuie să fiu avansat pentru a folosi FitCore?", a: "Absolut nu. AI-ul nostru începe de la nivelul tău actual." },
//         { q: "Cum funcționează analiza video?", a: "Folosim camera telefonului tău pentru a detecta 17 puncte cheie ale corpului în timp real." },
//         { q: "Pot anula abonamentul oricând?", a: "Da, fără întrebări ascunse. Poți anula din setările contului cu un singur click." }
//     ];
//     return (
//         <section className="py-20 md:py-24 bg-white">
//             <div className="max-w-4xl mx-auto px-6 md:px-8">
//                 <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-12 text-center">Întrebări <span className="bg-black text-[#DFFF00] px-3 md:px-4">Frecvente</span></h2>
//                 <div className="space-y-4">
//                     {faqs.map((faq, i) => (
//                         <div key={i} className={`border-4 border-black transition-all ${openIndex === i ? 'bg-zinc-50 translate-x-1 shadow-[4px_4px_0px_0px_#000]' : 'bg-white'}`}>
//                             <button onClick={() => setOpenIndex(openIndex === i ? -1 : i)} className="w-full p-5 md:p-6 flex justify-between items-center text-left gap-4">
//                                 <span className="text-base md:text-xl font-black uppercase italic">{faq.q}</span>
//                                 {openIndex === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
//                             </button>
//                             <AnimatePresence>{openIndex === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden"><div className="p-5 md:p-6 pt-0 text-zinc-600 font-medium border-t-2 border-black/5">{faq.a}</div></motion.div>}</AnimatePresence>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// const Footer = () => (
//     <footer className="bg-black text-white py-16 md:py-20 overflow-hidden">
//         <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
//             <div className="col-span-1 lg:col-span-2">
//                 <h2 className="text-3xl md:text-4xl font-black italic uppercase mb-6">Fii primul care află.</h2>
//                 <div className="flex max-w-md border-2 border-zinc-800">
//                     <input type="email" placeholder="Email-ul tău" className="bg-zinc-900 border-none px-4 py-3 w-full font-bold text-sm" />
//                     <button className="bg-[#DFFF00] text-black px-6 font-black uppercase italic hover:bg-white text-sm">OK</button>
//                 </div>
//             </div>
//             <div><h4 className="font-black uppercase italic mb-6 text-[#DFFF00] text-sm">Companie</h4><ul className="space-y-3 text-zinc-400 font-bold uppercase text-[10px] tracking-widest"><li>Despre noi</li><li>Contact</li></ul></div>
//             <div><h4 className="font-black uppercase italic mb-6 text-[#DFFF00] text-sm">Legal</h4><ul className="space-y-3 text-zinc-400 font-bold uppercase text-[10px] tracking-widest"><li>Termeni</li><li>GDPR</li></ul></div>
//         </div>
//         <div className="max-w-7xl mx-auto px-6 md:px-8 mt-16 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-[10px] uppercase font-bold tracking-[0.3em]">© 2024 FitCore AI Systems.</div>
//     </footer>
// );

import CTA from "../HomepageV2/CTA";
import Features from "../HomepageV2/Features";
import Footer from "../HomepageV2/Footer";
import Hero from "../HomepageV2/Hero";
import Navbar from "../HomepageV2/Navbar";
import HowItWorks from "../HomepageV2/HowItWorks";
import Pricing from "../HomepageV2/Pricing";
import SocialProof from "../HomepageV2/SocialProof";
import Testimonials from "../HomepageV2/Testimonials";

export default function Homepage() {
    return (
        <div className="bg-white font-sans selection:bg-[#DFFF00] selection:text-black scroll-smooth overflow-x-hidden">
            <Navbar />
            <Hero />
            <Features />
            <Pricing />
            <Testimonials />
            <HowItWorks />
            <SocialProof />
            <CTA />
            <Footer />
        </div>
    );
}

// export default function App() {
//     return (
//         <div className="bg-white font-sans selection:bg-[#DFFF00] selection:text-black scroll-smooth overflow-x-hidden">
//             <Navbar />
//             <Hero />
//             <Features />
//             <Transformations />
//             <Trainers />
//             <AppPromotion />
//             <FAQ />
//             <Footer />
//         </div>
//     );
// }