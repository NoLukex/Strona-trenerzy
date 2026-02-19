import React, { useState } from 'react';
import { generateSampleWorkout, WorkoutPlan } from '../services/geminiService';
import { Sparkles, Clock, Target, Loader2, PlayCircle, Info } from 'lucide-react';

const AiPlanner: React.FC = () => {
  const [goal, setGoal] = useState<string>('Budowa Masy');
  const [experience, setExperience] = useState<string>('Początkujący');
  const [time, setTime] = useState<string>('45');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setPlan(null);
    const result = await generateSampleWorkout(goal, experience, time);
    setPlan(result);
    setLoading(false);
  };

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="ai-tool" className="py-24 scroll-mt-20 bg-zinc-900 border-y border-zinc-800 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Controls */}
        <div>
          <div className="inline-flex items-center gap-2 text-brand-400 font-bold mb-4 bg-brand-900/20 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
            <Sparkles size={14} />
            <span>AI Powered Technology</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-6">
            Sprawdź Mnie: <br/>
            Generator Treningu AI
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Nie jesteś pewien, jak wygląda moja metodyka? Użyj sztucznej inteligencji, którą zaprogramowałem, aby wygenerowała dla Ciebie <b>darmową próbkę</b> treningu w 5 sekund.
          </p>

          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-zinc-500 text-xs font-bold uppercase mb-2">Twój Cel</label>
                <select 
                  value={goal} 
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg p-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                >
                  <option>Redukcja Tkanki Tłuszczowej</option>
                  <option>Budowa Masy Mięśniowej</option>
                  <option>Poprawa Kondycji</option>
                  <option>Siła Fizyczna</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-500 text-xs font-bold uppercase mb-2">Poziom</label>
                <select 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg p-3 focus:outline-none focus:border-brand-500 transition-all"
                >
                  <option>Początkujący</option>
                  <option>Średniozaawansowany</option>
                  <option>Zaawansowany</option>
                </select>
              </div>
            </div>
            
            <div className="mb-8">
               <label className="block text-zinc-500 text-xs font-bold uppercase mb-2">Dostępny czas (minuty): <span className="text-white">{time}</span></label>
               <input 
                  type="range" 
                  min="15" 
                  max="90" 
                  step="5" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
               />
               <div className="flex justify-between text-xs text-zinc-600 mt-2">
                 <span>15 min</span>
                 <span>90 min</span>
               </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? "Generowanie..." : "Generuj Przykładowy Trening"}
            </button>
          </div>
        </div>

        {/* Right Side: Result */}
        <div className="relative">
          {/* Decorative Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-500/10 rounded-full blur-3xl -z-10"></div>

          {!plan ? (
            <div className="h-96 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-600">
               <Target size={48} className="mb-4 opacity-50" />
               <p>Wybierz parametry i kliknij Generuj</p>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl animate-fade-in">
              <div className="flex justify-between items-start border-b border-zinc-800 pb-4 mb-4">
                <div>
                   <h3 className="text-2xl font-bold text-white">{plan.title}</h3>
                   <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                      <Target size={14} />
                      <span>Focus: {plan.focus}</span>
                      <Clock size={14} className="ml-2" />
                      <span>{time} min</span>
                   </div>
                </div>
                <div className="bg-brand-500/20 p-2 rounded-lg">
                   <Target className="text-brand-500" />
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {plan.exercises.map((ex, idx) => (
                  <div key={idx} className="bg-zinc-900 p-4 rounded-xl flex items-start gap-4">
                    <div className="bg-zinc-800 text-zinc-400 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{ex.name}</h4>
                      <div className="flex gap-4 text-sm text-brand-400 font-mono mt-1">
                        <span>{ex.sets} Serie</span>
                        <span>{ex.reps} Powtórzeń</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2 flex items-start gap-1">
                        <Info size={12} className="mt-0.5 shrink-0" />
                        {ex.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-zinc-900 border border-brand-500/30 p-4 rounded-lg">
                <p className="text-brand-300 text-sm italic text-center">"{plan.motivation}"</p>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-zinc-500 text-xs mb-2">To tylko przykład wygenerowany przez AI.</p>
                <a href="#contact" onClick={handleScrollToContact} className="text-white underline text-sm hover:text-brand-400">Chcę pełny, profesjonalny plan &rarr;</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AiPlanner;