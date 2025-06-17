"use client";
import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Search,
  ChevronRight,
  ChevronDown,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Book,
  Shield,
  CreditCard,
  Home,
  User,
  Settings,
  Star,
  ExternalLink,
  FileText,
  Video,
  Headphones,
  Globe,
  Zap,
  Users,
  Calendar,
  MapPin,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// TypeScript interfaces
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  created_at: string;
  last_updated: string;
}

interface ContactMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  available: boolean;
  response_time: string;
  action: string;
}

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  articles: number;
  color: string;
}

export default function SupportPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState<boolean>(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: '',
    email: ''
  });
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Mock data - in real app, this would come from API
  const helpCategories: HelpCategory[] = [
    {
      id: 'account',
      title: 'Account & Profile',
      description: 'Managing your account, profile settings, and verification',
      icon: User,
      articles: 15,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'booking',
      title: 'Bookings & Reservations',
      description: 'Help with booking, cancellations, and modifications',
      icon: Calendar,
      articles: 23,
      color: 'bg-green-50 text-green-600'
    },
    {
      id: 'hosting',
      title: 'Hosting',
      description: 'Guide for hosts on listing, pricing, and guest management',
      icon: Home,
      articles: 18,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      id: 'payment',
      title: 'Payments & Billing',
      description: 'Payment methods, billing issues, and refunds',
      icon: CreditCard,
      articles: 12,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      description: 'Trust, safety measures, and reporting concerns',
      icon: Shield,
      articles: 8,
      color: 'bg-red-50 text-red-600'
    },
    {
      id: 'policies',
      title: 'Policies & Guidelines',
      description: 'Community standards, terms of service, and policies',
      icon: FileText,
      articles: 10,
      color: 'bg-gray-50 text-gray-600'
    }
  ];

  const contactMethods: ContactMethod[] = [
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: MessageCircle,
      available: true,
      response_time: 'Usually within 2 minutes',
      action: 'Start Chat'
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Speak directly with a support representative',
      icon: Phone,
      available: true,
      response_time: 'Available 24/7',
      action: 'Call Now'
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us a detailed message about your issue',
      icon: Mail,
      available: true,
      response_time: 'Usually within 24 hours',
      action: 'Send Email'
    },
    {
      id: 'community',
      title: 'Community Forum',
      description: 'Get help from other users and experts',
      icon: Users,
      available: true,
      response_time: 'Community driven',
      action: 'Visit Forum'
    }
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I cancel my booking?',
      answer: 'You can cancel your booking by going to your Trips page, selecting the reservation you want to cancel, and clicking "Cancel reservation". Please note that cancellation policies vary by listing.',
      category: 'booking',
      helpful: 156
    },
    {
      id: '2',
      question: 'How do I verify my identity?',
      answer: 'To verify your identity, go to your Account settings, click on "Verification", and follow the prompts to upload a government-issued ID and take a selfie.',
      category: 'account',
      helpful: 89
    },
    {
      id: '3',
      question: 'When will I receive my payment as a host?',
      answer: 'Payments are typically released 24 hours after guest check-in. The exact timing depends on your selected payout method and can take 1-7 business days to appear in your account.',
      category: 'payment',
      helpful: 203
    },
    {
      id: '4',
      question: 'How do I report a safety concern?',
      answer: 'If you have a safety concern, contact us immediately through our 24/7 safety line or use the "Report" feature in your booking. For emergencies, always contact local emergency services first.',
      category: 'safety',
      helpful: 67
    },
    {
      id: '5',
      question: 'Can I modify my reservation dates?',
      answer: 'You can request to change your reservation dates by going to your booking and selecting "Change reservation". The host will need to approve the changes, and additional fees may apply.',
      category: 'booking',
      helpful: 134
    },
    {
      id: '6',
      question: 'How do I become a Superhost?',
      answer: 'To become a Superhost, you need to meet specific criteria including maintaining a 4.8+ rating, 90%+ response rate, less than 1% cancellation rate, and complete at least 10 stays in the past year.',
      category: 'hosting',
      helpful: 298
    }
  ];

  const recentTickets: SupportTicket[] = [
    {
      id: 'TK-001',
      subject: 'Payment not received for booking',
      category: 'payment',
      priority: 'high',
      status: 'in-progress',
      created_at: '2024-06-10T10:30:00Z',
      last_updated: '2024-06-12T14:22:00Z'
    },
    {
      id: 'TK-002',
      subject: 'Unable to upload verification documents',
      category: 'account',
      priority: 'medium',
      status: 'resolved',
      created_at: '2024-06-08T09:15:00Z',
      last_updated: '2024-06-09T16:45:00Z'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTicketSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessMessage('Your support ticket has been submitted successfully! We\'ll get back to you within 24 hours.');
      setTicketForm({
        subject: '',
        category: '',
        priority: '',
        description: '',
        email: ''
      });
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('Failed to submit ticket. Please try again.');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">How can we help you?</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions, contact our support team, or submit a ticket for personalized assistance.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactMethods.map((method) => (
          <Card key={method.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <method.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{method.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                <p className="text-xs text-green-600 mt-2">{method.response_time}</p>
              </div>
              <Button 
                variant={method.available ? "default" : "secondary"} 
                size="sm" 
                className="w-full"
                disabled={!method.available}
              >
                {method.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="help" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="help">Help Center</TabsTrigger>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
        </TabsList>

        {/* Help Center Tab */}
        <TabsContent value="help" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${category.color}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{category.articles} articles</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Popular Articles
              </CardTitle>
              <CardDescription>
                Most helpful articles from our community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.slice(0, 5).map((faq) => (
                  <div key={faq.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{faq.question}</h4>
                      <p className="text-sm text-gray-600 mt-1">{faq.answer.substring(0, 100)}...</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{faq.helpful} helpful</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="account">Account & Profile</SelectItem>
                <SelectItem value="booking">Bookings</SelectItem>
                <SelectItem value="hosting">Hosting</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="policies">Policies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-700 mb-4">{faq.answer}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Was this helpful?</span>
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Yes
                          </Button>
                          <Button variant="outline" size="sm">
                            <X className="h-4 w-4 mr-1" />
                            No
                          </Button>
                        </div>
                        <span className="text-sm text-gray-500">{faq.helpful} people found this helpful</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter.</p>
            </div>
          )}
        </TabsContent>

        {/* Contact Us Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>
                  Describe your issue and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm({...ticketForm, email: e.target.value})}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={ticketForm.category} onValueChange={(value) => setTicketForm({...ticketForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account & Profile</SelectItem>
                          <SelectItem value="booking">Bookings</SelectItem>
                          <SelectItem value="hosting">Hosting</SelectItem>
                          <SelectItem value="payment">Payments</SelectItem>
                          <SelectItem value="safety">Safety</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm({...ticketForm, priority: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      placeholder="Please provide detailed information about your issue..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmittingTicket}
                  >
                    {isSubmittingTicket ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Ticket
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Other Ways to Reach Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Phone Support</h4>
                      <p className="text-sm text-gray-600">+1 (800) 123-4567</p>
                      <p className="text-xs text-gray-500">Available 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Email Support</h4>
                      <p className="text-sm text-gray-600">support@example.com</p>
                      <p className="text-xs text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MessageCircle className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Live Chat</h4>
                      <p className="text-sm text-gray-600">Available on our website</p>
                      <p className="text-xs text-gray-500">Usually within 2 minutes</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Headquarters</h4>
                      <p className="text-sm text-gray-600">
                        123 Support Street<br />
                        San Francisco, CA 94102<br />
                        United States
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Book className="h-5 w-5 text-gray-500" />
                      <span>User Guide</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-gray-500" />
                      <span>Video Tutorials</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-500" />
                      <span>Community Forum</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-gray-500" />
                      <span>Status Page</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
          
          {errorMessage && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* My Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Support Tickets</h2>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>

          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                        <Badge variant="outline" className="text-xs">
                          {ticket.id}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Category: {ticket.category}</span>
                        <span>Created: {formatDate(ticket.created_at)}</span>
                        <span>Updated: {formatDate(ticket.last_updated)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                        </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {recentTickets.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-600">You haven't submitted any support tickets yet.</p>
              <Button className="mt-4">
                <Send className="h-4 w-4 mr-2" />
                Create Your First Ticket
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <Card className="bg-gray-50">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Still need help?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our support team is available 24/7 to help you with any questions or issues you may have.
              Don't hesitate to reach out through any of our contact methods.
            </p>
            <div className="flex justify-center gap-4">
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}