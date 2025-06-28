import React, { useState, useEffect } from 'react';
import { useCourses } from '../../context/CourseContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import '../../assets/css/dashboard.css';

const AvailableCourses = () => {
  const { user } = useUser();
  const { 
    courses, 
    loading, 
    error, 
    deleteCourse, 
    refreshCourses, 
    updateCourse 
  } = useCourses();
  
  const { isEnrolled, enrollInCourse, loading: enrollmentLoading } = useEnrollment();
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Handle body scroll on modal open
  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showEditModal]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate()
    };
  };

  const handleEnroll = async (courseId) => {
    if (!user || !user.id) {
      alert('Please login to enroll in courses');
      return;
    }
    
    try {
      setEnrollingCourseId(courseId);
      await enrollInCourse(user.id, courseId);
      alert('Successfully enrolled in the course!');
    } catch (error) {
      alert(`Enrollment failed: ${error.message}`);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleEdit = (course) => {
    console.log('Editing course:', course);
    setEditingCourse(course);
    setShowEditModal(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
        alert('Course deleted successfully!');
        await refreshCourses();
      } catch (error) {
        alert(`Failed to delete course: ${error.message}`);
      }
    }
  };

const handleSaveCourse = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

    const name = formData.get('name');
  const description = formData.get('description');
  const price = parseFloat(formData.get('price'));
  const imageUrl = formData.get('imageUrl');
  
  
  // Ensure date is properly formatted
  const startDate = formData.get('startDate');
  
  // Create updated course object
  const updatedCourse = {
    name,
    description,
    startDate: startDate ? new Date(startDate).toISOString() : editingCourse.startDate,
    price,
    imageUrl
  };
  
  try {
    await updateCourse(editingCourse.id, updatedCourse);
    alert('Course updated successfully!');
    setShowEditModal(false);
    await refreshCourses();
  } catch (error) {
    alert(`Failed to update course: ${error.message}`);
  }
};

  return (
    <div className="available-courses">
      <h2>Available Courses</h2>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading courses...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          Error loading courses: {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="alert alert-info">
          No courses available. Add some courses to get started.
        </div>
      ) : (
        <div className="course-grid">
          {courses.map(course => {
            const formattedDate = formatDate(course.startDate);
            const enrolled = isEnrolled(course.id);
            const isEnrolling = enrollingCourseId === course.id;
            const isAdmin = user?.username === 'Admin';
            
            return (
              <div className="course-card" key={course.id}>
                <div className="course-thumb">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.name} />
                  ) : (
                    <div className="course-placeholder">
                      <i className="fas fa-book"></i>
                    </div>
                  )}
                  <div className="course-price">
                    {course.price > 0 ? `LKR ${course.price}` : 'Free'}
                  </div>
                  {isAdmin && (
                    <div className="course-actions-admin">
                      <button className="edit-btn" onClick={() => handleEdit(course)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(course.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
                <div className="course-details">
                  <div className="course-date">
                    <h6>{formattedDate.month} <span>{formattedDate.day}</span></h6>
                  </div>
                  <div className="course-content">
                    <h4>{course.name}</h4>
                    <p>{course.description}</p>
                  </div>
                  <div className="course-enroll">
                    {enrolled ? (
                      <button className="enrolled-btn" disabled>
                        <i className="fas fa-check"></i> Enrolled
                      </button>
                    ) : (
                      <button className="enroll-btn" onClick={() => handleEnroll(course.id)} disabled={isEnrolling}>
                        {isEnrolling ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                            Enrolling...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-plus"></i> Add to My Courses
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center mt-4">
        <Link to="/courses" className="btn btn-outline-primary">
          View All Courses
        </Link>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingCourse && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Course</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveCourse}>
              <div className="form-group">
                <label>Course Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCourse.name}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  defaultValue={editingCourse.description}
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
                    defaultValue={editingCourse.startDate?.split?.('T')[0] || ''}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Price (LKR)</label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editingCourse.price}
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
                  defaultValue={editingCourse.imageUrl}
                  className="form-control"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableCourses;
