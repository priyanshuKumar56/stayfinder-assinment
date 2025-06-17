"use client";
import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  Check,
  Shield,
  Star,
  Clock,
  Globe,
  Briefcase,
  GraduationCap,
  Home,
  CreditCard,
  BadgeCheck,
  Loader2,
  LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../../lib/auth'; // Adjust path as needed
import { supabase } from '../../lib/supabase'; // Adjust path as needed

// TypeScript interfaces
interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  bio: string | null;
  address: string | null;
  work: string | null;
  school: string | null;
  languages: string[] | null;
  is_host: boolean;
  is_verified: boolean;
  is_superhost: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  government_id_verified: boolean;
  response_rate: number | null;
  acceptance_rate: number | null;
  response_time: string | null;
  host_since: string | null;
  total_earnings: number | null;
  total_bookings: number | null;
  created_at: string;
  updated_at: string;
}

interface AuthUser {
  id: string;
  email?: string;
}

interface AuthContext {
  user: AuthUser | null;
  loading: boolean;
}

interface ProfileFieldProps {
  label: string;
  field: keyof UserProfile;
  value: string | number | string[] | null | boolean;
  icon: LucideIcon;
  type?: string;
  isTextarea?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

type EditableField = keyof UserProfile;

export default function ProfilePage(): JSX.Element {
  const { user: authUser, loading: authLoading }: AuthContext = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      if (!authUser?.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setError('Failed to load profile data');
        } else {
          setUserData(data as UserProfile);
        }
      } catch (err) {
        console.error('Error in fetchUserProfile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [authUser, authLoading]);

  const handleEdit = (field: EditableField, currentValue: string | number | string[] | null | boolean): void => {
    setEditingField(field);
    setTempValue(Array.isArray(currentValue) ? currentValue.join(', ') : String(currentValue || ''));
    setError(null);
    setSuccessMessage('');
  };

  const handleSave = async (field: EditableField): Promise<void> => {
    if (!authUser?.id || !userData) return;

    setIsUpdating(true);
    setError(null);

    try {
      let newValue: string | number | string[] = tempValue;
      
      // Handle special field types
      if (field === 'languages') {
        newValue = tempValue.split(',').map(lang => lang.trim()).filter(lang => lang);
      } else if (field === 'response_rate' || field === 'acceptance_rate') {
        newValue = parseInt(tempValue) || 0;
      } else if (field === 'total_earnings') {
        newValue = parseFloat(tempValue) || 0;
      } else if (field === 'total_bookings') {
        newValue = parseInt(tempValue) || 0;
      }

      const updateData = {
        [field]: newValue,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', authUser.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        setError(`Failed to update ${String(field).replace('_', ' ')}`);
      } else {
        setUserData(data as UserProfile);
        setEditingField(null);
        setTempValue('');
        setSuccessMessage(`${String(field).replace('_', ' ')} updated successfully!`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error in handleSave:', err);
      setError(`Failed to update ${String(field).replace('_', ' ')}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = (): void => {
    setEditingField(null);
    setTempValue('');
    setError(null);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const ProfileField: React.FC<ProfileFieldProps> = ({ 
    label, 
    field, 
    value, 
    icon: Icon, 
    type = 'text', 
    isTextarea = false, 
    placeholder, 
    disabled = false 
  }) => {
    const displayValue = value || 'Not provided';
    const isEmpty = !value;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Icon className="h-4 w-4" />
            {label}
          </Label>
          {editingField !== field && !disabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(field, value)}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {editingField === field ? (
          <div className="space-y-2">
            {isTextarea ? (
              <Textarea
                value={tempValue}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempValue(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full"
                disabled={isUpdating}
              />
            ) : (
              <Input
                type={type}
                value={tempValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempValue(e.target.value)}
                placeholder={placeholder}
                className="w-full"
                disabled={isUpdating}
              />
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleSave(field)}
                disabled={isUpdating}
                className="flex items-center gap-1"
              >
                {isUpdating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Save className="h-3 w-3" />
                )}
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className={`text-sm ${isEmpty ? 'text-gray-500 italic' : 'text-gray-900'}`}>
            {field === 'languages' && Array.isArray(value) ? value.join(', ') : String(displayValue)}
          </p>
        )}
      </div>
    );
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (!authUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert>
          <AlertDescription>
            Please sign in to view your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert>
          <AlertDescription>
            Failed to load profile data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <X className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userData.avatar_url || undefined} alt={userData.full_name || 'User'} />
              <AvatarFallback className="text-lg">
                {userData.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{userData.full_name}</h1>
                {userData.is_verified && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {userData.is_superhost && (
                  <Badge className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Superhost
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{userData.email}</p>
              <p className="text-sm text-gray-500">
                Member since {formatDate(userData.created_at)}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Manage your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileField
            label="Avatar URL"
            field="avatar_url"
            value={userData.avatar_url}
            icon={User}
            placeholder="Enter your avatar URL"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              label="First Name"
              field="first_name"
              value={userData.first_name}
              icon={User}
              placeholder="Enter your first name"
            />
            <ProfileField
              label="Last Name"
              field="last_name"
              value={userData.last_name}
              icon={User}
              placeholder="Enter your last name"
            />
            <ProfileField
              label="Phone Number"
              field="phone"
              value={userData.phone}
              icon={Phone}
              type="tel"
              placeholder="Enter your phone number"
            />
            <ProfileField
              label="Date of Birth"
              field="date_of_birth"
              value={userData.date_of_birth}
              icon={Calendar}
              type="date"
            />
          </div>
          
          <ProfileField
            label="Bio"
            field="bio"
            value={userData.bio}
            icon={User}
            isTextarea={true}
            placeholder="Tell us about yourself..."
          />
          
          <ProfileField
            label="Address"
            field="address"
            value={userData.address}
            icon={MapPin}
            placeholder="Enter your address"
          />
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>
            Share your work and educational background
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              label="Work"
              field="work"
              value={userData.work}
              icon={Briefcase}
              placeholder="What do you do for work?"
            />
            <ProfileField
              label="School"
              field="school"
              value={userData.school}
              icon={GraduationCap}
              placeholder="Where did you go to school?"
            />
          </div>
          
          <ProfileField
            label="Languages"
            field="languages"
            value={userData.languages}
            icon={Globe}
            placeholder="Enter languages separated by commas"
          />
        </CardContent>
      </Card>

      {/* Host Information */}
      {userData.is_host && (
        <Card>
          <CardHeader>
            <CardTitle>Host Information</CardTitle>
            <CardDescription>
              Manage your hosting details and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField
                label="Response Rate (%)"
                field="response_rate"
                value={userData.response_rate}
                icon={Clock}
                type="number"
                placeholder="Enter response rate (0-100)"
              />
              <ProfileField
                label="Acceptance Rate (%)"
                field="acceptance_rate"
                value={userData.acceptance_rate}
                icon={Check}
                type="number"
                placeholder="Enter acceptance rate (0-100)"
              />
              <ProfileField
                label="Response Time"
                field="response_time"
                value={userData.response_time}
                icon={Clock}
                placeholder="e.g., within an hour"
              />
              <ProfileField
                label="Host Since"
                field="host_since"
                value={userData.host_since}
                icon={Home}
                type="date"
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField
                label="Total Earnings ($)"
                field="total_earnings"
                value={userData.total_earnings}
                icon={CreditCard}
                type="number"
                placeholder="Enter total earnings"
              />
              <ProfileField
                label="Total Bookings"
                field="total_bookings"
                value={userData.total_bookings}
                icon={Home}
                type="number"
                placeholder="Enter total bookings"
              />
            </div>

            {/* Statistics Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userData.response_rate || 0}%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{userData.acceptance_rate || 0}%</div>
                <div className="text-sm text-gray-600">Acceptance Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{userData.total_bookings || 0}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">
                  ${userData.total_earnings?.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>
            Your account verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>Email Verified</span>
              </div>
              {userData.email_verified ? (
                <Badge className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="secondary">Pending</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>Phone Verified</span>
              </div>
              {userData.phone_verified ? (
                <Badge className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="secondary">Pending</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-500" />
                <span>Government ID Verified</span>
              </div>
              {userData.government_id_verified ? (
                <Badge className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="secondary">Pending</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Read-only account details and timestamps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-gray-600">{userData.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Account ID</Label>
              <p className="text-sm text-gray-600 font-mono">{userData.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Account Created</Label>
              <p className="text-sm text-gray-600">{formatDate(userData.created_at)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Last Updated</Label>
              <p className="text-sm text-gray-600">{formatDate(userData.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}