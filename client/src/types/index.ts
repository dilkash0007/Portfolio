// Theme types
export type Theme = 'light' | 'dark';

// Project types
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  categories: string[];
  techs: string[];
  demo: string;
  code: string;
}

// Skill types
export interface Skill {
  name: string;
  percentage: number;
}

export interface TechSkill {
  name: string;
  icon: string;
  color: string;
}

export interface LearningSkill extends TechSkill {
  progress: number;
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}
