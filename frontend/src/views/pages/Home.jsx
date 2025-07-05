import React, { memo } from 'react';
import Header from '../components/navbar/Header';
import HeroSection from '../features/homeFeatures/HeroSection';
import AboutSection from '../features/homeFeatures/AboutSection';
import ServiceSection from '../features/homeFeatures/ServiceSection';
import HowItWorksSection from '../features/homeFeatures/HowItWorksSection';
import PricingSection from '../features/homeFeatures/PricingSection';
import TestimonialSection from '../features/homeFeatures/TestimonialSection';
import ContactSection from '../features/homeFeatures/ContactSection';
import Footer from '../components/navbar/Footer';
import MetaData from '@/utils/MetaData';

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <MetaData />

      {/* Navbar */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* About Section */}
        <AboutSection />

        {/* Services Section */}
        <ServiceSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Testimonials Section */}
        <TestimonialSection />

        {/* Contact/Book Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default memo(Home);
