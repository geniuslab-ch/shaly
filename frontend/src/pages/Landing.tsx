import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function Landing() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Hero />
            <Features />
            <Pricing />
            <Testimonials />
            <FAQ />
            <Footer />
        </div>
    );
}
