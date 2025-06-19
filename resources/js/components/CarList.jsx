import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [colors, setColors] = useState([]);
  const [form, setForm] = useState({ brand: '', model: '', color_id: '', year: '' });
  const [editingCar, setEditingCar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filters, setFilters] = useState({ brands: [], models: [], colors: [], years: [] });
  const [selectedFilter, setSelectedFilter] = useState({ brand: '', model: '', color: '', year: '' });

  const fetchFilters = async () => {
    try {
        const res = await axios.get('/api/cars/filters');
        setFilters(res.data);
    } catch (err) {
        console.error('Error loading filters', err);
    }
};
    useEffect(() => {
      axios.get('/sanctum/csrf-cookie').then(() => {
        fetchFilters();
        fetchColors();
        fetchCars();
      });
    }, []);

    useEffect(() => {
      fetchCars(page);
    }, [page]);

    useEffect(() => {
      fetchCars();
    }, [selectedFilter]);

  const fetchCars = async (pageNum = 1) => {
      try {
          const params = {
              page: pageNum,
              ...selectedFilter,
          };
          const res = await axios.get('/api/cars', { params });
          setCars(res.data.data);
          setPage(res.data.current_page);
          setLastPage(res.data.last_page);
      } catch (error) {
          console.error('Error fetching cars:', error);
      }
  };

  useEffect(() => {
    fetchCars();
}, [selectedFilter]);


  const fetchColors = async () => {
    try {
      const response = await axios.get('/api/colors');
      setColors(response.data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingCar) {
        await axios.put(`/api/cars/${editingCar.id}`, form);
      } else {
        await axios.post('/api/cars', form);
      }
      fetchCars(page);
      setForm({ brand: '', model: '', color: '', year: '' });
      setEditingCar(null);
      setShowModal(false);
    } catch (error) {
      alert('An unexpected error occurred');
      console.error(error);
    }
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setForm({
      brand: car.brand,
      model: car.model,
      color: car.color?.id || '',
      year: car.year,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this car?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/api/cars/${id}`);
      fetchCars(page);
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Car List</h1>

      <button
        onClick={() => setShowModal(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <FaPlus /> Add Car
      </button>

    <div className="overflow-x-auto">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <select onChange={e => setSelectedFilter({ ...selectedFilter, brand: e.target.value })} className="border p-2 rounded">
              <option value="">All Brands</option>
              {filters.brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select onChange={e => setSelectedFilter({ ...selectedFilter, model: e.target.value })} className="border p-2 rounded">
              <option value="">All Models</option>
              {filters.models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <select onChange={e => setSelectedFilter({ ...selectedFilter, color: e.target.value })} className="border p-2 rounded">
              <option value="">All Colors</option>
              {filters.colors.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>

          <select onChange={e => setSelectedFilter({ ...selectedFilter, year: e.target.value })} className="border p-2 rounded">
              <option value="">All Years</option>
              {filters.years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
      </div>


      <table className="min-w-full border border-gray-300 divide-y divide-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-r">Brand</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-r">Model</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-r">Color</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-r">Year</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {cars.map((car) => (
            <tr key={car.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-800 border-r">{car.brand}</td>
              <td className="px-6 py-4 text-sm text-gray-800 border-r">{car.model}</td>
              <td className="px-6 py-4 text-sm text-gray-800 border-r">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                    ${
                      {
                        red: 'bg-red-100 text-red-800',
                        blue: 'bg-blue-100 text-blue-800',
                        black: 'bg-black text-white',
                        white: 'bg-gray-200 text-gray-800',
                      }[car.color?.name?.toLowerCase()] || 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {car.color?.name}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-800 border-r">{car.year}</td>
              <td className="px-6 py-4 text-sm text-gray-800 space-x-2">
                <button
                  onClick={() => openEditModal(car)}
                  className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>


      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: lastPage }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">
                {editingCar ? 'Edit Car' : 'Add Car'}
              </h2>
              <div className="grid gap-4">
                <input
                  type="text"
                  name="brand"
                  placeholder="Brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="model"
                  placeholder="Model"
                  value={form.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <select
                  name="color_id"
                  value={form.color_id}
                  onChange={handleChange}
                  className="..."
                >
                  <option value="">Select Color</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>{color.name}</option>
                  ))}
                </select>

                <input
                  type="number"
                  name="year"
                  placeholder="Year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editingCar ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
