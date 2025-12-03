import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Package, Users, Droplets, Sun, Wind, Plus, AlertTriangle, 
  ShoppingBag, Truck, MapPin, Edit2, Trash2, Clock, X, Search, Filter, 
  LayoutGrid, List, MoreHorizontal, Save, Image as ImageIcon, CheckCircle, ChevronDown, DollarSign
} from 'lucide-react';
import { FarmerProfile, InventoryItem, Order, DeliveryOption } from '../types';
import { getDeliveryQuotes, bookDelivery } from '../services/logisticsService';
import FarmerOnboarding from './FarmerOnboarding';

// --- Sub-components for Tab Views ---

// 1. Overview Tab
const OverviewTab = () => {
  const salesData = [
    { name: 'Lun', sales: 12000 },
    { name: 'Mar', sales: 18000 },
    { name: 'Mer', sales: 15000 },
    { name: 'Jeu', sales: 22000 },
    { name: 'Ven', sales: 30000 },
    { name: 'Sam', sales: 45000 },
    { name: 'Dim', sales: 35000 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Weather Widget */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-lg">Météo Agricole (Niayes)</h3>
            <p className="text-blue-100 text-sm">Aujourd'hui: Ensoleillé</p>
          </div>
          <Sun size={40} className="text-yellow-300 animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg text-sm">
            <Droplets size={16} /> <span>Humidité: 65%</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg text-sm">
            <Wind size={16} /> <span>Vent: 12 km/h NE</span>
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Critical Alerts */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row items-start gap-3">
        <AlertTriangle className="text-orange-500 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h4 className="font-bold text-orange-800 text-sm md:text-base">Stock Critique</h4>
          <p className="text-sm text-orange-700 leading-relaxed">Vos "Oignons violets" sont presque épuisés (5kg restants). Pensez à mettre à jour.</p>
        </div>
        <button className="w-full sm:w-auto mt-2 sm:mt-0 text-sm bg-white text-orange-600 border border-orange-200 px-4 py-2 rounded-lg hover:bg-orange-100 font-medium">
          Gérer
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-wider">Ventes du jour</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">45.000 F</p>
          <p className="text-xs text-green-600 flex items-center mt-2 bg-green-50 w-fit px-2 py-0.5 rounded-full"><TrendingUp size={12} className="mr-1"/> +12%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-wider">Commandes</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">8</p>
          <p className="text-xs text-blue-600 mt-2 bg-blue-50 w-fit px-2 py-0.5 rounded-full">3 en attente</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-wider">Clients</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">124</p>
          <p className="text-xs text-green-600 mt-2 bg-green-50 w-fit px-2 py-0.5 rounded-full">+2 nouveaux</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-wider">Note</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">4.8</p>
          <p className="text-xs text-gray-400 mt-2">Sur 5.0</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-sm md:text-base">Revenus de la semaine</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
              <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 2. Inventory Tab (CRUD COMPLETE)
const InventoryTab = () => {
  // --- STATE ---
  const [products, setProducts] = useState<InventoryItem[]>([
    {
      id: '1', name: 'Oignons de Potou', category: 'Légumes', price: 450, unit: 'kg', stockQuantity: 50,
      minStockThreshold: 20, soldQuantity: 120, farmerName: 'Moussa Diop', location: 'Niayes', coordinates: {lat:0, lng:0},
      image: 'https://picsum.photos/400/300?random=1', available: true, rating: 4.8, freshness: 'recolte_hier', preparationTime: 0
    },
    {
      id: '2', name: 'Tomates Cerises', category: 'Légumes', price: 800, unit: 'kg', stockQuantity: 15,
      minStockThreshold: 10, soldQuantity: 45, farmerName: 'Moussa Diop', location: 'Niayes', coordinates: {lat:0, lng:0},
      image: 'https://picsum.photos/400/300?random=5', available: true, rating: 4.6, freshness: 'recolte_du_jour', preparationTime: 0
    },
    {
      id: '3', name: 'Mangues Kent', category: 'Fruits', price: 1200, unit: 'kg', stockQuantity: 100,
      minStockThreshold: 15, soldQuantity: 200, farmerName: 'Moussa Diop', location: 'Niayes', coordinates: {lat:0, lng:0},
      image: 'https://picsum.photos/400/300?random=2', available: true, rating: 4.9, freshness: 'recolte_du_jour', preparationTime: 0
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState('name'); // name, price, stock
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);

  // Form State
  const initialFormState = {
    name: '', category: 'Légumes', price: '', unit: 'kg', stockQuantity: '', 
    minStockThreshold: '10', freshness: 'recolte_du_jour'
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- COMPUTED ---
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Tous' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'stock') return a.stockQuantity - b.stockQuantity;
        return a.name.localeCompare(b.name);
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const totalValue = useMemo(() => products.reduce((acc, p) => acc + (p.price * p.stockQuantity), 0), [products]);
  const lowStockCount = useMemo(() => products.filter(p => p.stockQuantity <= p.minStockThreshold).length, [products]);

  // --- ACTIONS ---

  const handleOpenModal = (product?: InventoryItem) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        unit: product.unit,
        stockQuantity: product.stockQuantity.toString(),
        minStockThreshold: product.minStockThreshold.toString(),
        freshness: product.freshness as string
      });
    } else {
      setEditingProduct(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: InventoryItem = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      unit: formData.unit,
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      minStockThreshold: parseInt(formData.minStockThreshold) || 10,
      farmerName: 'Moussa Diop', // Default for current user
      location: 'Niayes',
      coordinates: { lat: 0, lng: 0 },
      image: editingProduct?.image || `https://picsum.photos/400/300?random=${Date.now()}`,
      available: true,
      rating: editingProduct?.rating || 0,
      freshness: formData.freshness as any,
      preparationTime: 0,
      soldQuantity: editingProduct?.soldQuantity || 0
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts(prev => [...prev, newProduct]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Supprimer ${selectedItems.length} produits ?`)) {
      setProducts(prev => prev.filter(p => !selectedItems.includes(p.id)));
      setSelectedItems([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn min-h-[600px]">
      {/* 1. Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase">Valeur du Stock</p>
            <p className="text-2xl font-bold text-gray-800">{totalValue.toLocaleString()} F</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <DollarSign size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase">Total Produits</p>
            <p className="text-2xl font-bold text-gray-800">{products.length}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Package size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase">Alertes Stock</p>
            <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {lowStockCount}
            </p>
          </div>
          <div className={`${lowStockCount > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'} p-3 rounded-full`}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* 2. Controls Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-10">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un produit..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-agri-primary cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Tous">Toutes Catégories</option>
              <option value="Légumes">Légumes</option>
              <option value="Fruits">Fruits</option>
              <option value="Céréales">Céréales</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {selectedItems.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors mr-2"
            >
              <Trash2 size={16} /> <span className="hidden sm:inline">Supprimer ({selectedItems.length})</span>
            </button>
          )}

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-agri-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-agri-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={18} />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>

          <button 
            onClick={() => handleOpenModal()}
            className="bg-agri-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-agri-dark text-sm font-bold shadow-sm transition-transform active:scale-95"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Nouveau Produit</span>
          </button>
        </div>
      </div>

      {/* 3. Product List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Aucun produit trouvé</h3>
          <p className="text-gray-500 mb-4">Modifiez vos filtres ou ajoutez un nouveau produit.</p>
          <button onClick={() => handleOpenModal()} className="text-agri-primary font-bold hover:underline">
            Ajouter un produit maintenant
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md group relative ${selectedItems.includes(item.id) ? 'border-agri-primary ring-1 ring-agri-primary' : 'border-gray-100'}`}
            >
              {/* Checkbox Overlay */}
              <div className="absolute top-3 left-3 z-10">
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="w-5 h-5 rounded border-gray-300 text-agri-primary focus:ring-agri-primary cursor-pointer"
                />
              </div>

              {/* Actions Menu (Hover) */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                 <button 
                  onClick={() => handleOpenModal(item)}
                  className="p-2 bg-white text-gray-600 rounded-full shadow-md hover:text-blue-600"
                 >
                   <Edit2 size={14} />
                 </button>
                 <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-white text-gray-600 rounded-full shadow-md hover:text-red-600"
                 >
                   <Trash2 size={14} />
                 </button>
              </div>

              <div className="h-40 w-full bg-gray-100 relative overflow-hidden rounded-t-xl">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {item.stockQuantity <= item.minStockThreshold && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-xs font-bold py-1 px-3 text-center backdrop-blur-sm">
                    Stock Faible ({item.stockQuantity} {item.unit})
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1" title={item.name}>{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <span className="font-bold text-agri-primary bg-green-50 px-2 py-1 rounded text-xs">
                    {item.price} F
                  </span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 mb-1">
                  <div 
                    className={`h-1.5 rounded-full ${item.stockQuantity < item.minStockThreshold ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(100, (item.stockQuantity / 100) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Stock: {item.stockQuantity} {item.unit}</span>
                  <span>Vendus: {item.soldQuantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedItems(filteredProducts.map(p => p.id));
                      else setSelectedItems([]);
                    }}
                    checked={selectedItems.length === filteredProducts.length && filteredProducts.length > 0}
                    className="rounded border-gray-300 text-agri-primary focus:ring-agri-primary"
                  />
                </th>
                <th className="p-4">Produit</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Prix / Unité</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProducts.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 last:border-0">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded border-gray-300 text-agri-primary focus:ring-agri-primary"
                    />
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <img src={item.image} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      {item.stockQuantity <= item.minStockThreshold && (
                        <span className="text-[10px] text-red-500 font-bold flex items-center">
                          <AlertTriangle size={10} className="mr-1" /> Stock bas
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{item.category}</td>
                  <td className="p-4 font-medium">{item.price} F / {item.unit}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <span className={`${item.stockQuantity <= item.minStockThreshold ? 'text-red-600 font-bold' : 'text-gray-800'}`}>
                         {item.stockQuantity}
                       </span>
                       <div className="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                         <div className={`h-full ${item.stockQuantity < item.minStockThreshold ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, item.stockQuantity)}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(item)} className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-scaleUp">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-primary focus:outline-none"
                  placeholder="Ex: Carottes Bio"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-primary"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Légumes">Légumes</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Céréales">Céréales</option>
                    <option value="Tubercules">Tubercules</option>
                    <option value="Élevage">Élevage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fraîcheur</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-primary"
                    value={formData.freshness}
                    onChange={e => setFormData({...formData, freshness: e.target.value})}
                  >
                    <option value="recolte_du_jour">Récolte du jour</option>
                    <option value="recolte_hier">Récolte d'hier</option>
                    <option value="stock">Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-primary focus:outline-none"
                    placeholder="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-primary"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                  >
                    <option value="kg">Kilogramme (kg)</option>
                    <option value="sac">Sac</option>
                    <option value="tonne">Tonne</option>
                    <option value="piece">Pièce</option>
                    <option value="litre">Litre</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité en Stock</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-primary focus:outline-none"
                      value={formData.stockQuantity}
                      onChange={e => setFormData({...formData, stockQuantity: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seuil Alerte</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        required
                        min="0"
                        className="w-full p-3 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-primary focus:outline-none"
                        value={formData.minStockThreshold}
                        onChange={e => setFormData({...formData, minStockThreshold: e.target.value})}
                      />
                      <AlertTriangle className="absolute left-3 top-3.5 text-gray-400" size={16} />
                    </div>
                 </div>
              </div>

              {/* Image Placeholder */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                 <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
                 <p className="text-sm text-gray-500 font-medium">Cliquez pour ajouter une photo</p>
                 <p className="text-xs text-gray-400">(Simulation: Une image aléatoire sera utilisée)</p>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-gray-700 font-bold bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 text-white font-bold bg-agri-primary rounded-lg hover:bg-agri-dark transition-colors flex justify-center items-center gap-2"
                >
                  <Save size={18} /> {editingProduct ? 'Enregistrer' : 'Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Orders Tab
const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'CMD-8492', customerName: 'Fatou Ndiaye', items: [{id:'1', name:'Oignons', quantity:5, price:450} as any],
      total: 2250, status: 'pending', deliveryAddress: 'Pikine Tally Bou Bess', estimatedTime: new Date(), date: new Date()
    },
    {
      id: 'CMD-8493', customerName: 'Restaurant Le Lagon', items: [{id:'2', name:'Tomates', quantity:10, price:800} as any],
      total: 8000, status: 'preparing', deliveryAddress: 'Plateau', estimatedTime: new Date(), date: new Date()
    }
  ]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [quotes, setQuotes] = useState<DeliveryOption[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  const handleShipOrder = async (order: Order) => {
    setSelectedOrder(order);
    setLoadingQuotes(true);
    // Mock locations
    const quotes = await getDeliveryQuotes({lat:0, lng:0}, {lat:0, lng:0}, 5);
    setQuotes(quotes);
    setLoadingQuotes(false);
  };

  const confirmShipment = async (quoteId: string) => {
    if (!selectedOrder) return;
    await bookDelivery(quoteId, selectedOrder.id);
    
    // Update local state
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? {...o, status: 'delivering'} : o));
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-800">Commandes ({orders.length})</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-bold text-lg">{order.id}</span>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'delivering' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {order.status === 'pending' ? 'EN ATTENTE' : 
                     order.status === 'preparing' ? 'PRÉPARATION' : 
                     order.status === 'delivering' ? 'EN LIVRAISON' : 'LIVRÉ'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Users size={14} /> {order.customerName}
                </p>
              </div>
              <div className="text-left sm:text-right bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                <p className="font-bold text-xl text-agri-primary">{order.total} F</p>
                <p className="text-xs text-gray-400">Cash à la livraison</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                  <span className="text-gray-700 font-medium">{item.quantity}x {item.name}</span>
                  <span className="text-gray-500">{item.price * item.quantity} F</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {order.status === 'pending' && (
                <button 
                  onClick={() => setOrders(prev => prev.map(o => o.id === order.id ? {...o, status: 'preparing'} : o))}
                  className="w-full sm:flex-1 bg-agri-primary text-white py-3 rounded-xl font-medium hover:bg-agri-dark transition-colors shadow-sm"
                >
                  Accepter la commande
                </button>
              )}
              {order.status === 'preparing' && (
                <button 
                  onClick={() => handleShipOrder(order)}
                  className="w-full sm:flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 flex justify-center items-center gap-2 shadow-sm transition-colors"
                >
                  <Truck size={18} /> Expédier (Logistique)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Logistics Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 animate-slideUp sm:animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg">Choisir un transporteur</h3>
               <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                 <X size={20} />
               </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
               <p className="text-xs font-bold text-blue-800 uppercase mb-1">Destination</p>
               <p className="text-sm text-blue-900 flex items-center">
                 <MapPin size={14} className="mr-1" /> {selectedOrder.deliveryAddress}
               </p>
            </div>
            
            {loadingQuotes ? (
              <div className="text-center py-12">
                <div className="animate-spin w-10 h-10 border-4 border-agri-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Recherche de livreurs à proximité...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <button
                    key={quote.id}
                    onClick={() => confirmShipment(quote.id)}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-agri-primary hover:bg-green-50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          quote.provider === 'Tiak-Tiak' ? 'bg-yellow-100 text-yellow-700' : 
                          quote.provider === 'Cooperative' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                         <Truck size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 group-hover:text-agri-dark">{quote.provider}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" /> ~{quote.estimatedTime} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-agri-primary text-lg">{quote.price} F</p>
                      <p className="text-[10px] text-gray-400">Garantie incluse</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full py-4 text-gray-500 font-medium hover:bg-gray-50 rounded-xl"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const FarmerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders'>('overview');
  const [profile, setProfile] = useState<FarmerProfile | null>(null);

  if (!profile) {
    return <FarmerOnboarding onComplete={setProfile} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 flex-col z-40">
        <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-agri-light rounded-full flex items-center justify-center text-agri-primary font-bold text-xl border border-agri-primary/20">
                 {profile.fullName.charAt(0)}
               </div>
               <div>
                  <h2 className="font-bold text-gray-900 leading-tight">{profile.farmName}</h2>
                  <p className="text-xs text-green-600 flex items-center mt-0.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span> En ligne</p>
               </div>
            </div>
            
            <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'overview' ? 'bg-agri-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:pl-5'}`}
                >
                  <TrendingUp size={20} /> Vue d'ensemble
                </button>
                <button 
                  onClick={() => setActiveTab('inventory')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'inventory' ? 'bg-agri-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:pl-5'}`}
                >
                  <Package size={20} /> Mon Stock
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'orders' ? 'bg-agri-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:pl-5'}`}
                >
                  <ShoppingBag size={20} /> Commandes
                </button>
            </div>
        </div>
        
        <div className="mt-auto p-6 border-t border-gray-100">
           <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
              <p className="font-bold mb-1">Support Pro</p>
              <p className="text-xs opacity-80 mb-2">Besoin d'aide pour vos ventes ?</p>
              <button className="text-xs font-bold underline">Contacter l'expert</button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:ml-64 transition-all duration-300">
         {/* Mobile Header (Sticky) */}
         <div className="bg-white px-4 py-4 shadow-sm flex md:hidden justify-between items-center sticky top-16 z-30 border-b border-gray-100">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-agri-light rounded-full flex items-center justify-center text-agri-primary font-bold text-sm">
                 {profile.fullName.charAt(0)}
               </div>
               <div>
                  <h1 className="font-bold text-sm text-gray-800">{profile.farmName}</h1>
                  <p className="text-[10px] text-gray-500 flex items-center">
                    <MapPin size={10} className="mr-0.5" /> {profile.address}
                  </p>
               </div>
            </div>
            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">
               VERIFIÉ
            </div>
         </div>

         {/* Desktop Header Info (Non-sticky) */}
         <div className="hidden md:flex px-8 py-6 justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
                <p className="text-gray-500 mt-1">Gérez votre activité en temps réel</p>
             </div>
             <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-sm text-gray-500">Localisation</p>
                    <p className="font-bold text-gray-800 flex items-center justify-end"><MapPin size={16} className="mr-1 text-agri-primary"/> {profile.address}</p>
                 </div>
             </div>
         </div>

         <div className="p-4 md:p-8 max-w-6xl">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'inventory' && <InventoryTab />}
            {activeTab === 'orders' && <OrdersTab />}
         </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'overview' ? 'text-agri-primary bg-agri-light' : 'text-gray-400'}`}
        >
          <TrendingUp size={20} />
          <span className="text-[10px] mt-1 font-medium">Accueil</span>
        </button>
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'inventory' ? 'text-agri-primary bg-agri-light' : 'text-gray-400'}`}
        >
          <Package size={20} />
          <span className="text-[10px] mt-1 font-medium">Stock</span>
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'orders' ? 'text-agri-primary bg-agri-light' : 'text-gray-400'}`}
        >
          <ShoppingBag size={20} />
          <span className="text-[10px] mt-1 font-medium">Commandes</span>
        </button>
      </div>
    </div>
  );
};

export default FarmerDashboard;