import React, { useState } from 'react';
import { useCourses } from '../../context/CourseContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';

const AllCourses = () => {
  const { user } = useUser();
  const { courses, loading, error } = useCourses();
  const { isEnrolled, enrollInCourse, loading: enrollmentLoading } = useEnrollment();
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  // Format date for display
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        Error loading courses: {error}
      </div>
    );
  }

  return (
    <div id="all-courses">
      <section className="meetings-page" id="meetings">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <div className="filters">
                    <ul>
                      <li data-filter="all" className="active">All Courses</li>
                      <li data-filter="soon">Coming Soon</li>
                      <li data-filter="free">Free Courses</li>
                    </ul>
                  </div>
                  <div className="col-lg-12">
                    <div className="row grid">
                      {courses.length === 0 ? (
                        <div className="col-12 text-center py-5">
                          <h3>No courses available</h3>
                          <p>Check back later or contact us for upcoming courses</p>
                        </div>
                      ) : (
                        courses.map(course => {
                          const formattedDate = formatDate(course.startDate);
                          const enrolled = isEnrolled(course.id);
                          const isEnrolling = enrollingCourseId === course.id;
                          
                          return (
                            <div className="col-lg-4 templatemo-item-col all" key={course.id}>
                              <div className="meeting-item">
                                <div className="thumb">
                                  <div className="price">
                                    <span>{course.price > 0 ? `LKR ${course.price}` : 'Free'}</span>
                                  </div>
                                  <Link to={`/course/${course.id}`}>
                                    {course.imageUrl ? (
                                      <img src={course.imageUrl} alt={course.name} className="course-image" />
                                    ) : (
                                      <div className="course-img-placeholder">
                                        <i className="fas fa-book"></i>
                                      </div>
                                    )}
                                  </Link>
                                </div>
                                <div className="down-content">
                                  <div className="date">
                                    <h6>
                                      {formattedDate.month} <span>{formattedDate.day}</span>
                                    </h6>
                                  </div>
                                  <div className="content">
                                    <Link to={`/course/${course.id}`}>
                                      <h4>{course.name}</h4>
                                    </Link>
                                    <p>{course.description}</p>
                                  </div>
                                  </div>
                                  
                                  <div>
                                  
                                  {/* Enrollment button below description */}
                                  <div className="enroll-section mt-3">
                                    {enrolled ? (
                                      <button className="btn enrolled-btn w-100" disabled>
                                        <i className="fas fa-check me-2"></i> Enrolled
                                      </button>
                                    ) : (
                                      <button 
                                        className="btn enroll-btn w-100"
                                        onClick={() => handleEnroll(course.id)}
                                        disabled={isEnrolling}
                                      >
                                        {isEnrolling ? (
                                          <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Enrolling...
                                          </>
                                        ) : (
                                          <>
                                            <i className="fas fa-plus me-2"></i> Enroll Now
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="pagination">
                      <ul>
                        <li>
                          <a href="#meetings">1</a>
                        </li>
                        <li className="active">
                          <a href="#meetings">2</a>
                        </li>
                        <li>
                          <a href="#meetings">3</a>
                        </li>
                        <li>
                          <a href="#meetings">
                            <i className="fa fa-angle-right" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllCourses;