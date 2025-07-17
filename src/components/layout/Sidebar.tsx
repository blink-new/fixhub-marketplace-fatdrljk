import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Home, 
  Search, 
  Briefcase, 
  MessageSquare, 
  Star, 
  Settings, 
  Plus,
  DollarSign,
  Calendar,
  User
} from 'lucide-react'

interface SidebarProps {
  userType: 'customer' | 'provider'
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ userType, activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const customerTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'post-job', label: 'Post a Job', icon: Plus },
    { id: 'my-jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 2 },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ]

  const providerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'browse-jobs', label: 'Browse Jobs', icon: Search },
    { id: 'my-bids', label: 'My Bids', icon: DollarSign },
    { id: 'active-jobs', label: 'Active Jobs', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 2 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  const tabs = userType === 'customer' ? customerTabs : providerTabs

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {userType === 'customer' ? 'Customer Portal' : 'Provider Portal'}
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    onTabChange(tab.id)
                    onClose()
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {tab.label}
                  {tab.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}