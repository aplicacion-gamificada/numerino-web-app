import { RecentAchievement } from '../../achievement/models/recentAchievement.model';

export interface StudentDetail {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  profilePictureUrl: string;
  studentProfileId: number;
  username: string;
  birth_date: string;
  pointsAmount: number;
  guardianProfileId: number;
  guardianName: string;
  guardianEmail: string;
  roleName: string;
  institutionName: string;
  status: boolean;
  emailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  level: number;
  recentAchievements: RecentAchievement[];
}