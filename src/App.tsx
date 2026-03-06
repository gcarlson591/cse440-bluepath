/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  Accessibility, 
  Search, 
  ChevronRight, 
  Info, 
  Clock, 
  Wind, 
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CAMPUSES = [
  "Stanford University",
  "UC Berkeley",
  "MIT",
  "Harvard University",
  "University of Washington",
  "Custom Campus..."
];

const ACCESSIBILITY_NEEDS = [
  { id: 'wheelchair', label: 'Wheelchair Accessible', icon: Accessibility },
  { id: 'elevators', label: 'Elevator Access Only', icon: Navigation },
  { id: 'low-traffic', label: 'Low Traffic/Quiet', icon: Wind },
  { id: 'well-lit', label: 'Well-Lit Paths', icon: ShieldCheck },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(CAMPUSES[0]);
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [needs, setNeeds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoute, setGeneratedRoute] = useState<string | null>(null);

  const toggleNeed = (id: string) => {
    setNeeds(prev => 
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const handleGenerateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startPoint || !endPoint) return;

    setIsGenerating(true);
    setGeneratedRoute(null);

    try {
      const needsText = needs.length > 0 
        ? `The user has the following accessibility requirements: ${needs.join(', ')}.` 
        : "The user needs a standard accessible route.";

      const prompt = `
        You are BluePath, an expert campus accessibility assistant.
        The user is at ${selectedCampus}.
        They want to go from "${startPoint}" to "${endPoint}".
        ${needsText}
        
        Please provide a detailed, step-by-step accessible route. 
        Include:
        1. Estimated time.
        2. Specific landmarks (e.g., "Pass the library on your left").
        3. Accessibility notes (e.g., "Use the ramp at the North entrance").
        4. Any potential obstacles to avoid.
        
        Keep the tone helpful and professional. Use Markdown for formatting.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setGeneratedRoute(response.text || "Sorry, I couldn't generate a route at this time.");
    } catch (error) {
      console.error("Error generating route:", error);
      setGeneratedRoute("An error occurred while generating your route. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Navigation className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-display font-bold tracking-tight text-slate-900">
                Blue<span className="text-blue-600">Path</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Campuses</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</a>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#" className="block text-lg font-medium text-slate-900">Features</a>
                <a href="#" className="block text-lg font-medium text-slate-900">Campuses</a>
                <a href="#" className="block text-lg font-medium text-slate-900">About</a>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                  <Accessibility className="w-3 h-3" />
                  Redefining Campus Mobility
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6">
                  Navigate your campus <span className="text-blue-600">without barriers.</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                  BluePath provides personalized, accessible routes for students, faculty, and visitors. Find the smoothest path to your next class, meeting, or event.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-2 group">
                    Start Navigating
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                    View Map
                  </button>
                </div>

                <div className="mt-12 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <img 
                        key={i}
                        src={`https://picsum.photos/seed/user${i}/100/100`} 
                        alt="User" 
                        className="w-10 h-10 rounded-full border-2 border-white"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    Trusted by <span className="text-slate-900 font-bold">10,000+</span> students daily
                  </p>
                </div>
              </motion.div>

              {/* Route Generator Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-slate-200 border border-slate-100">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-display font-bold text-slate-900">Generate Route</h2>
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-sm font-bold">
                      <Clock className="w-4 h-4" />
                      Real-time
                    </div>
                  </div>

                  <form onSubmit={handleGenerateRoute} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Select Campus</label>
                      <select 
                        value={selectedCampus}
                        onChange={(e) => setSelectedCampus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      >
                        {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Starting From</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            type="text" 
                            placeholder="e.g. Main Gate"
                            value={startPoint}
                            onChange={(e) => setStartPoint(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Destination</label>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            type="text" 
                            placeholder="e.g. Science Lab"
                            value={endPoint}
                            onChange={(e) => setEndPoint(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-4">Accessibility Preferences</label>
                      <div className="grid grid-cols-2 gap-3">
                        {ACCESSIBILITY_NEEDS.map((need) => (
                          <button
                            key={need.id}
                            type="button"
                            onClick={() => toggleNeed(need.id)}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all",
                              needs.includes(need.id) 
                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                                : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                            )}
                          >
                            <need.icon className={cn("w-4 h-4", needs.includes(need.id) ? "text-white" : "text-blue-600")} />
                            {need.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isGenerating || !startPoint || !endPoint}
                      className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating Route...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-5 h-5" />
                          Generate Personalized Route
                        </>
                      )}
                    </button>
                  </form>

                  {/* Results Area */}
                  <AnimatePresence>
                    {generatedRoute && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8 pt-8 border-t border-slate-100"
                      >
                        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                          <div className="flex items-center gap-2 text-blue-700 font-bold mb-4">
                            <Info className="w-5 h-5" />
                            Your Accessible Route
                          </div>
                          <div className="prose prose-sm prose-blue max-w-none text-slate-700">
                            <ReactMarkdown>{generatedRoute}</ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-100 rounded-full -z-10 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-100 rounded-full -z-10 blur-2xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Built for every journey.</h2>
              <p className="text-lg text-slate-600">
                We've mapped every ramp, elevator, and automatic door to ensure your campus experience is seamless and inclusive.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart Mapping",
                  desc: "Real-time updates on construction, broken elevators, and path closures.",
                  icon: MapPin,
                  color: "bg-blue-500"
                },
                {
                  title: "Personalized Needs",
                  desc: "Tailor your route based on your specific mobility requirements.",
                  icon: Accessibility,
                  color: "bg-emerald-500"
                },
                {
                  title: "Voice Navigation",
                  desc: "Step-by-step audio guidance for a hands-free navigation experience.",
                  icon: Wind,
                  color: "bg-purple-500"
                }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg", feature.color)}>
                    <feature.icon className="text-white w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial / Impact */}
        <section className="py-24 bg-blue-600 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 border-4 border-white rounded-full" />
            <div className="absolute bottom-20 right-20 w-96 h-96 border-8 border-white rounded-full" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-10 leading-tight">
                "BluePath has completely changed how I move around campus. I no longer have to worry about finding the right elevator or avoiding stairs."
              </h2>
              <div className="flex items-center justify-center gap-4">
                <img 
                  src="https://picsum.photos/seed/student/100/100" 
                  alt="Student" 
                  className="w-16 h-16 rounded-full border-4 border-white/20"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <div className="font-bold text-xl">Sarah Jenkins</div>
                  <div className="text-blue-100">Senior at Stanford University</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/10 blur-[100px]" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">Ready to find your path?</h2>
                <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                  Join thousands of students making their campus more accessible. Download the app or start using our web tool today.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all flex items-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.96.95-2.04 1.9-3.4 1.9-1.33 0-1.77-.82-3.33-.82-1.55 0-2.04.8-3.33.85-1.3.05-2.52-1.04-3.48-2.02-1.96-1.98-3.45-5.6-3.45-9 0-3.38 1.7-5.18 3.35-5.18 1.65 0 2.53.92 3.53.92 1 0 2.1-.92 3.75-.92 1.4 0 2.65.65 3.4 1.65-3.1 1.83-2.6 6.35.53 7.7-1.05 2.53-2.43 4.93-3.57 4.93zM12.03 5.07c-.03-2.6 2.13-4.73 4.73-4.77.05 2.6-2.13 4.83-4.73 4.77z"/>
                    </svg>
                    App Store
                  </button>
                  <button className="bg-slate-800 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-700 transition-all flex items-center gap-3 border border-slate-700">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186c-.18.18-.28.42-.28.67 0 .52.42.94.94.94.25 0 .49-.1.67-.28l10.85-10.85c.37-.37.37-.97 0-1.34L5.04 1.17c-.18-.18-.42-.28-.67-.28-.52 0-.94.42-.94.94 0 .25.1.49.28.67z"/>
                    </svg>
                    Google Play
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Navigation className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-display font-bold text-slate-900">
                  BluePath
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Making campus navigation accessible for everyone, one path at a time.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Campus Maps</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Accessibility</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-sm">
              © 2024 BluePath Technologies Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              {/* Social icons would go here */}
              <div className="w-5 h-5 bg-slate-200 rounded-full" />
              <div className="w-5 h-5 bg-slate-200 rounded-full" />
              <div className="w-5 h-5 bg-slate-200 rounded-full" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
