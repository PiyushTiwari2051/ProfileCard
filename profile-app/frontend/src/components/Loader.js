import React from 'react';

/**
 * Loader component displaying a full-screen loading spinner.
 */
function Loader() {
  return (
    <div className="loader-overlay" role="alert" aria-busy="true">
      <div className="loader-ring"></div>
      <p className="loader-text">Loading profile…</p>
    </div>
  );
}

export default Loader;
