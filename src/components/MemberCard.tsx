'use client';

import React from 'react';
import { type HouseholdMember } from '@/lib/schema';

interface MemberCardProps {
  member: HouseholdMember;
  onEdit?: (member: HouseholdMember) => void;
  onDelete?: (id: number) => void;
}

export default function MemberCard({ member, onEdit, onDelete }: MemberCardProps) {
  const parseArrayField = (field: string | null): string[] => {
    if (!field) return [];
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const displayAge = member.dateOfBirth 
    ? calculateAge(member.dateOfBirth)
    : null;

  // Format height as feet and inches
  const formatHeight = (totalInches?: number): string => {
    if (!totalInches) return 'Not specified';
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}"`;
  };

  const roleLabels = {
    dad: 'Dad',
    mom: 'Mom',
    child: 'Child',
    grandparent: 'Grandparent',
    family_member: 'Family Member',
    roommate: 'Roommate',
    other: 'Other',
  };

  const allergens = parseArrayField(member.allergens);
  const exclusions = parseArrayField(member.exclusions);
  const likes = parseArrayField(member.likes);
  const dislikes = parseArrayField(member.dislikes);
  const medications = parseArrayField(member.medications);
  
  const parseIncomeField = (field: string | null) => {
    if (!field) return [];
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };
  
  const incomeSources = parseIncomeField(member.incomeSources);

  const activityLevelLabels = {
    sedentary: 'Sedentary',
    light: 'Light Exercise',
    moderate: 'Moderate Exercise',
    active: 'Active',
    very_active: 'Very Active',
  };



  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {/* Photo */}
          <div className="flex-shrink-0">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Name and Details */}
          <div>
            <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
            <p className="text-blue-600 font-medium text-sm">
              {roleLabels[member.role as keyof typeof roleLabels]}
            </p>
            <p className="text-gray-600">
              {displayAge ? `${displayAge} years old` : 'Date of birth not specified'} • {member.sex}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(member)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(member.id!)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Physical Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Height</p>
          <p className="text-gray-600">{formatHeight(member.height)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Weight</p>
          <p className="text-gray-600">{member.weight ? `${member.weight} lbs` : 'Not specified'}</p>
        </div>
      </div>

      {/* Activity Level */}
      <div className="mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Activity Level</p>
          <p className="text-gray-600">{activityLevelLabels[member.activityLevel as keyof typeof activityLevelLabels]}</p>
        </div>
      </div>

      {/* Arrays */}
      <div className="space-y-3">
        {allergens.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Allergens</p>
            <div className="flex flex-wrap gap-1">
              {allergens.map((allergen, index) => (
                <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs">
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}

        {exclusions.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Dietary Exclusions</p>
            <div className="flex flex-wrap gap-1">
              {exclusions.map((exclusion, index) => (
                <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-xs">
                  {exclusion}
                </span>
              ))}
            </div>
          </div>
        )}

        {likes.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Favorite Foods</p>
            <div className="flex flex-wrap gap-1">
              {likes.map((like, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                  {like}
                </span>
              ))}
            </div>
          </div>
        )}

        {dislikes.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Unfavorable Foods</p>
            <div className="flex flex-wrap gap-1">
              {dislikes.map((dislike, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs">
                  {dislike}
                </span>
              ))}
            </div>
          </div>
        )}

        {incomeSources.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Income Sources</p>
            <div className="space-y-1">
              {incomeSources.map((income: any, index: number) => (
                <div key={index} className="bg-green-50 px-2 py-1 rounded text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">{income.source}</span>
                    {income.amount !== undefined && income.amount > 0 && (
                      <span className="text-green-600">${income.amount.toLocaleString()}</span>
                    )}
                  </div>
                  {income.frequency && (
                    <div className="text-green-600 text-xs mt-1">
                      {income.frequency.charAt(0).toUpperCase() + income.frequency.slice(1).replace('-', ' ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {medications.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Medications</p>
            <div className="flex flex-wrap gap-1">
              {medications.map((medication, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                  {medication}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Medical Conditions & Notes */}
      {member.medicalNotes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-1">Medical Conditions & Notes</p>
          <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">{member.medicalNotes}</p>
        </div>
      )}
    </div>
  );
}
