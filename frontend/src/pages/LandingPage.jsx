// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Galaxy from '../components/Aurora';

const FeatureCard = ({ icon, title, description }) => (
  // Responsive change: Reduced padding on small screens (p-6)
  <div className="group bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/20 hover:border-blue-400/50 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-300 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-blue-400/20 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    {/* Responsive change: Adjusted font size for smaller screens */}
    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 drop-shadow-lg group-hover:text-blue-200 transition-colors duration-300">{title}</h3>
    <p className="text-gray-300 leading-relaxed drop-shadow-md group-hover:text-gray-200 transition-colors duration-300">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, name, role, avatar }) => (
  // Responsive change: Reduced padding on small screens (p-6)
  <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/20 hover:border-purple-400/50 text-center transition-all duration-500 hover:bg-white/10 hover:shadow-xl hover:shadow-purple-500/10">
    <div className="mb-6">
      <svg className="w-8 h-8 text-purple-400/60 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {/* Responsive change: Adjusted font size for smaller screens */}
      <p className="text-gray-200 italic text-base md:text-lg leading-relaxed drop-shadow-md">"{quote}"</p>
    </div>
    <div className="flex items-center justify-center">
      <div className="relative">
        <img src={avatar} alt={name} className="w-14 h-14 rounded-full mr-4 shadow-xl border-2 border-white/20" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white/80"></div>
      </div>
      <div className="text-left">
        <p className="font-bold text-white text-lg drop-shadow-lg">{name}</p>
        <p className="text-sm text-purple-300/80 font-medium">{role}</p>
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden"> {/* Responsive change: Added overflow-x-hidden */}
      {/* Galaxy Background - Fixed and covering entire viewport */}
      <div className="fixed inset-0 z-0">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.2}
          glowIntensity={0.4}
          saturation={0.6}
          hueShift={200}
          speed={0.8}
          twinkleIntensity={0.4}
          rotationSpeed={0.05}
          transparent={true}
        />
      </div>

      {/* Content Layer - Above the galaxy */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center pt-20 pb-10"> {/* Responsive change: Added pb-10 for small screens */}
          {/* Responsive change: Adjusted horizontal padding */}
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-5xl mx-auto">
              {/* Hero Badge */}
              <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-full px-4 py-2 sm:px-6 sm:py-3 mb-8 border border-blue-400/30">
                {/* Responsive change: Adjusted text size and wrapping for badge */}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text font-semibold text-xs sm:text-sm text-center">
                  ✨ New: AI-powered task suggestions now available
                </span>
              </div>

              {/* Main Headline */}
              {/* Responsive change: Added smaller base font size for mobile */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 text-transparent bg-clip-text drop-shadow-2xl">
                  Organize Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-2xl">
                  Life with Smart Tasks
                </span>
              </h1>

              {/* Subtitle */}
              {/* Responsive change: Adjusted font size for smaller screens */}
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                Drag, drop, and conquer your daily goals with an intuitive interface, intelligent notifications, and powerful analytics that adapt to your workflow.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
                <Link
                  to="/register"
                  className="group w-full sm:w-auto relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105 border border-blue-500/20"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-xl text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/30 hover:border-white/50"
                >
                  Watch Demo
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col items-center">
                <p className="text-gray-400 text-sm mb-4">Trusted by 50,000+ teams worldwide</p>
                {/* Responsive change: Tighter spacing and smaller text on mobile */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 opacity-60">
                  <div className="text-white font-bold text-base sm:text-lg">Microsoft</div>
                  <div className="text-white font-bold text-base sm:text-lg">Spotify</div>
                  <div className="text-white font-bold text-base sm:text-lg">Airbnb</div>
                  <div className="text-white font-bold text-base sm:text-lg">Slack</div>
                </div>
              </div>
            </div>
          </div>  
        </section>

        {/* Features Section */}
        {/* Responsive change: Reduced vertical padding on mobile */}
        <section id="features" className="py-24 lg:py-32">
          {/* Responsive change: Adjusted horizontal padding */}
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 md:mb-20"> {/* Responsive change: Adjusted margin */}
              <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-full px-6 py-2 mb-6 border border-blue-400/20">
                <span className="text-blue-300 font-semibold text-sm">Features</span>
              </div>
              {/* Responsive change: Added smaller base font size for mobile */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-2xl mb-6">
                <span className="bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text">
                  Everything You Need
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                  to Succeed
                </span>
              </h2>
              {/* Responsive change: Adjusted font size */}
              <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
                Powerful tools designed to streamline your workflow and boost productivity without the complexity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              <FeatureCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
                title="Intuitive Drag & Drop"
                description="Effortlessly organize your tasks with our smooth, responsive drag-and-drop interface. Move tasks between columns with satisfying visual feedback."
              />
              <FeatureCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
                title="Smart Notifications"
                description="AI-powered reminders that learn your patterns and send notifications at the perfect time. Never miss important deadlines again."
              />
              <FeatureCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                title="Advanced Analytics"
                description="Beautiful charts and insights that reveal your productivity patterns. Understand your workflow and optimize for peak performance."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* Responsive change: Reduced vertical padding on mobile */}
        <section id="testimonials" className="py-24 lg:py-32">
          {/* Responsive change: Adjusted horizontal padding */}
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 md:mb-20"> {/* Responsive change: Adjusted margin */}
              <div className="inline-flex items-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-full px-6 py-2 mb-6 border border-purple-400/20">
                <span className="text-purple-300 font-semibold text-sm">Testimonials</span>
              </div>
              {/* Responsive change: Added smaller base font size for mobile */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-2xl mb-6">
                <span className="bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
                  Loved by Teams
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Everywhere
                </span>
              </h2>
              {/* Responsive change: Adjusted font size */}
              <p className="text-lg md:text-xl text-gray-300 drop-shadow-lg leading-relaxed max-w-2xl mx-auto">
                Join thousands of satisfied users who have transformed their productivity.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <TestimonialCard
                quote="This tool has completely revolutionized how I manage my freelance projects. The visual board and smart notifications are absolute game-changers for my workflow!"
                name="Sarah L."
                role="Freelance Designer"
                avatar="https://randomuser.me/api/portraits/women/44.jpg"
              />
              <TestimonialCard
                quote="Finally, a task manager that's powerful yet intuitive. My team's productivity has increased by 40% since we started using this platform. Highly recommended!"
                name="Michael K."
                role="Project Manager, TechCorp"
                avatar="https://randomuser.me/api/portraits/men/32.jpg"
              />
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        {/* Responsive change: Reduced vertical padding on mobile */}
        <section className="py-24 lg:py-32">
          {/* Responsive change: Adjusted horizontal padding */}
          <div className="container mx-auto px-4 sm:px-6 text-center">
            {/* Responsive change: Significantly reduced padding on smaller screens */}
            <div className="relative bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 lg:p-20 border border-white/20 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl blur-xl"></div>
              <div className="relative z-10">
                {/* Responsive change: Added smaller base font size for mobile */}
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-white drop-shadow-2xl">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 text-transparent bg-clip-text">
                    Ready to Transform
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                    Your Productivity?
                  </span>
                </h2>
                {/* Responsive change: Adjusted font size */}
                <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
                  Join over 50,000 users who are already achieving their goals with our intelligent task management platform.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Link
                    to="/register"
                    // Responsive change: Adjusted padding and font size for the button
                    className="group w-full sm:w-auto relative bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl text-white px-8 py-4 md:px-12 md:py-5 rounded-xl text-lg md:text-xl font-bold hover:from-white/30 hover:to-white/20 transition-all duration-300 shadow-2xl hover:scale-105 border border-white/30 hover:border-white/50"
                  >
                    <span className="relative z-10">Start Free Trial</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                  </Link>
                  <div className="text-gray-400 text-sm pt-2 sm:pt-0">
                    ✨ No credit card required • 14-day free trial
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;