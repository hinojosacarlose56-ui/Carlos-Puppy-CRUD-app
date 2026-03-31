import axios from 'axios';
import { useState, useEffect } from 'react';
import '../styles/body.css';

const Body = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
  
  const [puppies, setPuppies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', breed: '', age: '' });

  // Fetch all puppies on component mount
  useEffect(() => {
    fetchPuppies();
  }, []);

  const fetchPuppies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/puppies`);
      setPuppies(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching puppies:', err);
      setError('Failed to load puppies');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || '' : value
    }));
  };

  const handleAddClick = () => {
    setFormData({ name: '', breed: '', age: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (puppy) => {
    setFormData({
      name: puppy.name,
      breed: puppy.breed,
      age: puppy.age
    });
    setEditingId(puppy.user_id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.breed || !formData.age) {
      alert('Please fill out all fields');
      return;
    }

    try {
      if (editingId) {
        // Update existing puppy
        await axios.put(`${API_URL}/puppies/${editingId}`, formData);
      } else {
        // Add new puppy
        await axios.post(`${API_URL}/puppies`, formData);
      }
      
      fetchPuppies();
      setShowForm(false);
      setFormData({ name: '', breed: '', age: '' });
      setEditingId(null);
    } catch (err) {
      console.error('Error saving puppy:', err);
      alert('Failed to save puppy');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this puppy?')) {
      try {
        await axios.delete(`${API_URL}/puppies/${id}`);
        fetchPuppies();
      } catch (err) {
        console.error('Error deleting puppy:', err);
        alert('Failed to delete puppy');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: '', breed: '', age: '' });
    setEditingId(null);
  };

  return (
    <div className="body-container">
        <div>
                  <h1>Puppy Management</h1>

        </div>
      
      {error && <div className="error-message">{error}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Edit Puppy' : 'Add New Puppy'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter puppy name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="breed">Breed:</label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                placeholder="Enter breed"
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Enter age"
                min="0"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Update' : 'Add'} Puppy
              </button>
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Puppies Table */}
      {!showForm && (
        <>
          {loading ? (
            <p>Loading puppies...</p>
          ) : puppies.length === 0 ? (
            <p>No puppies found. Click "Add New Puppy" to create one.</p>
          ) : (
            <table className="puppies-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {puppies.map(puppy => (
                  <tr key={puppy.user_id}>
                    <td>{puppy.user_id}</td>
                    <td>{puppy.name}</td>
                    <td>{puppy.breed}</td>
                    <td>{puppy.age}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClick(puppy)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(puppy.user_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default Body;