import Hero from "./Hero"
import Features from "./Features"
import HowItWorks from "./HowItWorks"
import Benefits from "./Benefits"
import FAQ from "./FAQ"
import CTA from "./CTA"
import Footer from "./Footer"
import React from "react"
import HelpBot from "./HelBot"
import Header from "./Header"
const Home: React.FC = () => {

    return (
        <>
            <Header />
            <Hero />
            <HelpBot/>
            <Features />
            <HowItWorks />
            <Benefits />
            <FAQ />
            <CTA />
            <Footer />
        </>
    );
};

export default Home;
