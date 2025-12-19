import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useTransaction } from '../context/TransactionContext';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function EnergyMap() {
  const { transactions, buckets } = useTransaction();

  // Categories: 'survival', 'evolution', 'leisure'
  const scores = { 'survival': 0, 'evolution': 0, 'leisure': 0 };

  transactions.forEach(tx => {
    if (tx.type !== 'EXPENSE') return;
    
    // Find bucket info
    const bucket = buckets.find(b => b.id === tx.bucketId);
    if (bucket && bucket.type) {
        if(scores[bucket.type] !== undefined) {
             scores[bucket.type] += tx.amount;
        }
    } else {
        // Default Logic if Upgrade has not hit old buckets
         scores['survival'] += tx.amount;
    }
  });

  // Normalize for chart (relative balance)
  const total = scores['survival'] + scores['evolution'] + scores['leisure'] || 1;
  
  const percentageData = [
    (scores['survival'] / total) * 100,
    (scores['evolution'] / total) * 100,
    (scores['leisure'] / total) * 100,
  ];

  const data = {
    labels: ['Sobrevivência', 'Evolução', 'Lazer'],
    datasets: [
      {
        label: 'Distribuição (%)',
        data: percentageData,
        backgroundColor: 'rgba(0, 229, 255, 0.2)',
        borderColor: '#00E5FF',
        borderWidth: 2,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#00E5FF',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#cccc', font: { size: 12, weight: 'bold' } },
        ticks: { display: false, backdropColor: 'transparent' },
        suggestedMin: 0,
        suggestedMax: 60, 
      },
    },
    plugins: {
      legend: { display: false },
    }
  };

  // AI Suggestion Logic
  let suggestion = "Seu equilíbrio de vida está interessante.";
  if (percentageData[2] < 15) { 
      suggestion = "💡 Cuidado com o Burnout! Tente investir mais em Lazer/Experiências.";
  } else if (percentageData[1] < 10) { 
      suggestion = "💡 Que tal focar em Evolução? Cursos e investimentos ajudam no futuro.";
  } else if (percentageData[0] > 70) { 
      suggestion = "💡 Modo Sobrevivência Alto. Tente reduzir custos fixos se possível.";
  }

  return (
    <div className="glass-panel" style={{ marginTop: '1rem', width: '100%' }}>
      <h3 className="title" style={{ fontSize: '1rem' }}>Mapa de Energia (Nova Era)</h3>
      
      <div style={{ height: '280px', display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <Radar data={data} options={options} />
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '8px', 
        padding: '0.8rem', 
        fontSize: '0.9rem', 
        color: '#ccc',
        borderLeft: '4px solid #00E5FF'
      }}>
        {suggestion}
      </div>
    </div>
  );
}