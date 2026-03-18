import React from 'react';

export default function ThemeShowcase() {
  return (
    <div className="min-h-screen bg-[#F8F3E1] text-[#41431B] font-sans p-8 md:p-16">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Section */}
        <header className="border-b border-[#AEB784]/30 pb-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Aura <span className="font-semibold text-[#AEB784]">Botanica</span>
          </h1>
          <p className="text-lg text-[#41431B]/80 max-w-2xl leading-relaxed">
            A bright, modern UI theme showcasing a fresh, airy palette. Combining dark olive typography with muted green accents atop beautifully minimal beige backgrounds.
          </p>
        </header>

        {/* Components Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Form Elements */}
          <div className="bg-[#E3DBBB] p-8 rounded-2xl shadow-[0_4px_20px_rgba(65,67,27,0.05)] flex flex-col gap-6">
            <h2 className="text-2xl font-medium">Input & Controls</h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium opacity-90">Email Address</label>
              <input 
                type="email" 
                placeholder="hello@example.com" 
                className="w-full px-4 py-3 rounded-xl bg-[#F8F3E1] border border-transparent focus:border-[#AEB784] focus:ring-2 focus:ring-[#AEB784]/20 outline-none transition-all text-[#41431B] placeholder-[#41431B]/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium opacity-90">Select Option</label>
              <select className="w-full px-4 py-3 rounded-xl bg-[#F8F3E1] border border-transparent focus:border-[#AEB784] outline-none transition-all text-[#41431B] appearance-none">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>

          {/* Card 2: Buttons */}
          <div className="bg-[#E3DBBB] p-8 rounded-2xl shadow-[0_4px_20px_rgba(65,67,27,0.05)] flex flex-col gap-6">
            <h2 className="text-2xl font-medium">Interactive Buttons</h2>
            
            <button className="w-full py-3 px-6 rounded-xl bg-[#AEB784] text-[#41431B] font-medium shadow-sm hover:bg-[#9CA673] hover:shadow-md hover:-translate-y-0.5 transition-all active:translate-y-0">
              Primary Action
            </button>
            
            <button className="w-full py-3 px-6 rounded-xl bg-[#F8F3E1] text-[#41431B] font-medium border border-[#AEB784]/40 hover:border-[#AEB784] hover:bg-white transition-all">
              Secondary Action
            </button>

            <button className="w-full py-3 px-6 rounded-xl text-[#41431B] font-medium hover:bg-[#F8F3E1]/50 underline-offset-4 hover:underline transition-all">
              Tertiary Link
            </button>
          </div>

          {/* Card 3: Content UI */}
          <div className="bg-[#E3DBBB] p-8 rounded-2xl shadow-[0_4px_20px_rgba(65,67,27,0.05)] flex flex-col gap-6">
            <h2 className="text-2xl font-medium">Content Blocks</h2>
            
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F8F3E1]/60">
              <div className="w-10 h-10 rounded-full bg-[#AEB784] flex items-center justify-center shrink-0 text-[#F8F3E1]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h4 className="font-semibold text-[15px]">Task Completed</h4>
                <p className="text-sm opacity-80 mt-1">Your recent changes have been saved successfully.</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#41431B]/10 pt-4 mt-auto">
              <span className="text-sm font-medium opacity-70">Status</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#AEB784]/30 text-[#41431B]">Active</span>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
