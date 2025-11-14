import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://real-estate-api-tr3v.onrender.com/api';

export default function AdminDashboard() {
  const [plots, setPlots] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', size: '', price: '', status: 'available', images: null
  });

  const fetchPlots = async () => {
    const res = await axios.get(`${API_URL}/plots`);
    setPlots(res.data);
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('size', form.size);
    formData.append('price', form.price);
    formData.append('status', form.status);
    if (form.description) formData.append('description', form.description);
    if (form.images) {
      for (let i = 0; i < form.images.length; i++) {
        formData.append('images', form.images[i]);
      }
    }

    await axios.post(`${API_URL}/plots`, formData);
    setForm({ title: '', description: '', size: '', price: '', status: 'available', images: null });
    fetchPlots();
  };

  const deletePlot = async (id) => {
    if (window.confirm('Delete this plot?')) {
      await axios.delete(`${API_URL}/plots/${id}`);
      fetchPlots();
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div className="card">
        <h2>Add New Plot</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
          />
          <input
            type="number"
            placeholder="Size (sq ft) *"
            value={form.size}
            onChange={(e) => setForm({...form, size: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Price *"
            value={form.price}
            onChange={(e) => setForm({...form, price: e.target.value})}
            required
          />
          <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
          <input
            type="file"
            multiple
            onChange={(e) => setForm({...form, images: e.target.files})}
          />
          <button type="submit" className="btn btn-primary">Add Plot</button>
        </form>
      </div>

      <h2>All Plots</h2>
      <div className="grid">
        {plots.map(plot => (
          <div key={plot.id} className="plot-card">
            {plot.images && plot.images[0] ? (
              <img src={`https://real-estate-api-tr3v.onrender.com${plot.images[0]}`} alt="" className="plot-img" />
            ) : (
              <div style={{height: '200px', background: '#eee'}}>No Image</div>
            )}
            <div className="plot-info">
              <h3>{plot.title}</h3>
              <p>₹{parseFloat(plot.price).toLocaleString()}</p>
              <button onClick={() => deletePlot(plot.id)} className="btn btn-danger" style={{marginTop: '10px'}}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
