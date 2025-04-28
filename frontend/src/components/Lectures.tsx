import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Lecture {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

const Lectures = () => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]); //useState used to store and update dynamic data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${BACKEND_URL}/lectures`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch lectures');
        }

        const data = await response.json();
        const lecturesArray = Array.isArray(data) ? data : data.lectures || [];
        setLectures(lecturesArray);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchLectures();
  }, [navigate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Lectures</h1>
        <button
          onClick={() => navigate('/lectures/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Lecture
        </button>
      </div>

      {lectures.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No lectures found. Create your first lecture!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lectures.map((lecture) => (
            <div 
              key={lecture._id} 
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 truncate">{lecture.title}</h3>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {lecture.category}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 line-clamp-3">{lecture.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Date: {formatDate(lecture.date)}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => navigate(`/lectures/${lecture._id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/lectures/${lecture._id}/edit`)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lectures; 