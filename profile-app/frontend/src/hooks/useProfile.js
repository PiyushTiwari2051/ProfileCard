import { useState, useEffect, useCallback } from 'react';
import { getProfile, updateProfile } from '../api/profileApi';

/**
 * Custom hook for profile data management.
 * Provides functions to fetch and update profile data, along with status indicators.
 */
export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (updatedData) => {
    setSaving(true);
    setError(null);
    try {
      const data = await updateProfile(updatedData);
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to save profile');
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    saving,
    saveProfile,
    refetch: fetchProfile,
  };
}
