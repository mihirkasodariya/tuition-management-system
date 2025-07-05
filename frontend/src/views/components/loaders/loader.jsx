import React from 'react';
import '../../../assets/css/loaders/initial-loader.css';

const InitialLoader = ({ loading = false }) => {
  return loading ? (
    <div className="fixed inset-0 flex justify-center items-center bg-transparent bg-opacity-50 backdrop-blur-sm z-10">
      <div className="spinner"></div>
    </div>
  ) : null;
};

export default InitialLoader;
