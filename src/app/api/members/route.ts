import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { householdMembers } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const members = await db.select().from(householdMembers).orderBy(householdMembers.createdAt);
    return NextResponse.json(members);
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convert array fields to JSON strings
    const memberData = {
      ...body,
      photo: body.photo || null,
      allergens: JSON.stringify(body.allergens || []),
      exclusions: JSON.stringify(body.exclusions || []),
      likes: JSON.stringify(body.likes || []),
      dislikes: JSON.stringify(body.dislikes || []),
      medications: JSON.stringify(body.medications || []),
      incomeSources: JSON.stringify(body.incomeSources || []),
      updatedAt: new Date().toISOString(),
    };

    const [newMember] = await db.insert(householdMembers).values(memberData).returning();
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Failed to create member:', error);
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}
