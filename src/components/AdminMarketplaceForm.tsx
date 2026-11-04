import React, { useState } from 'react';
import { ProductItem, CATEGORIES } from '../types/market';
import { X } from 'lucide-react';

interface AdminMarketplaceFormProps {
  onAddProduct: (product: ProductItem) => void;
  onClose: () => void;
}

export const AdminMarketplaceForm: React.FC<AdminMarketplaceFormProps> = ({ onAddProduct, onClose }) => {
  const [formData, setFormData] = useState({
    title: '', price: '', imageUrl: '', category: CATEGORIES[0].id, source: 'own' as const, productUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      id: `prod_${Date.now()}`,
      title: formData.title,
      price: Number(formData.price),
      photoUrl: formData.imageUrl,
      category: formData.category,
      source: formData.source,
      productUrl: formData.productUrl,
      city: 'Admin',
      whatsapp: '',
      description: '',
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Add Product</h2>
          <button type="button" onClick={onClose}><X /></button>
        </div>
        <input className="w-full border p-2" placeholder="Title" onChange={(e) => setFormData({...formData, title: e.target.value})} />
        <input className="w-full border p-2" placeholder="Price" type="number" onChange={(e) => setFormData({...formData, price: e.target.value})} />
        <input className="w-full border p-2" placeholder="Image URL" onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
        <select className="w-full border p-2" onChange={(e) => setFormData({...formData, category: e.target.value})}>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.nameEnglish}</option>)}
        </select>
        <select className="w-full border p-2" onChange={(e) => setFormData({...formData, source: e.target.value as any})}>
          <option value="own">Own</option>
          <option value="amazon">Amazon</option>
          <option value="daraz">Daraz</option>
          <option value="alibaba">Alibaba</option>
          <option value="markaz">Markaz</option>
        </select>
        <input className="w-full border p-2" placeholder="Product URL" onChange={(e) => setFormData({...formData, productUrl: e.target.value})} />
        <button type="submit" className="w-full bg-[#0f5132] text-white p-2 rounded">Save</button>
      </form>
    </div>
  );
};
