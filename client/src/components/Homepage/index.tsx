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

import CTA from "../HomepageV2/CTA";
import Features from "../HomepageV2/Features";
import Footer from "../HomepageV2/Footer";
import Hero from "../HomepageV2/Hero";
import Navbar from "../HomepageV2/Navbar";
import HowItWorks from "../HomepageV2/HowItWorks";
import Pricing from "../HomepageV2/Pricing";
import SocialProof from "../HomepageV2/SocialProof";
import Testimonials from "../HomepageV2/Testimonials";
import Core from "../HomepageV2/Core";
import Trainers from "../HomepageV2/Trainer";
import FAQ from "../HomepageV2/Faq";
import Transformations from "../HomepageV2/Transformation";

export default function Homepage() {
    return (
        <div className="bg-white font-sans selection:bg-[#DFFF00] selection:text-black scroll-smooth overflow-x-hidden">
            <Navbar />
            <Hero />
            <Core />
            <Features />
            <Pricing />
            <Trainers />
            <Testimonials />
            <Transformations />
            <HowItWorks />
            <FAQ />
            <SocialProof />
            <CTA />
            <Footer />
        </div>
    );
}

