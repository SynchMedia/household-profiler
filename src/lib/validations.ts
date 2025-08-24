import { z } from 'zod';

export const memberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  role: z.enum(['dad', 'mom', 'child', 'grandparent', 'family_member', 'roommate', 'other'], {
    required_error: 'Role is required',
  }),
  photo: z.string().optional(),
  dateOfBirth: z.string().optional(),
  sex: z.enum(['male', 'female', 'other'], {
    required_error: 'Sex is required',
  }),
  heightFeet: z.number().min(1).max(10).optional(), // feet (1 to 10 feet)
  heightInches: z.number().min(0).max(11).optional(), // inches (0 to 11 inches)
  height: z.number().min(12).max(120).optional(), // calculated total inches
  weight: z.number().min(1).max(2000).optional(), // pounds
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active'], {
    required_error: 'Activity level is required',
  }),
  allergens: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  likes: z.array(z.string()).default([]),
  dislikes: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  incomeSources: z.array(z.object({
    source: z.string(),
    amount: z.number().min(0).optional(),
    frequency: z.enum(['daily', 'weekly', 'bi-weekly', 'bi-monthly', 'monthly', 'quarterly', 'semi-annually', 'annually']).optional(),
  })).default([]),
  medicalNotes: z.string().optional(),
});

export type MemberFormData = z.infer<typeof memberSchema>;
