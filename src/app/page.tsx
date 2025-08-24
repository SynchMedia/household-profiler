'use client';

import React, { useState, useEffect } from 'react';
import MemberForm from '@/components/MemberForm';
import MemberCard from '@/components/MemberCard';
import { type HouseholdMember } from '@/lib/schema';
import { type MemberFormData } from '@/lib/validations';

export default function HomePage() {
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<HouseholdMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load members on component mount
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  };

  const handleFormSubmit = async (data: MemberFormData) => {
    setIsLoading(true);
    
    try {
      const url = editingMember ? `/api/members/${editingMember.id}` : '/api/members';
      const method = editingMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await loadMembers(); // Reload the list
        setShowForm(false);
        setEditingMember(null);
      } else {
        const errorData = await response.json();
        console.error('Failed to save member:', errorData);
        alert('Failed to save member. Please check the console for details.');
      }
    } catch (error) {
      console.error('Error saving member:', error);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (member: HouseholdMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const response = await fetch(`/api/members/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadMembers(); // Reload the list
        } else {
          console.error('Failed to delete member');
        }
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Household Profiler</h1>
              <p className="text-gray-600 mt-1">Manage profiles for your household members</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add New Member
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <MemberForm
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            initialData={editingMember || undefined}
            isLoading={isLoading}
          />
        ) : (
          <div>
            {/* Members Grid */}
            {members.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No members yet</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first household member.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Your First Member
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Household Members ({members.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Medical Disclaimer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              ⚠️ <strong>Disclaimer:</strong> This tool is for informational purposes only and is not intended to provide medical advice. 
              Always consult with qualified healthcare professionals for medical concerns and before making significant dietary or lifestyle changes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
