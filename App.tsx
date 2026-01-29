
import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import WorkoutForm from './components/WorkoutForm';
import Dashboard from './components/Dashboard';
import { storageService } from './services/storageService';
import { WorkoutEntry } from './types';

function App() {
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('viggofit_user_id'));
  const [inputId, setInputId] = useState('');
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);

  // Load entries whenever user changes or data updates
  const loadData = () => {
    if (userId) {
      const userData = storageService.getEntriesByUserId(userId);
      setEntries(userData);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId.trim().length < 5) {
      alert('Ingresa una Cédula/ID válida (mínimo 5 caracteres)');
      return;
    }
    setUserId(inputId);
    localStorage.setItem('viggofit_user_id', inputId);
  };

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('viggofit_user_id');
    setEntries([]);
  };

  const downloadCSV = () => {
    if (!userId) return;
    const csv = storageService.exportToCSV(userId);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ViggoFit_Progreso_${userId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
        <Logo />
        <div className="w-full max-w-md bg-[#111111] p-8 rounded-2xl border border-[#39FF14]/30 shadow-2xl">
          <h2 className="text-xl text-center mb-6 font-sporty text-white">ACCESO ATLETA</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">Cédula o Identificación</label>
              <input 
                type="text"
                placeholder="Ej: 12345678"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                className="w-full bg-[#1a1a1a] border-2 border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-[#39FF14] transition-all"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#39FF14] text-black font-bold py-4 rounded-xl hover:bg-[#32e012] transition-colors font-sporty shadow-[0_0_20px_rgba(57,255,20,0.2)]"
            >
              ENTRAR AL BOX
            </button>
          </form>
          <p className="text-[10px] text-gray-600 mt-6 text-center italic">
            * Tus datos son privados y solo accesibles con tu ID.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-24 lg:pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <header className="flex justify-between items-center py-4 sticky top-0 bg-black/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#39FF14] rounded-md flex items-center justify-center font-bold text-black text-xs font-sporty">VF</div>
            <span className="font-sporty text-[#39FF14] tracking-tighter text-xl">VIGGOFIT</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-400 text-xs hover:text-red-500 font-bold transition-colors border border-gray-800 px-3 py-1 rounded-full"
          >
            SALIR (ID: {userId})
          </button>
        </header>

        <Logo />

        <main className="space-y-8 mt-4">
          <WorkoutForm userId={userId} onSuccess={loadData} />
          
          <div className="flex justify-between items-end px-2">
            <h2 className="text-2xl font-sporty text-white tracking-tight">TU PROGRESO</h2>
            <button 
              onClick={downloadCSV}
              className="text-[10px] font-bold text-[#39FF14] border border-[#39FF14]/30 px-2 py-1 rounded hover:bg-[#39FF14]/10"
            >
              EXPORTAR CSV
            </button>
          </div>

          <Dashboard entries={entries} />
        </main>

        <footer className="mt-12 text-center pb-8">
          <p className="text-gray-700 text-[10px] uppercase font-bold tracking-widest">
            Powered by ViggoFit Intelligence © 2024
          </p>
        </footer>
      </div>

      {/* Floating Call to Action for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button 
          onClick={() => window.scrollTo({top: 200, behavior: 'smooth'})}
          className="w-14 h-14 bg-[#39FF14] text-black rounded-full flex items-center justify-center shadow-lg neon-border"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
      </div>
    </div>
  );
}

export default App;
