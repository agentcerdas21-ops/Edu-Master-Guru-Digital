import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SchoolInfo, UserRole } from '../types';
import { LocalDB } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile;
  school: SchoolInfo;
  updateUser: (updated: Partial<UserProfile>) => void;
  updateSchool: (updated: Partial<SchoolInfo>) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => LocalDB.get<UserProfile>('user', {} as UserProfile));
  const [school, setSchool] = useState<SchoolInfo>(() => LocalDB.get<SchoolInfo>('school', {} as SchoolInfo));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    LocalDB.set('user', user);
  }, [user]);

  useEffect(() => {
    LocalDB.set('school', school);
  }, [school]);

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...updated };
      LocalDB.set('user', next);
      return next;
    });
  };

  const updateSchool = (updated: Partial<SchoolInfo>) => {
    setSchool(prev => {
      const next = { ...prev, ...updated };
      LocalDB.set('school', next);
      return next;
    });
  };

  const switchRole = (newRole: UserRole) => {
    updateUser({ role: newRole });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        school,
        updateUser,
        updateSchool,
        switchRole,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
