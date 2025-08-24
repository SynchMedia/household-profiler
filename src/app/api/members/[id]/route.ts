import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { householdMembers } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT request received for member ID:', params.id);
    
    const id = parseInt(params.id);
    const body = await request.json();
    
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Clean up the data - remove undefined fields and extra properties
    const cleanData = {
      name: body.name,
      role: body.role,
      photo: body.photo || null,
      dateOfBirth: body.dateOfBirth || null,
      sex: body.sex,
      height: body.height || null,
      weight: body.weight || null,
      activityLevel: body.activityLevel,
      allergens: JSON.stringify(body.allergens || []),
      exclusions: JSON.stringify(body.exclusions || []),
      likes: JSON.stringify(body.likes || []),
      dislikes: JSON.stringify(body.dislikes || []),
      medications: JSON.stringify(body.medications || []),
      incomeSources: JSON.stringify(body.incomeSources || []),
      medicalNotes: body.medicalNotes || null,
      updatedAt: new Date().toISOString(),
    };
    
    console.log('Clean data for update:', JSON.stringify(cleanData, null, 2));

    const [updatedMember] = await db
      .update(householdMembers)
      .set(cleanData)
      .where(eq(householdMembers.id, id))
      .returning();

    console.log('Updated member result:', updatedMember);

    if (!updatedMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Failed to update member - Full error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to update member',
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const [deletedMember] = await db
      .delete(householdMembers)
      .where(eq(householdMembers.id, id))
      .returning();

    if (!deletedMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Failed to delete member:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
