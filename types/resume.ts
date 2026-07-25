export interface IPersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin?: string;
  github?: string;
}

export interface IExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface IEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface ISkill {
  id: string;
  name: string;
  level?: string;
}

export interface IProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface IResumeData {
  _id?: string;
  title: string;
  template: "modern" | "ats";
  personalInfo: IPersonalInfo;
  summary: string;
  experiences: IExperience[];
  education: IEducation[];
  skills: ISkill[];
  projects: IProject[];
}