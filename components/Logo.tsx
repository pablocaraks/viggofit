
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* ESPACIO PARA INSERTAR LOGO PERSONALIZADO */}
      <div className="w-24 h-24 mb-2 bg-[#1a1a1a] border-2 border-[#39FF14] rounded-full flex items-center justify-center overflow-hidden neon-border">
        <img 
          src="https://picsum.photos/200?random=1" 
          alt="ViggoFit Logo" 
          className="w-full h-full object-cover opacity-80"
        />
      </div>
      <h1 className="text-4xl font-sporty font-bold text-[#39FF14] neon-text tracking-widest">
        VIGGOFIT
      </h1>
      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">
        Elite Performance Tracking
      </p>
    </div>
  );
};

export default Logo;
