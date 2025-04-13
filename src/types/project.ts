export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
}
