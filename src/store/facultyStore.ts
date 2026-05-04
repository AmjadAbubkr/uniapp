import { create } from 'zustand';

import { Faculty } from '@domain/types';
import { FacultyService } from '@data/services';

interface FacultyState {
  faculties: Faculty[];
  isLoading: boolean;
  error: string | null;
  fetchFaculties: () => Promise<void>;
  createFaculty: (name: string, deanId: string) => Promise<string>;
  updateFaculty: (id: string, data: Partial<Faculty>) => Promise<void>;
  deleteFaculty: (id: string) => Promise<void>;
  assignDean: (facultyId: string, deanId: string) => Promise<void>;
}

export const useFacultyStore = create<FacultyState>((set, _get) => ({
  faculties: [],
  isLoading: false,
  error: null,

  fetchFaculties: async () => {
    set({ isLoading: true, error: null });
    try {
      const faculties = await FacultyService.getAll();
      set({ faculties, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createFaculty: async (name, deanId) => {
    set({ error: null });
    try {
      const id = await FacultyService.create({ name, deanId });
      const faculties = await FacultyService.getAll();
      set({ faculties });
      return id;
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  updateFaculty: async (id, data) => {
    set({ error: null });
    try {
      await FacultyService.update(id, data);
      const faculties = await FacultyService.getAll();
      set({ faculties });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteFaculty: async (id) => {
    set({ error: null });
    try {
      await FacultyService.delete(id);
      const faculties = await FacultyService.getAll();
      set({ faculties });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  assignDean: async (facultyId, deanId) => {
    set({ error: null });
    try {
      await FacultyService.assignDean(facultyId, deanId);
      const faculties = await FacultyService.getAll();
      set({ faculties });
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
