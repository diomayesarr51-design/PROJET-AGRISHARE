import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, Wallet, ArrowRight } from 'lucide-react';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps & { color: string }> = ({ title, value, icon, trend, trendUp, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      {trend && (
        <p className={`text-xs font-medium mt-2 flex items-center ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trendUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingUp size={14} className="mr-1 transform rotate-180" />}
          {trend}
        </p>
      )}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
  </div>
);

const InvestorDashboard: React.FC = () => {
  const portfolioData = [
    { name: 'Maraîchage (Niayes)', value: 45, color: '#10b981' },
    { name: 'Riziculture (Vallée)', value: 30, color: '#f59e0b' },
    { name: 'Anacarde (Sud)', value: 15, color: '#8b5cf6' },
    { name: 'Aviculture', value: 10, color: '#3b82f6' },
  ];

  const opportunities = [
    {
      id: 1,
      title: "Extension Ferme Solaire",
      location: "Thiès",
      roi: "18%",
      duration: "12 mois",
      amount: "5.000.000 FCFA",
      risk: "Faible"
    },
    {
      id: 2,
      title: "Coopérative Mangue Bio",
      location: "Ziguinchor",
      roi: "24%",
      duration: "24 mois",
      amount: "12.000.000 FCFA",
      risk: "Moyen"
    },
    {
      id: 3,
      title: "Transformation Arachide",
      location: "Kaolack",
      roi: "15%",
      duration: "6 mois",
      amount: "2.500.000 FCFA",
      risk: "Faible"
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Portefeuille Investisseur</h2>
          <p className="text-sm text-gray-500">Suivi de vos investissements agricoles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Investissement Total" 
          value="15.5M CFA" 
          icon={<Wallet className="text-white" size={24} />} 
          trend="+2.5M ce mois" 
          trendUp={true} 
          color="bg-agri-dark" 
        />
        <StatCard 
          title="ROI Moyen" 
          value="16.4%" 
          icon={<TrendingUp className="text-white" size={24} />} 
          trend="+1.2% vs marché" 
          trendUp={true} 
          color="bg-agri-primary" 
        />
        <StatCard 
          title="Projets Actifs" 
          value="7" 
          icon={<PieChartIcon className="text-white" size={24} />} 
          color="bg-agri-secondary" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Opportunités Recommandées (IA)</h3>
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div key={opp.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-bold text-gray-800">{opp.title}</h4>
                  <p className="text-sm text-gray-500">{opp.location} • {opp.duration}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                   <div>
                      <p className="text-agri-primary font-bold">{opp.roi} ROI</p>
                      <p className="text-xs text-gray-500">{opp.amount}</p>
                   </div>
                   <button className="p-2 bg-agri-light text-agri-primary rounded-full hover:bg-agri-primary hover:text-white transition-colors">
                     <ArrowRight size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Répartition</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;