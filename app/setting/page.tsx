"use client";
import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Eye,
  EyeOff,
  Camera,
  Edit3,
  Save,
  X,
  Check,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Smartphone,
  Key,
  Trash2,
  Download,
  Upload,
  Moon,
  Sun,
  Monitor,
  Languages,
  Volume2,
  VolumeX,
  Wifi,
  Database,
  HardDrive,
  Activity,
  LogOut,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';

// Type Definitions
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
  size?: 'default' | 'sm';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

interface SelectProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  className?: string;
}

interface SelectValueProps {
  placeholder: string;
  value: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  onValueChange?: (value: string) => void;
  setIsOpen?: (open: boolean) => void;
  currentValue?: string;
}

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  className?: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  birthDate: string;
  website: string;
  avatar: string | null;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  bookingUpdates: boolean;
  hostMessages: boolean;
  reviews: boolean;
  promotions: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'members' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showLastSeen: boolean;
  allowSearchEngines: boolean;
  dataProcessing: boolean;
}

interface PreferencesSettings {
  language: string;
  timezone: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  autoPlayVideos: boolean;
  dataUsage: 'low' | 'standard' | 'high';
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: string;
  trustedDevices: number;
}

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
}

// Mock UI Components
const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  disabled = false, 
  onClick,
  ...props 
}) => (
  <button 
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      variant === "outline" ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700" :
      variant === "secondary" ? "bg-gray-200 hover:bg-gray-300 text-gray-900" :
      variant === "destructive" ? "bg-red-600 hover:bg-red-700 text-white" :
      "bg-blue-600 text-white hover:bg-blue-700"
    } ${size === "sm" ? "px-3 py-1 text-sm" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input 
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

const Textarea: React.FC<TextareaProps> = ({ className = "", ...props }) => (
  <textarea 
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${className}`}
    {...props}
  />
);

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
);

const CardTitle: React.FC<CardProps> = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
);

const CardDescription: React.FC<CardProps> = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
);

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, className = "" }) => (
  <button
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? "bg-blue-600" : "bg-gray-200"
    } ${className}`}
    onClick={() => onCheckedChange(!checked)}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const Select: React.FC<SelectProps> = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="relative">
      {React.Children.map(children, child => 
        React.cloneElement(child as React.ReactElement, { value, onValueChange, isOpen, setIsOpen })
      )}
    </div>
  );
};

const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, isOpen, setIsOpen, className = "" }) => (
  <button
    className={`w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    onClick={() => setIsOpen && setIsOpen(!isOpen)}
  >
    {children}
  </button>
);

const SelectValue: React.FC<SelectValueProps> = ({ placeholder, value }) => (
  <span className={value ? "text-gray-900" : "text-gray-500"}>
    {value || placeholder}
  </span>
);

const SelectContent: React.FC<SelectContentProps> = ({ children, value, onValueChange, isOpen, setIsOpen }) => (
  isOpen ? (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
      {React.Children.map(children, child => 
        React.cloneElement(child as React.ReactElement, { onValueChange, setIsOpen, currentValue: value })
      )}
    </div>
  ) : null
);

const SelectItem: React.FC<SelectItemProps> = ({ children, value, onValueChange, setIsOpen, currentValue }) => (
  <button
    className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
      currentValue === value ? "bg-blue-50 text-blue-600" : ""
    }`}
    onClick={() => {
      onValueChange && onValueChange(value);
      setIsOpen && setIsOpen(false);
    }}
  >
    {children}
  </button>
);

const Label: React.FC<LabelProps> = ({ children, htmlFor, className = "" }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
    {children}
  </label>
);

const Separator: React.FC<{ className?: string }> = ({ className = "" }) => (
  <hr className={`border-gray-200 my-6 ${className}`} />
);

const Alert: React.FC<AlertProps> = ({ children, className = "" }) => (
  <div className={`flex items-start p-4 rounded-lg border ${className}`}>
    {children}
  </div>
);

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className = "" }) => (
  <div className={`ml-3 ${className}`}>{children}</div>
);

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = "default", className = "" }) => (
  <div className={`relative ${
    size === "lg" ? "w-20 h-20" : 
    size === "sm" ? "w-8 h-8" : "w-12 h-12"
  } ${className}`}>
    {src ? (
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full rounded-full object-cover"
      />
    ) : (
      <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
        <User className={`${size === "lg" ? "w-8 h-8" : size === "sm" ? "w-4 h-4" : "w-6 h-6"} text-gray-600`} />
      </div>
    )}
  </div>
);

