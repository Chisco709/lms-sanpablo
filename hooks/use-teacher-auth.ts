import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TeacherAuthStore {
  isAuthenticated: boolean;
  isModalOpen: boolean;
  setAuthenticated: (value: boolean) => void;
  setModalOpen: (value: boolean) => void;
  authenticate: (name: string, password: string) => boolean;
  logout: () => void;
}

const TEACHER_CREDENTIALS = {
  name: "Juan Jose Chisco Montoya",
  password: "Chisco7089"
};

export const useTeacherAuth = create<TeacherAuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isModalOpen: false,
      
      setAuthenticated: (value: boolean) => {
        set({ isAuthenticated: value });
      },
      
      setModalOpen: (value: boolean) => {
        set({ isModalOpen: value });
      },
      
      authenticate: (name: string, password: string) => {
        const isValid = name === TEACHER_CREDENTIALS.name && password === TEACHER_CREDENTIALS.password;
        if (isValid) {
          set({ isAuthenticated: true, isModalOpen: false });
        }
        return isValid;
      },
      
      logout: () => {
        set({ isAuthenticated: false, isModalOpen: false });
      }
    }),
    {
      name: 'teacher-auth-storage',
    }
  )
); 