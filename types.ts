import React from 'react';

export enum UserType {
  GUEST = 'guest',
  FARMER = 'farmer',
  CONSUMER = 'consumer',
  INVESTOR = 'investor'
}

export interface AuthUser {
  id: string;
  phone: string;
  fullName: string;
  type: UserType;
  farmName?: string; // Spécifique farmer
  token: string;
  refreshToken: string;
  profileData?: any; // Données spécifiques au rôle
}

export interface ConsumerProfile {
  deliveryAddress: string;
  preferences: string[];
}

export interface InvestorProfile {
  companyName?: string;
  budgetRange: string;
  sectors: string[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  farmerName: string;
  location: string;
  coordinates: Coordinates;
  image: string;
  available: boolean;
  rating: number;
  freshness: 'recolte_du_jour' | 'recolte_hier' | 'stock';
  preparationTime: number;
}

// Gestion Avancée Agriculteur
export interface FarmerProfile {
  id: string;
  farmName: string;
  fullName: string;
  phone: string;
  location: Coordinates;
  address: string;
  farmSize: number; // hectares
  certifications: string[]; // 'Bio', 'Local', etc.
  isVerified: boolean;
  joinedDate: Date;
}

export interface InventoryItem extends Product {
  stockQuantity: number;
  minStockThreshold: number;
  harvestDate?: Date;
  soldQuantity: number;
}

export interface DeliveryOption {
  id: string;
  provider: 'Tiak-Tiak' | 'Moto-Local' | 'Cooperative' | 'Auto';
  price: number;
  estimatedTime: number; // minutes
  rating: number;
}

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Region {
  DAKAR = 'Dakar',
  THIES = 'Thiès',
  SAINT_LOUIS = 'Saint-Louis',
  KAOLACK = 'Kaolack',
  ZIGUINCHOR = 'Ziguinchor',
  DIOURBEL = 'Diourbel',
  TAMBACOUNDA = 'Tambacounda',
  LOUGA = 'Louga'
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered';
  deliveryAddress: string;
  deliveryOption?: DeliveryOption;
  estimatedTime: Date;
  date: Date;
}