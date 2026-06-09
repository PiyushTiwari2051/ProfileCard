import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import Loader from '../components/Loader';
import SocialIcon from '../components/SocialIcon';

function ProfilePage() {
  const navigate = useNavigate();
  const { profile, loading, error } = useProfile();
  const [imgError, setImgError] = useState(false);

  // Reset image error state when profile data updates
  useEffect(() => {
    setImgError(false);
  }, [profile]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="loader-overlay" role="alert">
        <p className="loader-text" style={{ color: 'var(--clr-error)' }}>
          ⚠️ Error: {error}
        </p>
        <button
          className="btn btn-secondary"
          style={{ marginTop: '16px' }}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) return null;

  // Converts Google Drive share links to raw direct display URLs
  const getDirectImageUrl = (url) => {
    if (!url) return '';
    const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(driveRegex);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
  };

  // Calculate initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const primarySocialUrl = profile.linkedin || profile.github || profile.instagram || '#';

  const handleEditClick = () => {
    navigate('/edit');
  };

  const currentTheme = profile.template || 'glassmorphic';

  return (
    <div className={`page-wrapper theme-${currentTheme}`}>
      {/* Background design elements */}
      <div className="glow-blob glow-blob-1"></div>
      <div className="glow-blob glow-blob-2"></div>

      <div className="card-container">
        <div className="card">
          {/* Edit Header Action */}
          <div className="card-header-actions">
            <button
              onClick={handleEditClick}
              className="btn-icon-edit"
              aria-label="Edit Profile"
              title="Edit Profile"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
          </div>

          {/* Profile Details */}
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <div className="avatar-ring">
                {profile.avatar && !imgError ? (
                  <img
                    src={getDirectImageUrl(profile.avatar)}
                    alt={profile.name}
                    className="avatar-img"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="avatar-fallback">
                    {getInitials(profile.name)}
                  </div>
                )}
              </div>
              {/* Pulsing status indicator */}
              <div className="status-dot" title="Active"></div>
            </div>

            <h1 className="profile-name">{profile.name}</h1>
            <span className="profile-title-badge">{profile.title}</span>
            <p className="profile-bio">{profile.bio}</p>
          </div>

          {/* Contact Information */}
          <div className="contact-list">
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="contact-item">
                <span className="contact-label">Phone</span>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.27 1.11l-2.18 2.11z" />
                </svg>
                <span className="contact-value">{profile.phone}</span>
              </a>
            )}

            {profile.email && (
              <a href={`mailto:${profile.email}`} className="contact-item">
                <span className="contact-label">Email</span>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span className="contact-value">{profile.email}</span>
              </a>
            )}

            {profile.location && (
              <div className="contact-item">
                <span className="contact-label">Location</span>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                </svg>
                <span className="contact-value">{profile.location}</span>
              </div>
            )}
          </div>

          {/* Social Icons Section */}
          {(profile.linkedin || profile.instagram || profile.github) && (
            <div className="social-section">
              <span className="social-label">Find me on</span>
              <div className="social-icons-row">
                <SocialIcon
                  platform="linkedin"
                  url={profile.linkedin}
                  label="Visit LinkedIn Profile"
                />
                <SocialIcon
                  platform="github"
                  url={profile.github}
                  label="Visit GitHub Profile"
                />
                <SocialIcon
                  platform="instagram"
                  url={profile.instagram}
                  label="Visit Instagram Profile"
                />
              </div>
            </div>
          )}

          {/* CTA Group */}
          <div className="action-buttons-group">
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="btn btn-secondary">
                Call
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="btn btn-secondary">
                Email
              </a>
            )}
            {primarySocialUrl !== '#' && (
              <a
                href={primarySocialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Profile
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
