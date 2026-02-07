
export enum ValidationStatus {
  VALIDATED = 'VALIDATED',
  PENDING = 'PENDING',
  TOXIC = 'TOXIC'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  PRACTITIONER = 'PRACTITIONER'
}

export enum AccessType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PREMIUM_MONTHLY = 'PREMIUM_MONTHLY',
  PREMIUM_YEARLY = 'PREMIUM_YEARLY'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
  favorites?: string[];
  hasPremiumAccess?: boolean;
  subscriptionTier?: SubscriptionTier;
  subscriptionExpiresAt?: string;
  createdAt?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface ContributionReview {
  practitionerId: string;
  practitionerName: string;
  status: 'VALIDATED' | 'DISPUTED';
  comment: string;
  date: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  authorId: string;
  authorName: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  plantId: string;
}

export interface ForumPost {
  id: string;
  authorId: string;
  author: string;
  authorRole: UserRole;
  category: PostCategory;
  title: string;
  content: string;
  likes: number;
  likedBy: string[]; 
  comments: Comment[];
  date: string;
}

export interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  localNames: string[];
  uses: string[];
  preparation: string;
  precautions: string;
  status: ValidationStatus;
  imageUrl: string;
  region: string;
  accessType: AccessType;
  price?: number; 
  recipes: Recipe[];
}

export interface Practitioner {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  specialty: string;
  location: string;
  certified: boolean;
  phone: string;
  lat: number;
  lng: number;
}

export interface Contribution {
  id: string;
  plantName: string;
  localName: string;
  usage: string;
  region: string;
  imageUrl?: string;
  submittedBy: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviews: ContributionReview[];
}

export type PostCategory = 'Discussion' | 'Astuce' | 'Solution' | 'Question';

export type AppView = 'home' | 'wiki' | 'map' | 'analyze' | 'profile' | 'contribute' | 'auth' | 'admin' | 'community' | 'practitioner-dashboard' | 'pricing' | 'payment' | 'practitioner-apply' | 'privacy';
