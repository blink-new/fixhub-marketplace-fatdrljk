import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import { AuthForm } from './components/auth/AuthForm'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { CustomerHome } from './components/customer/Home'
import { PostJob } from './components/customer/PostJob'
import { BrowseJobs } from './components/provider/BrowseJobs'
import { ProviderDashboard } from './components/provider/Dashboard'

function AppContent() {
  const { user, profile, loading } = useAuth()
  const [userType, setUserType] = useState<'customer' | 'provider'>('customer')
  const [activeTab, setActiveTab] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (profile?.user_type) {
      setUserType(profile.user_type)
    }
  }, [profile])

  useEffect(() => {
    // Set default active tab based on user type
    if (userType === 'customer') {
      setActiveTab('home')
    } else {
      setActiveTab('dashboard')
    }
  }, [userType])

  const handleUserTypeChange = (type: 'customer' | 'provider') => {
    setUserType(type)
    setSidebarOpen(false)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const renderContent = () => {
    if (userType === 'customer') {
      switch (activeTab) {
        case 'home':
          return <CustomerHome />
        case 'post-job':
          return <PostJob />
        case 'my-jobs':
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">My Jobs</h2>
                <p className="text-gray-600">View and manage your posted jobs</p>
                <p className="text-sm text-gray-500 mt-4">Coming soon...</p>
              </div>
            </div>
          )
        case 'messages':
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
                <p className="text-gray-600">Chat with service providers</p>
                <p className="text-sm text-gray-500 mt-4">Coming soon...</p>
              </div>
            </div>
          )
        case 'reviews':
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews</h2>
                <p className="text-gray-600">Manage your reviews and ratings</p>
                <p className="text-sm text-gray-500 mt-4">Coming soon...</p>
              </div>
            </div>
          )
        default:
          return <CustomerHome />
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <ProviderDashboard />
        case 'browse-jobs':
          return <BrowseJobs />
        case 'my-bids':
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">My Bids</h2>
                <p className="text-gray-600">Track your submitted bids</p>
                <p className="text-sm text-gray-500 mt-4">Coming soon...</p>
              </div>
            </div>
          )
        case 'active-jobs':
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Active Jobs</h2>
                <p className="text-gray-600">Manage your ongoing projects</p>
                <p className="text-sm text-gray-500 mt-4">Coming soon...</p>
              </div>
            </div>
          )
        case 'messages':
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
                <p className="text-gray-600">Chat with customers</p>
                <p className="text-sm text-gray-500 mt-4">Coming soon...</p>
              </div>
            </div>
          )
        case 'calendar':
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Calendar</h2>
                <p className="text-gray-600">Schedule and manage appointments</p>
                <p className="text-sm text-gray-500 mt-4">Coming soon...</p>
              </div>
            </div>
          )
        case 'profile':
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile</h2>
                <p className="text-gray-600">Manage your professional profile</p>
                <p className="text-sm text-gray-500 mt-4">Coming soon...</p>
              </div>
            </div>
          )
        default:
          return <ProviderDashboard />
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FixHub...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  // If user exists but no profile, create a default profile
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        profile={profile}
        userType={userType}
        onUserTypeChange={handleUserTypeChange}
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      <div className="flex">
        <Sidebar
          userType={userType}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 lg:ml-64">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App