import { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Star,
  MessageSquare,
  ArrowLeft
} from 'lucide-react'
import { jobService, bidService } from '../../services/database'
import { useAuth } from '../../hooks/useAuth'
import { Database } from '../../lib/supabase'
import { BidModal } from '../provider/BidModal'
import { serviceCategories } from '../../data/categories'

type Job = Database['public']['Tables']['jobs']['Row'] & {
  profiles?: {
    id: string
    display_name: string | null
    email: string
    avatar_url: string | null
  }
}

type Bid = Database['public']['Tables']['bids']['Row'] & {
  profiles?: {
    id: string
    display_name: string | null
    email: string
    avatar_url: string | null
  }
  service_providers?: {
    rating: number
    review_count: number
    completed_jobs: number
    verified: boolean
  }
}

interface JobDetailsProps {
  jobId: string
  onBack: () => void
}

export function JobDetails({ jobId, onBack }: JobDetailsProps) {
  const { user, profile } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJobDetails()
  }, [jobId, fetchJobDetails])

  const fetchJobDetails = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [jobData, bidsData] = await Promise.all([
        jobService.getJob(jobId),
        bidService.getBidsForJob(jobId)
      ])

      if (jobData) {
        setJob(jobData as Job)
        setBids(bidsData as Bid[])
      } else {
        setError('Job not found')
      }
    } catch (err) {
      setError('Failed to load job details')
      console.error('Error fetching job details:', err)
    } finally {
      setLoading(false)
    }
  }, [jobId])

  const handleAcceptBid = async (bidId: string) => {
    try {
      await bidService.updateBid(bidId, { status: 'accepted' })
      await jobService.updateJob(jobId, { status: 'in_progress' })
      fetchJobDetails()
    } catch (err) {
      console.error('Error accepting bid:', err)
    }
  }

  const handleRejectBid = async (bidId: string) => {
    try {
      await bidService.updateBid(bidId, { status: 'rejected' })
      fetchJobDetails()
    } catch (err) {
      console.error('Error rejecting bid:', err)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isCustomer = profile?.user_type === 'customer'
  const isJobOwner = user?.id === job?.customer_id
  const canBid = !isCustomer && job?.status === 'open' && !isJobOwner
  const userHasBid = bids.some(bid => bid.provider_id === user?.id)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Job not found'}</AlertDescription>
        </Alert>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button onClick={onBack} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Button>

      {/* Job Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {job.profiles?.display_name || 'Anonymous'}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {formatTimeAgo(job.created_at)}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(job.status)}>
                {job.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className={getUrgencyColor(job.urgency)}>
                {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)} Priority
              </Badge>
              <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
                <DollarSign className="h-5 w-5" />
                {job.budget.toLocaleString()}
                {job.budget_type === 'hourly' && '/hr'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">
              {serviceCategories.find(cat => cat.id === job.category)?.name || job.category}
            </Badge>
            {job.subcategory && (
              <Badge variant="outline" className="text-xs">
                {job.subcategory}
              </Badge>
            )}
          </div>

          {canBid && !userHasBid && (
            <BidModal 
              job={job} 
              trigger={<Button size="lg">Submit Bid</Button>}
              onBidSubmitted={fetchJobDetails}
            />
          )}

          {userHasBid && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You have already submitted a bid for this job.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Job Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>

          {job.requirements && job.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Bids Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Bids ({bids.length})
                {isJobOwner && bids.length > 0 && (
                  <span className="text-sm font-normal text-gray-600">
                    Average: ${(bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length).toFixed(0)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bids.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bids yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {job.status === 'open' ? 'Be the first to bid!' : 'This job is no longer accepting bids.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div key={bid.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={bid.profiles?.avatar_url || ''} />
                            <AvatarFallback>
                              {bid.profiles?.display_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {bid.profiles?.display_name || 'Anonymous'}
                            </h4>
                            {bid.service_providers && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {bid.service_providers.rating}/5
                                </div>
                                <span>•</span>
                                <span>{bid.service_providers.completed_jobs} jobs completed</span>
                                {bid.service_providers.verified && (
                                  <>
                                    <span>•</span>
                                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ${bid.amount.toLocaleString()}
                            {job.budget_type === 'hourly' && '/hr'}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {bid.estimated_duration}
                          </div>
                          <Badge 
                            className={
                              bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{bid.message}</p>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Submitted {formatTimeAgo(bid.created_at)}
                        </span>
                        
                        {isJobOwner && bid.status === 'pending' && job.status === 'open' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRejectBid(bid.id)}
                            >
                              Decline
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleAcceptBid(bid.id)}
                            >
                              Accept Bid
                            </Button>
                          </div>
                        )}

                        {!isJobOwner && (
                          <Button size="sm" variant="outline">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Budget</h4>
                <p className="text-2xl font-bold text-green-600">
                  ${job.budget.toLocaleString()}
                  {job.budget_type === 'hourly' && '/hr'}
                </p>
                <p className="text-sm text-gray-600 capitalize">{job.budget_type} price</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                <p className="text-gray-700">{job.location}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Timeline</h4>
                <p className="text-gray-700 capitalize">{job.urgency} priority</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                <p className="text-gray-700">
                  {serviceCategories.find(cat => cat.id === job.category)?.name || job.category}
                </p>
                {job.subcategory && (
                  <p className="text-sm text-gray-600">{job.subcategory}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          {job.profiles && (
            <Card>
              <CardHeader>
                <CardTitle>About the Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={job.profiles.avatar_url || ''} />
                    <AvatarFallback>
                      {job.profiles.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {job.profiles.display_name || 'Anonymous'}
                    </h4>
                    <p className="text-sm text-gray-600">Customer</p>
                  </div>
                </div>
                
                {!isJobOwner && (
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}