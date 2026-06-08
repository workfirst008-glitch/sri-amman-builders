export interface Land {
  id: string;
  title: string;
  price: string;
  size: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface Building {
  id: string;
  title: string;
  price: string;
  size: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  specification: string;
  description: string;
  imageUrl: string;
  completionDate: string;
}

export interface About {
  id: string;
  companyHistory: string;
  mission: string;
  vision: string;
  achievements: string;
  address: string;
  email: string;
  phone: string;
}

export interface Hero {
  id: string;
  imageUrl: string;
}

export interface Admin {
  id: string;
  username: string;
}

export type ActivePage = 'home' | 'lands' | 'buildings' | 'projects' | 'about' | 'admin';
