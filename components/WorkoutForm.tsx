
import React, { useState } from 'react';
import { MuscleGroup, WorkoutEntry } from '../types';
import { storageService } from '../services/storageService';

interface WorkoutFormProps {
  userId: string;
  onSuccess: () => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    bodyWeight: '',
    muscleGroup: MuscleGroup.Pecho,
    exercise: '',
    weightLifted: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bodyWeight || !formData.exercise || !formData.weightLifted) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newEntry: WorkoutEntry = {
      id: crypto.randomUUID(),
      userId,
      date: formData.date,
      bodyWeight: parseFloat(formData.bodyWeight),
      muscleGroup: formData.muscleGroup,
      exercise: formData.exercise,
      weightLifted: parseFloat(formData.weightLifted),
      timestamp: new Date(formData.date).getTime()
    };

    storageService.saveWorkout(newEntry);
    setFormData({
      ...formData,
      exercise: '',
      weightLifted: ''
    });
    onSuccess();
    alert('Entrenamiento guardado con éxito');
  };

  return (
    <div className="bg-[#111111] p-6 rounded-2xl border border-gray-800 shadow-xl">
      <h3 className="text-[#39FF14] font-sporty text-xl mb-4 border-b border-gray-800 pb-2">
        NUEVO REGISTRO
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">FECHA</label>
            <input 
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-[#39FF14]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">PESO CORPORAL (KG)</label>
            <input 
              type="number"
              step="0.1"
              placeholder="0.0"
              value={formData.bodyWeight}
              onChange={(e) => setFormData({...formData, bodyWeight: e.target.value})}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-[#39FF14]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">GRUPO MUSCULAR</label>
          <select 
            value={formData.muscleGroup}
            onChange={(e) => setFormData({...formData, muscleGroup: e.target.value as MuscleGroup})}
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-[#39FF14]"
          >
            {Object.values(MuscleGroup).map(mg => (
              <option key={mg} value={mg}>{mg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">EJERCICIO</label>
          <input 
            type="text"
            placeholder="Ej: Press de Banca"
            value={formData.exercise}
            onChange={(e) => setFormData({...formData, exercise: e.target.value})}
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-[#39FF14]"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">PESO LEVANTADO (KG)</label>
          <input 
            type="number"
            step="0.5"
            placeholder="0.0"
            value={formData.weightLifted}
            onChange={(e) => setFormData({...formData, weightLifted: e.target.value})}
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-[#39FF14]"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-lg hover:bg-[#32e012] transition-colors mt-4 font-sporty tracking-wider"
        >
          REGISTRAR SERIE
        </button>
      </form>
    </div>
  );
};

export default WorkoutForm;
