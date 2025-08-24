'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberFormSchema, MemberFormData } from '@/lib/validations';
import { useState, useEffect } from 'react';

interface MemberFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  isLoading?: boolean;
}

export default function MemberForm({ onSubmit, onCancel, initialData, isLoading }: MemberFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  // Calculate age from date of birth
  function calculateAge(dateOfBirth: string): number {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  // Helper function to calculate feet and inches from total inches
  const calculateFeetInches = (totalInches?: number) => {
    if (!totalInches) return { feet: 0, inches: 0 };
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return { feet, inches };
  };

  const { feet: initialFeet, inches: initialInches } = calculateFeetInches(initialData?.height || undefined);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      role: initialData?.role || 'family-member',
      dateOfBirth: initialData?.dateOfBirth || '',
      sex: initialData?.sex || 'male',
      heightFeet: initialFeet,
      heightInches: initialInches,
      weight: initialData?.weight || undefined,
      activityLevel: initialData?.activityLevel || 'sedentary',
      allergens: initialData?.allergens ? JSON.parse(initialData.allergens) : [],
      exclusions: initialData?.exclusions ? JSON.parse(initialData.exclusions) : [],
      likes: initialData?.likes ? JSON.parse(initialData.likes) : [],
      dislikes: initialData?.dislikes ? JSON.parse(initialData.dislikes) : [],
      medications: initialData?.medications ? JSON.parse(initialData.medications) : [],
      incomeSources: initialData?.incomeSources 
        ? JSON.parse(initialData.incomeSources).map((source: any) => ({
            ...source,
            frequency: source.frequency || undefined
          }))
        : [],
      medicalNotes: initialData?.medicalNotes || '',
    },
  });

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setValue('photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Watch for date of birth changes
  const watchedDateOfBirth = watch('dateOfBirth');
  
  useEffect(() => {
    if (watchedDateOfBirth) {
      const age = calculateAge(watchedDateOfBirth);
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  }, [watchedDateOfBirth]);

  // Initialize calculated age for existing member
  useEffect(() => {
    if (initialData?.dateOfBirth) {
      const age = calculateAge(initialData.dateOfBirth);
      setCalculatedAge(age);
    }
  }, [initialData?.dateOfBirth]);

  // Custom submit handler to calculate total height
  const handleFormSubmit = (data: MemberFormData) => {
    // Calculate total inches from feet and inches
    const totalInches = (data.heightFeet || 0) * 12 + (data.heightInches || 0);
    
    // Clean up the data - remove form-only fields that don't belong in the database
    const {
      heightFeet,
      heightInches,
      ...cleanData
    } = data;
    
    const formData = {
      ...cleanData,
      height: totalInches > 0 ? totalInches : undefined,
      photo: photoPreview || undefined,
    };
    
    onSubmit(formData);
  };

  const { fields: allergenFields, append: addAllergen, remove: removeAllergen } = useFieldArray({
    control,
    name: 'allergens',
  });

  const { fields: exclusionFields, append: addExclusion, remove: removeExclusion } = useFieldArray({
    control,
    name: 'exclusions',
  });

  const { fields: likeFields, append: addLike, remove: removeLike } = useFieldArray({
    control,
    name: 'likes',
  });

  const { fields: dislikeFields, append: addDislike, remove: removeDislike } = useFieldArray({
    control,
    name: 'dislikes',
  });

  const { fields: medicationFields, append: addMedication, remove: removeMedication } = useFieldArray({
    control,
    name: 'medications',
  });

  const { fields: incomeFields, append: addIncomeSource, remove: removeIncomeSource } = useFieldArray({
    control,
    name: 'incomeSources',
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {initialData ? 'Update' : 'Add New'} Household Member
      </h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Photo Upload Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">📷 Photo</h3>
          <div className="flex flex-col items-center space-y-4">
            {photoPreview && (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              {...register('name')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              {...register('role')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dad">Dad</option>
              <option value="mom">Mom</option>
              <option value="child">Child</option>
              <option value="grandparent">Grandparent</option>
              <option value="family-member">Family Member</option>
              <option value="roommate">Roommate</option>
              <option value="other">Other</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              {...register('dateOfBirth')}
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {calculatedAge !== null && (
              <p className="text-sm text-gray-600 mt-1">
                Current age: {calculatedAge} years old
              </p>
            )}
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sex *
            </label>
            <select
              {...register('sex')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex.message}</p>}
          </div>
        </div>

        {/* Height and Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  {...register('heightFeet', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="8"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Feet"
                />
                <label className="text-xs text-gray-500">Feet</label>
              </div>
              <div className="flex-1">
                <input
                  {...register('heightInches', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="11"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inches"
                />
                <label className="text-xs text-gray-500">Inches</label>
              </div>
            </div>
            {(errors.heightFeet || errors.heightInches) && (
              <p className="text-red-500 text-sm mt-1">Please enter valid height</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (lbs)
            </label>
            <input
              {...register('weight', { valueAsNumber: true })}
              type="number"
              min="1"
              max="1000"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter weight in pounds"
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Activity Level *
          </label>
          <select
            {...register('activityLevel')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="sedentary">Sedentary</option>
            <option value="lightly-active">Lightly Active</option>
            <option value="moderately-active">Moderately Active</option>
            <option value="very-active">Very Active</option>
            <option value="extremely-active">Extremely Active</option>
          </select>
          {errors.activityLevel && <p className="text-red-500 text-sm mt-1">{errors.activityLevel.message}</p>}
          
          {/* Activity Level Guide */}
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p><strong>Sedentary:</strong> Little to no exercise, desk job</p>
            <p><strong>Lightly Active:</strong> Light exercise 1-3 days per week</p>
            <p><strong>Moderately Active:</strong> Moderate exercise 3-5 days per week</p>
            <p><strong>Very Active:</strong> Hard exercise 6-7 days per week</p>
            <p><strong>Extremely Active:</strong> Very hard exercise, physical job, or training twice a day</p>
          </div>
        </div>

        {/* Income Sources Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">💰 Income Sources</h3>
          <p className="text-sm text-gray-600">Please input your take-home amounts for each income source.</p>
          
          {incomeFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  {...register(`incomeSources.${index}.source` as const)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Income source (e.g., Job, Side hustle)"
                />
              </div>
              <div className="w-32">
                <input
                  {...register(`incomeSources.${index}.amount` as const, { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Amount"
                />
              </div>
              <div className="w-32">
                <select
                  {...register(`incomeSources.${index}.frequency` as const)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="bi-monthly">Bi-monthly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semi-annually">Semi-annually</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeIncomeSource(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addIncomeSource({ source: '', amount: 0, frequency: undefined })}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add Income Source
            </button>
            <button
              type="button"
              onClick={() => {
                // Clear all income sources
                incomeFields.forEach((_, index) => removeIncomeSource(index));
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              No Income
            </button>
          </div>
        </div>

        {/* Eating Habits Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">🍽️ Eating Habits</h3>
          
          {/* Allergens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergens
            </label>
            {allergenFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(`allergens.${index}` as const)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter allergen"
                />
                <button
                  type="button"
                  onClick={() => removeAllergen(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => (addAllergen as any)('')}
                className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Allergen
              </button>
              <button
                type="button"
                onClick={() => (addAllergen as any)('None')}
                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                None
              </button>
            </div>
          </div>

          {/* Dietary Exclusions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Exclusions
            </label>
            {exclusionFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(`exclusions.${index}` as const)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter dietary exclusion"
                />
                <button
                  type="button"
                  onClick={() => removeExclusion(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => (addExclusion as any)('')}
                className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Exclusion
              </button>
              <button
                type="button"
                onClick={() => (addExclusion as any)('None')}
                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                None
              </button>
            </div>
          </div>

          {/* Favorite Foods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Favorite Foods
            </label>
            {likeFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(`likes.${index}` as const)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter favorite food"
                />
                <button
                  type="button"
                  onClick={() => removeLike(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => (addLike as any)('')}
                className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Favorite Food
              </button>
              <button
                type="button"
                onClick={() => (addLike as any)('Everything')}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Everything
              </button>
            </div>
          </div>

          {/* Unfavorable Foods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unfavorable Foods
            </label>
            {dislikeFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(`dislikes.${index}` as const)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter unfavorable food"
                />
                <button
                  type="button"
                  onClick={() => removeDislike(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => (addDislike as any)('')}
                className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Unfavorable Food
              </button>
              <button
                type="button"
                onClick={() => (addDislike as any)('Nothing')}
                className="px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                Nothing
              </button>
            </div>
          </div>
        </div>

        {/* Medications & Medical Conditions Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">💊 Medications & Medical Conditions</h3>
          
          {/* Medications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medications
            </label>
            {medicationFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(`medications.${index}` as const)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter medication name"
                />
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => (addMedication as any)('')}
                className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Medication
              </button>
              <button
                type="button"
                onClick={() => (addMedication as any)('None')}
                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                None
              </button>
            </div>
          </div>

          {/* Medical Conditions & Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical Conditions & Notes (Optional)
            </label>
            <textarea
              {...register('medicalNotes')}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter any medical conditions, allergies, or important health notes..."
            />
            {errors.medicalNotes && <p className="text-red-500 text-sm mt-1">{errors.medicalNotes.message}</p>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Member' : 'Add Member')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
