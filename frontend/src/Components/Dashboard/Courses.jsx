import React from 'react';
import { Link } from 'react-router-dom';

const Courses = () => {
  return (
    <div className="courses-welcome">
      <div className="welcome-header">
        <h2>Welcome to BrightPath Courses</h2>
        <p>Your journey to knowledge begins here. Explore our courses and unlock your potential!</p>
      </div>
      
      <div className="featured-courses">
        <h3>Featured Courses</h3>
        
        <div className="course-cards">
          <div className="course-card">
            <div className="course-icon">
              <i className="fas fa-code"></i>
            </div>
            <h4>Web Development</h4>
            <p>Master HTML, CSS, JavaScript and modern frameworks</p>
            <Link to="/courses" className="course-btn">
              Explore Course
            </Link>
          </div>
          
          <div className="course-card">
            <div className="course-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h4>Data Science</h4>
            <p>Learn Python, statistics, and machine learning</p>
            <Link to="/courses" className="course-btn">
              Explore Course
            </Link>
          </div>
          
          <div className="course-card">
            <div className="course-icon">
              <i className="fas fa-paint-brush"></i>
            </div>
            <h4>UI/UX Design</h4>
            <p>Create beautiful and functional user interfaces</p>
            <Link to="/courses" className="course-btn">
              Explore Course
            </Link>
          </div>
        </div>
      </div>
      
      <div className="progress-section">
        <h3>Your Learning Progress</h3>
        <div className="progress-chart">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '65%' }}></div>
          </div>
          <div className="progress-stats">
            <span>65% Complete</span>
            <span>3 of 5 courses</span>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <h3>Ready to learn something new?</h3>
        <Link to="/courses" className="browse-btn">
          Browse All Courses
        </Link>
      </div>
    </div>
  );
};

export default Courses;