const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
    variant === "destructive" ? "bg-red-100 text-red-800" :
    variant === "success" ? "bg-green-100 text-green-800" :
    variant === "warning" ? "bg-yellow-100 text-yellow-800" :
    "bg-gray-100 text-gray-800"
  } ${className}`}>
    {children}
  </span>
);
// Main Settings Component
const UserSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Digital nomad and travel enthusiast. Love exploring new places and meeting new people.',
    location: 'San Francisco, CA',
    birthDate: '1990-01-15',
    website: 'https://johndoe.com',
    avatar: null
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    marketing: true,
    bookingUpdates: true,
    hostMessages: true,
    reviews: true,
    promotions: false
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLastSeen: true,
    allowSearchEngines: true,
    dataProcessing: true
  });

  const [preferences, setPreferences] = useState<PreferencesSettings>({
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD',
    theme: 'system',
    soundEnabled: true,
    autoPlayVideos: false,
    dataUsage: 'standard'
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: '30',
    trustedDevices: 3
  });

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile Information',
      icon: User,
      description: 'Manage your personal information and public profile'
    },
    {
      id: 'account',
      title: 'Account Settings',
      icon: Settings,
      description: 'Account preferences and basic settings'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Control how you receive notifications'
    },
    {
      id: 'privacy',
      title: 'Privacy & Safety',
      icon: Shield,
      description: 'Manage your privacy settings and data'
    },
    {
      id: 'security',
      title: 'Security',
      icon: Lock,
      description: 'Password, two-factor auth, and security settings'
    },
    {
      id: 'payments',
      title: 'Payments & Billing',
      icon: CreditCard,
      description: 'Payment methods and billing information'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: Globe,
      description: 'Language, timezone, and display preferences'
    }
  ];

  const handleSaveProfile = (): void => {
    setIsEditing(false);
    console.log('Saving profile data:', profileData);
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean): void => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean | string): void => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: keyof PreferencesSettings, value: string | boolean): void => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key: keyof SecuritySettings, value: boolean | string | number): void => {
    setSecurity(prev => ({ ...prev, [key]: value }));
  };

  const renderProfileSection = (): JSX.Element => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              This information will be displayed on your public profile
            </CardDescription>
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <Avatar src={profileData.avatar} alt="Profile" size="lg" />
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Profile Photo</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profileData.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profileData.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setProfileData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profileData.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setProfileData(prev => ({ ...prev, location: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              value={profileData.birthDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={profileData.website}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setProfileData(prev => ({ ...prev, website: e.target.value }))}
            disabled={!isEditing}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profileData.bio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
              setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            disabled={!isEditing}
            rows={4}
            placeholder="Tell others about yourself..."
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderNotificationsSection = (): JSX.Element => (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to be notified about activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Communication Channels</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked: boolean) => handleNotificationChange('email', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                  <p className="text-xs text-gray-500">Receive push notifications on your devices</p>
                </div>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked: boolean) => handleNotificationChange('push', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-xs text-gray-500">Receive important updates via SMS</p>
                </div>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked: boolean) => handleNotificationChange('sms', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">What to be notified about</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Booking Updates</p>
                <p className="text-xs text-gray-500">Confirmations, changes, and reminders</p>
              </div>
              <Switch
                checked={notifications.bookingUpdates}
                onCheckedChange={(checked: boolean) => handleNotificationChange('bookingUpdates', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Host Messages</p>
                <p className="text-xs text-gray-500">Messages from your hosts</p>
              </div>
              <Switch
                checked={notifications.hostMessages}
                onCheckedChange={(checked: boolean) => handleNotificationChange('hostMessages', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Reviews</p>
                <p className="text-xs text-gray-500">When someone leaves you a review</p>
              </div>
              <Switch
                checked={notifications.reviews}
                onCheckedChange={(checked: boolean) => handleNotificationChange('reviews', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Promotions & Tips</p>
                <p className="text-xs text-gray-500">Special offers and travel tips</p>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked: boolean) => handleNotificationChange('promotions', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPrivacySection = (): JSX.Element => (
    <Card>
      <CardHeader>
        <CardTitle>Privacy & Safety</CardTitle>
        <CardDescription>
          Control who can see your information and how it's used
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Profile Visibility</h4>
          <Select 
            value={privacy.profileVisibility} 
            onValueChange={(value: string) => handlePrivacyChange('profileVisibility', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" value={privacy.profileVisibility} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
              <SelectItem value="members">Members only - Only registered users</SelectItem>
              <SelectItem value="private">Private - Only you can see your profile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Show Email Address</p>
                <p className="text-xs text-gray-500">Allow others to see your email on your profile</p>
              </div>
              <Switch
                checked={privacy.showEmail}
                onCheckedChange={(checked: boolean) => handlePrivacyChange('showEmail', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Show Phone Number</p>
                <p className="text-xs text-gray-500">Allow others to see your phone number</p>
              </div>
              <Switch
                checked={privacy.showPhone}
                onCheckedChange={(checked: boolean) => handlePrivacyChange('showPhone', checked)}
              />
            </div>
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Data Protection:</strong> We never sell your personal information to third parties. 
            Learn more about how we protect your privacy in our Privacy Policy.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const renderSection = (): JSX.Element => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'privacy':
        return renderPrivacySection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {settingsSections.map((section: SettingsSection) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-none transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="truncate">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserSettingsPage;