import { create } from "zustand";
import { IResumeData } from "@/types/resume";

interface ResumeStore {
  resume: IResumeData;
  isDirty: boolean;
  setResume: (data: Partial<IResumeData>) => void;
  setIsDirty: (val: boolean) => void;
}

const initialResume: IResumeData = {
  title: "Untitled Resume",
  template: "modern",
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
  },
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  projects: [],
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: initialResume,
  isDirty: false,
  setResume: (data) =>
    set((state) => ({
      resume: { ...state.resume, ...data },
      isDirty: true,
    })),
  setIsDirty: (val) => set({ isDirty: val }),
}));