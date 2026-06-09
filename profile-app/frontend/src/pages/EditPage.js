import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

// Internal Field Component for input consistency and accessibility
function Field({ id, label, icon, value, onChange, type = 'text', placeholder, children, ...props }) {
  return (
    <div className="form-group">
      <div className="form-label-row">
        <label htmlFor={id} className="form-label">{label}</label>
        {children}
      </div>
      <div className="input-wrapper">
        {icon}
        {type === 'textarea' ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="form-input form-textarea"
            {...props}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="form-input"
            {...props}
          />
        )}
      </div>
    </div>
  );
}

function EditPage() {
  const navigate = useNavigate();
  const { profile, loading, error, saving, saveProfile } = useProfile();
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    phone: '',
    email: '',
    location: '',
    avatar: '',
    linkedin: '',
    instagram: '',
    github: '',
    template: 'glassmorphic'
  });

  const [previewError, setPreviewError] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Sync loaded profile into state
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        email: profile.email || '',
        location: profile.location || '',
        avatar: profile.avatar || '',
        linkedin: profile.linkedin || '',
        instagram: profile.instagram || '',
        github: profile.github || '',
        template: profile.template || 'glassmorphic'
      });
    }
  }, [profile]);

  // Reset preview load error when url changes
  useEffect(() => {
    setPreviewError(false);
  }, [formData.avatar]);

  // Compare current state against original loaded profile data
  const dirty = profile ? Object.keys(formData).some(
    (key) => formData[key] !== (profile[key] || '')
  ) : false;

  if (loading) {
    return <Loader />;
  }

  if (error && !profile) {
    return (
      <div className="loader-overlay" role="alert">
        <p className="loader-text" style={{ color: 'var(--clr-error)' }}>
          ⚠️ Error loading profile: {error}
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

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!dirty || saving) return;

    try {
      await saveProfile(formData);
      setToast({
        show: true,
        message: 'Profile saved successfully!',
        type: 'success'
      });
      // Redirect after 1500ms so user can read the success toast
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setToast({
        show: true,
        message: err.message || 'Failed to update profile.',
        type: 'error'
      });
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

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

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isAvatarValid =
    formData.avatar &&
    (formData.avatar.startsWith('http://') || formData.avatar.startsWith('https://')) &&
    !previewError;

  // Icons used as input indicators
  const userIcon = <svg className="input-icon-left" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
  const badgeIcon = <svg className="input-icon-left" viewBox="0 0 24 24"><path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm10 15H4V9h16v11z"/></svg>;
  const linkIcon = <svg className="input-icon-left" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>;
  const phoneIcon = <svg className="input-icon-left" viewBox="0 0 24 24"><path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.27 1.11l-2.18 2.11z"/></svg>;
  const emailIcon = <svg className="input-icon-left" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
  const locationIcon = <svg className="input-icon-left" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>;

  const currentTheme = formData.template || 'glassmorphic';

  return (
    <div className={`page-wrapper theme-${currentTheme}`}>
      {/* Background design elements */}
      <div className="glow-blob glow-blob-1"></div>
      <div className="glow-blob glow-blob-2"></div>

      <div className="card-container">
        <div className="card">
          <form onSubmit={handleSave} className="edit-form">
            
            {/* SECTION 00 — Card Theme Selection */}
            <div className="form-section" style={{ borderTop: 'none', paddingTop: 0 }}>
              <div className="section-header">
                <span className="section-badge">00</span>
                <span className="section-title">Card Theme</span>
              </div>
              <div className="theme-selector-grid">
                {[
                  { id: 'glassmorphic', name: 'Glassmorphic', previewClass: 'theme-preview-glassmorphic' },
                  { id: 'cyberpunk', name: 'Cyberpunk Neon', previewClass: 'theme-preview-cyberpunk' },
                  { id: 'editorial', name: 'Minimal Editorial', previewClass: 'theme-preview-editorial' },
                  { id: 'organic', name: 'Warm Organic', previewClass: 'theme-preview-organic' },
                ].map((t) => (
                  <div
                    key={t.id}
                    className={`theme-card ${formData.template === t.id ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, template: t.id }))}
                  >
                    <div className={`theme-preview-dot ${t.previewClass}`}></div>
                    <span className="theme-card-name">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Avatar Preview Component */}
            <div className="edit-avatar-preview">
              <div className="edit-avatar-container">
                {isAvatarValid ? (
                  <img
                    src={getDirectImageUrl(formData.avatar)}
                    alt="Preview avatar"
                    className="edit-avatar-img"
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <div className="edit-avatar-fallback">
                    {getInitials(formData.name)}
                  </div>
                )}
              </div>
              <div className="edit-avatar-text">
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-text-primary)' }}>Avatar Preview</h2>
                <p style={{ fontSize: '11px', color: 'var(--clr-text-muted)' }}>Updates live as you type a valid image URL</p>
              </div>
            </div>

            {/* SECTION 01 — Basic Info */}
            <div className="form-section">
              <div className="section-header">
                <span className="section-badge">01</span>
                <span className="section-title">Basic Info</span>
              </div>

              <Field
                id="name"
                label="Full Name"
                icon={userIcon}
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Alex Morgan"
                required
              />

              <Field
                id="title"
                label="Job Title"
                icon={badgeIcon}
                value={formData.title}
                onChange={handleChange('title')}
                placeholder="Senior Product Designer"
                required
              />

              <Field
                id="bio"
                label="Bio"
                type="textarea"
                value={formData.bio}
                onChange={handleChange('bio')}
                placeholder="Brief summary about yourself..."
                required
                maxLength={300}
              >
                <span className={`char-counter ${formData.bio.length > 250 ? 'warning' : ''}`}>
                  {formData.bio.length}/300 chars
                </span>
              </Field>

              <Field
                id="avatar"
                label="Avatar URL"
                type="url"
                icon={linkIcon}
                value={formData.avatar}
                onChange={handleChange('avatar')}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            {/* SECTION 02 — Contact */}
            <div className="form-section">
              <div className="section-header">
                <span className="section-badge">02</span>
                <span className="section-title">Contact</span>
              </div>

              <Field
                id="phone"
                label="Phone"
                icon={phoneIcon}
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="+1 (555) 000-0000"
              />

              <Field
                id="email"
                label="Email"
                type="email"
                icon={emailIcon}
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="example@domain.com"
                required
              />

              <Field
                id="location"
                label="Location"
                icon={locationIcon}
                value={formData.location}
                onChange={handleChange('location')}
                placeholder="San Francisco, CA"
              />
            </div>

            {/* SECTION 03 — Social Links */}
            <div className="form-section">
              <div className="section-header">
                <span className="section-badge">03</span>
                <span className="section-title">Social Links</span>
              </div>

              <Field
                id="linkedin"
                label="LinkedIn URL"
                type="url"
                icon={linkIcon}
                value={formData.linkedin}
                onChange={handleChange('linkedin')}
                placeholder="https://linkedin.com/in/username"
              />

              <Field
                id="instagram"
                label="Instagram URL"
                type="url"
                icon={linkIcon}
                value={formData.instagram}
                onChange={handleChange('instagram')}
                placeholder="https://instagram.com/username"
              />

              <Field
                id="github"
                label="GitHub URL"
                type="url"
                icon={linkIcon}
                value={formData.github}
                onChange={handleChange('github')}
                placeholder="https://github.com/username"
              />
            </div>

            {/* Form actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!dirty || saving}
              >
                {saving ? (
                  <>
                    <span className="btn-spinner"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification Container */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}

export default EditPage;
