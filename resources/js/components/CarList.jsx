import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [colors, setColors] = useState([]);
  const [form, setForm] = useState({ brand: '', model: '', color: '', year: '' });
  const [editingCar, setEditingCar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchCars(page);
    fetchColors();
  }, [page]);

  const fetchCars = async (pageNum = 1) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/cars?page=${pageNum}`);
      setCars(response.data.data);
      setPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/colors');
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
    const payload = {
      ...form,
      color_id: parseInt(form.color),
    };
    delete payload.color;

    if (editingCar) {
      await axios.put(`http://localhost:8000/api/cars/${editingCar.id}`, payload);
    } else {
      await axios.post('http://localhost:8000/api/cars', payload);
    }

    fetchCars(page);
    setForm({ brand: '', model: '', color: '', year: '' });
    setEditingCar(null);
    setShowModal(false);
  } catch (error) {
    if (error.response?.status === 422) {
      const messages = Object.entries(error.response.data.errors)
        .map(([key, val]) => `${key}: ${val.join(', ')}`)
        .join('\n');
      alert(`Validation failed:\n${messages}`);
    } else {
      alert('An unexpected error occurred');
    }
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
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add Car
      </button>

      <table className="min-w-full border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 border-b border-gray-300 text-left">Brand</th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">Model</th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">Color</th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">Year</th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr
              key={car.id}
              className="hover:bg-gray-50 odd:bg-white even:bg-gray-50 border-t border-gray-200 transition"
            >
              <td className="px-4 py-3 border-b border-gray-200">{car.brand}</td>
              <td className="px-4 py-3 border-b border-gray-200">{car.model}</td>
              <td className="px-4 py-3 border-b border-gray-200">{car.color?.name}</td>
              <td className="px-4 py-3 border-b border-gray-200">{car.year}</td>
              <td className="px-4 py-3 border-b border-gray-200">
                <button
                  onClick={() => openEditModal(car)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: lastPage }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
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
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
        </div>
      )}
    </div>
  );
}
