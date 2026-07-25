import mongoose, { Schema, model, models } from "mongoose";

const ExperienceSchema = new Schema({
  company: String,
  role: String,
  startDate: String,
  endDate: String,
  description: String,
});

const EducationSchema = new Schema({
  school: String,
  degree: String,
  year: String,
});

const ProjectSchema = new Schema({
  title: String,
  technologies: String,
  link: String,
  description: String,
});

const ResumeSchema = new Schema(
  {
    title: String,
    fullName: String,
    email: String,
    phone: String,
    summary: String,
    picture: String,
    skills: [String],
    languages: String,
    certifications: String,
    experience: [ExperienceSchema],
    education: [EducationSchema],
    projects: [ProjectSchema],
  },
  { strict: false, timestamps: true } // strict: false allows dynamic field additions
);

export default models.Resume || model("Resume", ResumeSchema);