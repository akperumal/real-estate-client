import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://real-estate-api-tr3v.onrender.com/api';

export default function PlotList() {
  const [plots, setPlots] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', minPrice: '', maxPrice: '' });

  const fetchPlots = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const res = await axios.get(`${API_URL}/plots?${params}`);
      setPlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, [filters]);

  return (
    <div>
      <h1>Available Plots</h1>

      <div className="card" style={{marginBottom: '20px'}}>
        <input
          type="text"
          placeholder="Search by title or description..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          style={{width: '100%', marginBottom: '10px'}}
        />
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
          />
        </div>
      </div>

      <div className="grid">
        {plots.map(plot => (
          <div key={plot.id} className="plot-card">
            {plot.images && plot.images[0] ? (
              <img src={`https://real-estate-api-tr3v.onrender.com${plot.images[0]}`} alt={plot.title} className="plot-img" />
            ) : (
              <div style={{height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                No Image
              </div>
            )}
            <div className="plot-info">
              <h3>{plot.title}</h3>
              <p><strong>Size:</strong> {plot.size} sq ft</p>
              <p><strong>Price:</strong> ₹{parseFloat(plot.price).toLocaleString()}</p>
              <span className={`status ${plot.status}`}>{plot.status.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
