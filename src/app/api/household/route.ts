import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { householdMembers } from '@/lib/schema';

interface HouseholdMember {
  id: number;
  name: string;
  role: string;
  photo: string | null;
  dateOfBirth: string | null;
  sex: string;
  height: number | null;
  weight: number | null;
  activityLevel: string;
  allergens: string | null;
  exclusions: string | null;
  likes: string | null;
  dislikes: string | null;
  medications: string | null;
  incomeSources: string | null;
  medicalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface HouseholdOverview {
  id: number;
  name: string;
  timezone: string;
  createdAt: string;
  members: HouseholdMember[];
}

export async function GET(): Promise<NextResponse<HouseholdOverview | { error: string }>> {
  try {
    // Get all household members
    const members = await db
      .select()
      .from(householdMembers)
      .orderBy(householdMembers.createdAt);

    if (!members || members.length === 0) {
      return NextResponse.json({ error: 'No household found' }, { status: 404 });
    }

    // Create a virtual household object
    // Since there's no actual household table, we'll use the first member's creation date
    // and create a default household structure
    const household: HouseholdOverview = {
      id: 1, // Default household ID since there's no actual household table
      name: 'My Household', // Default name since there's no actual household table
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get current timezone
      createdAt: members[0].createdAt, // Use the earliest member's creation date
      members: members
    };

    return NextResponse.json(household);
  } catch (error: unknown) {
    console.error('Failed to fetch household overview:', error);
    return NextResponse.json({ error: 'Failed to fetch household overview' }, { status: 500 });
  }
}
