import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  DollarSign, 
  Briefcase, 
  Star, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
  Search
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { bidService, providerService } from '../../services/database'

export function ProviderDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeBids: 0,
    completedJobs: 0,
    rating: 0,
    responseRate: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

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

  const loadDashboardData = useCallback(async () => {
    if (!user) return

    try {
      // Load provider profile
      const provider = await providerService.getProvider(user.id)
      
      // Load bids
      const bids = await bidService.getBidsForProvider(user.id)

      // Calculate stats
      const activeBids = bids.filter(bid => bid.status === 'pending').length
      const acceptedBids = bids.filter(bid => bid.status === 'accepted')
      const totalEarnings = acceptedBids.reduce((sum, bid) => sum + bid.amount, 0)

      setStats({
        totalEarnings,
        activeBids,
        completedJobs: provider?.completed_jobs || 0,
        rating: provider?.rating || 0,
        responseRate: 95 // Mock for now
      })

      // Create recent activity from bids
      const recentBids = bids.slice(0, 3).map(bid => ({
        id: bid.id,
        type: bid.status === 'accepted' ? 'bid_accepted' : 'bid_submitted',
        title: bid.jobs?.title || 'Job',
        amount: bid.amount,
        time: formatTimeAgo(bid.created_at)
      }))

      setRecentActivity(recentBids)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user, formatTimeAgo])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user, loadDashboardData])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bid_accepted': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'new_message': return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'job_completed': return <DollarSign className="h-4 w-4 text-green-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's an overview of your business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Bids</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBids}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rating}/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent activity</p>
                    <p className="text-sm text-gray-400 mt-1">Start bidding on jobs to see activity here</p>
                  </div>
                ) : (
                  recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        {activity.content && (
                          <p className="text-sm text-gray-600 mt-1">{activity.content}</p>
                        )}
                        {activity.amount && (
                          <p className="text-sm font-medium text-green-600 mt-1">
                            +${activity.amount}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Browse New Jobs
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Check Messages
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Performance Tips */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Performance Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Respond Quickly</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Fast responses increase your chances of winning bids by 40%
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Complete Your Profile</p>
                  <p className="text-xs text-green-700 mt-1">
                    Profiles with photos get 3x more views
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">Get Reviews</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Ask satisfied customers to leave reviews
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}