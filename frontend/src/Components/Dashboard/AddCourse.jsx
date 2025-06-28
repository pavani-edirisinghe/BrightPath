import React, { useState } from 'react';

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    startDate: '',
    price: '',
    imageUrl: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8081/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...courseData,
          price: parseFloat(courseData.price) // Convert to number
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add course');
      }

      const data = await response.json();
      setSuccessMessage('Course added successfully!');
      
      // Reset form
      setCourseData({
        name: '',
        description: '',
        startDate: '',
        price: '',
        imageUrl: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  return (
    <div className="add-course">
      <h2>Add New Course</h2>
      
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Name</label>
          <input
            type="text"
            name="name"
            value={courseData.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            required
            className="form-control"
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={courseData.startDate}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group col-md-6">
            <label>Price (LKR)</label>
            <input
              type="number"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              required
              className="form-control"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={courseData.imageUrl}
            onChange={handleChange}
            placeholder="Paste image URL"
            className="form-control"
          />
          <small className="form-text text-muted">
            Use services like <a href="https://imgbb.com/" target="_blank" rel="noreferrer">ImgBB</a> to host images
          </small>
        </div>
        
        <button type="submit" className="btn btn-primary">
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;