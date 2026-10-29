import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white text-[#121028] font-sans overflow-x-hidden selection:bg-[#ffd246] selection:text-[#121028]">
      {/* Navigation Header */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-1 h-6">
            <div className="w-1.5 h-3.5 bg-[#f59e0b] rounded-full"></div>
            <div className="w-1.5 h-5 bg-[#fbbf24] rounded-full"></div>
            <div className="w-1.5 h-6 bg-[#f59e0b] rounded-full"></div>
          </div>
          <span className="text-2xl font-black text-[#121028] tracking-tight">SocialVibe</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-700">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-black transition-colors">How it works</a>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#5835F5] hover:bg-[#4726e0] text-white rounded-full px-6 py-2.5 font-bold text-sm transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-[#121028] hover:text-[#5835F5] px-4 py-2 font-bold text-sm transition-colors cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-[#121028] hover:bg-black text-white rounded-full px-6 py-2.5 font-bold text-sm transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                Get started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#f0edff] text-[#5835F5] font-extrabold text-xs px-4 py-1.5 rounded-full">
              <Sparkles size={14} />
              <span>AI that writes in your voice</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] text-[#121028]">
              Post once. <br />
              Play <span className="bg-[#ffd246] px-2 py-0.5 rounded-xl inline-block">everywhere.</span>
            </h1>

            <p className="text-lg text-gray-600 font-medium max-w-lg leading-relaxed">
              Schedule and publish to every platform at once, with captions written from your own brand notes.
            </p>

            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                className="bg-[#121028] hover:bg-black text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get started'}
              </button>
              
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  className="border-2 border-[#121028] hover:bg-black/5 text-[#121028] px-8 py-3.5 rounded-full font-bold text-sm transition-all cursor-pointer"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>

          {/* Right Floating Cards Illustration */}
          <div className="relative min-h-[380px] flex items-center justify-center">
            {/* Coral/Pink Base Card */}
            <div className="w-72 h-64 bg-[#ff4b72] rounded-3xl p-5 shadow-2xl transform -rotate-6 relative z-10 text-white flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold opacity-80">@yourbrand</span>
                <div className="w-8 h-8 rounded-full bg-[#ffd246] opacity-90"></div>
              </div>
              <div className="bg-black/20 p-3 rounded-2xl text-xs font-semibold backdrop-blur-sm">
                Weekend sale starts Friday.
              </div>
            </div>

            {/* White Overlapping Floating Card */}
            <div className="absolute top-4 right-4 sm:right-12 w-80 bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 transform rotate-3 z-20">
              <p className="font-extrabold text-sm text-[#121028] leading-snug mb-2">
                Three new pieces and one very good reason to visit.
              </p>
              <p className="text-xs text-gray-500 font-medium mb-3">
                Doors open at 10, and the first ten visitors get a surprise.
              </p>
              <span className="bg-[#f0edff] text-[#5835F5] font-bold text-[11px] px-3 py-1 rounded-full inline-block">
                LinkedIn
              </span>
            </div>

            {/* Yellow Floating Pill Card */}
            <div className="absolute bottom-6 left-6 sm:left-14 bg-[#ffd246] rounded-2xl p-4 shadow-xl z-30 transform -rotate-3 text-[#121028] max-w-[240px]">
              <p className="font-black text-xs mb-1">Friday, 7 pm. Don't miss it.</p>
              <span className="bg-[#121028] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                X
              </span>
            </div>

            {/* Mint Green Status Pill */}
            <div className="absolute -bottom-2 right-8 bg-[#10b981] text-white font-extrabold text-xs px-5 py-2 rounded-full shadow-lg z-30 transform rotate-2">
              Scheduled • Fri 7:00 pm
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="bg-[#5835F5] text-white py-4 overflow-hidden whitespace-nowrap shadow-inner">
        <div className="flex items-center justify-around gap-8 font-black text-lg sm:text-xl tracking-wider uppercase">
          <span>Schedule</span>
          <span className="w-2 h-2 rounded-full bg-white"></span>
          <span>Create</span>
          <span className="w-2 h-2 rounded-full bg-white"></span>
          <span>Publish</span>
          <span className="w-2 h-2 rounded-full bg-white"></span>
          <span>Repeat</span>
          <span className="w-2 h-2 rounded-full bg-white"></span>
          <span>Schedule</span>
          <span className="w-2 h-2 rounded-full bg-white"></span>
          <span>Create</span>
          <span className="w-2 h-2 rounded-full bg-white"></span>
          <span>Publish</span>
        </div>
      </div>

      {/* Feature Grid: Made for people who make things */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl sm:text-5xl font-black text-[#121028] tracking-tight mb-12">
          Made for people who <br />make things
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Card 1: Purple Brand Brain */}
          <div className="bg-[#5835F5] rounded-[32px] p-8 sm:p-10 text-white shadow-xl flex flex-col justify-between min-h-[340px]">
            <div>
              <span className="bg-white text-[#5835F5] text-xs font-black px-3.5 py-1.5 rounded-full inline-block mb-4 shadow-sm">
                Brand Brain
              </span>
              <h3 className="text-3xl font-black mb-3 leading-tight">
                Captions that sound like you
              </h3>
              <p className="text-sm font-medium opacity-90 max-w-md leading-relaxed mb-6">
                It reads your notes and past posts, then writes for each platform and shows its sources.
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 mb-4">
              <p className="text-xs font-semibold">
                Weekend sale starts Friday. Three new pieces and one very good reason to visit.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-white text-[#121028] text-xs font-bold px-3 py-1 rounded-full">
                About page
              </span>
              <span className="bg-white text-[#121028] text-xs font-bold px-3 py-1 rounded-full">
                March offer
              </span>
            </div>
          </div>

          {/* Card 2: Coral One Composer */}
          <div className="bg-[#ff4b72] rounded-[32px] p-8 sm:p-10 text-white shadow-xl flex flex-col justify-between min-h-[340px]">
            <div>
              <h3 className="text-3xl font-black mb-3 leading-tight">
                One composer, every platform
              </h3>
              <p className="text-sm font-medium opacity-95 max-w-md leading-relaxed mb-6">
                Write once, pick your platforms, set the time.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white text-[#ff4b72] text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                Instagram
              </span>
              <span className="bg-white text-[#ff4b72] text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                LinkedIn
              </span>
              <span className="bg-white text-[#ff4b72] text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                X
              </span>
              <span className="bg-white text-[#ff4b72] text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                Facebook
              </span>
            </div>
          </div>

          {/* Card 3: Yellow Plan a Week */}
          <div className="bg-[#ffd246] rounded-[32px] p-8 sm:p-10 text-[#121028] shadow-xl flex flex-col justify-between min-h-[260px]">
            <div>
              <h3 className="text-3xl font-black mb-2 leading-tight">
                Plan a week in one go
              </h3>
              <p className="text-sm font-semibold opacity-90 max-w-md leading-relaxed mb-6">
                Turn a goal into platform-ready posts you approve.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs ${
                    i % 2 === 0 ? 'bg-[#121028] text-white' : 'border-2 border-[#121028] text-[#121028]'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Dark Navy Insights */}
          <div className="bg-[#121028] rounded-[32px] p-8 sm:p-10 text-white shadow-xl flex flex-col justify-between min-h-[260px]">
            <div>
              <h3 className="text-3xl font-black mb-2 leading-tight">
                Insights that tell you what to do
              </h3>
            </div>

            {/* Decorative colored bars */}
            <div className="flex items-end gap-2 h-14 my-4">
              <div className="w-12 h-6 bg-[#5835F5] rounded-lg"></div>
              <div className="w-12 h-9 bg-[#5835F5] rounded-lg"></div>
              <div className="w-12 h-7 bg-[#5835F5] rounded-lg"></div>
              <div className="w-14 h-14 bg-[#ff4b72] rounded-lg shadow-lg"></div>
              <div className="w-12 h-8 bg-[#5835F5] rounded-lg"></div>
              <div className="w-12 h-10 bg-[#5835F5] rounded-lg"></div>
              <div className="w-12 h-6 bg-[#5835F5] rounded-lg"></div>
            </div>

            <p className="text-xs text-gray-300 font-semibold">
              Thursday evenings are your strongest slot.
            </p>
          </div>
        </div>
      </section>

      {/* Steps: Find your rhythm in three steps */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-4xl sm:text-5xl font-black text-[#121028] tracking-tight mb-14">
          Find your rhythm in three steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#5835F5] text-white flex items-center justify-center font-black text-lg shadow-lg">
              1
            </div>
            <h3 className="text-xl font-black text-[#121028]">Add your brand</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Upload notes, offers and past posts so the AI learns your voice.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#ff4b72] text-white flex items-center justify-center font-black text-lg shadow-lg">
              2
            </div>
            <h3 className="text-xl font-black text-[#121028]">Plan or write</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Write a post yourself or let the planner draft a week from one goal.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#ffd246] text-[#121028] flex items-center justify-center font-black text-lg shadow-lg">
              3
            </div>
            <h3 className="text-xl font-black text-[#121028]">Schedule and relax</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Posts go out on every platform at the time you chose.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Box */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-[#121028] rounded-[36px] p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Top color bars */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-3 bg-[#5835F5] rounded-full"></div>
            <div className="w-10 h-3 bg-[#ff4b72] rounded-full"></div>
            <div className="w-10 h-3 bg-[#ffd246] rounded-full"></div>
            <div className="w-10 h-3 bg-[#5835F5] rounded-full"></div>
            <div className="w-10 h-3 bg-[#ff4b72] rounded-full"></div>
            <div className="w-10 h-3 bg-[#ffd246] rounded-full"></div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-8">
            Ready to find your rhythm?
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
              className="bg-[#ffd246] hover:bg-[#ffc820] text-[#121028] rounded-full px-9 py-4 font-black text-sm transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
            >
              {isAuthenticated ? 'Open Dashboard' : 'Get started'}
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                className="text-white hover:text-[#ffd246] font-bold text-sm px-6 py-3 cursor-pointer underline transition-colors"
              >
                Sign in to your account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-gray-500 font-semibold">
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-0.5 h-4">
            <div className="w-1 h-2.5 bg-[#f59e0b] rounded-full"></div>
            <div className="w-1 h-3.5 bg-[#fbbf24] rounded-full"></div>
            <div className="w-1 h-4 bg-[#f59e0b] rounded-full"></div>
          </div>
          <span className="font-bold text-[#121028]">SocialVibe</span>
        </div>
        <p>Post once. Play everywhere.</p>
      </footer>
    </div>
  );
};

export default Landing;
