import { useInventory } from '../../context/InventoryContext';
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';

export default function BusinessDashboard() {
  const { items } = useInventory();

  const soldItems = items.filter(i => i.status === 'sold');
  const stockItems = items.filter(i => i.status !== 'sold');
  
  const totalInvested = stockItems.reduce((acc, i) => acc + (Number(i.buyPrice) || 0), 0);
  const totalProfit = soldItems.reduce((acc, i) => acc + ((Number(i.soldPrice) || 0) - (Number(i.buyPrice) || 0)), 0);
  
  // Calculate ROI
  const totalCostSold = soldItems.reduce((acc, i) => acc + (Number(i.buyPrice) || 0), 0);
  const roi = totalCostSold > 0 ? ((totalProfit / totalCostSold) * 100).toFixed(1) : 0;

  const StatCard = ({ icon: Icon, label, value, color }) => (
      <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--glass-border)' }}>
          <div style={{ background: color + '20', padding: '10px', borderRadius: '50%', color: color }}>
              <Icon size={24} />
          </div>
          <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{value}</div>
          </div>
      </div>
  );

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '80px' }}>
        <h2 className="title" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Resumo do Negócio</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <StatCard icon={TrendingUp} label="Lucro Líquido" value={totalProfit.toFixed(2) + ' €'} color="#00FF94" />
            <StatCard icon={Package} label="Em Estoque" value={stockItems.length} color="#00E5FF" />
            <StatCard icon={DollarSign} label="Valor em Estoque" value={totalInvested.toFixed(2) + ' €'} color="#FF9F40" />
            <StatCard icon={Users} label="ROI Médio" value={roi + '%'} color="#BF5AF2" />
        </div>

        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '2rem' }}>Últimas Vendas</h3>
        <div>
            {soldItems.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Nenhuma venda ainda.</p>
            ) : (
                soldItems.slice(0, 5).map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{item.brand} {item.model}</div>
                            <div style={{ fontSize: '0.8rem', color: '#00FF94' }}>Lucro: +{(item.soldPrice - item.buyPrice).toFixed(2)}€</div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>{item.soldPrice}€</div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
}
