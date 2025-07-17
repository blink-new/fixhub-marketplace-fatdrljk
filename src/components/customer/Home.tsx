import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Search, MapPin, Star, TrendingUp, Users, CheckCircle } from 'lucide-react'
import { serviceCategories } from '../../data/categories'

export function CustomerHome() {
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { label: 'Active Providers', value: '2,500+', icon: Users },
    { label: 'Jobs Completed', value: '15,000+', icon: CheckCircle },
    { label: 'Average Rating', value: '4.8/5', icon: Star },
    { label: 'Response Time', value: '< 2 hours', icon: TrendingUp }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Find the Perfect
          <span className="text-primary block">Service Provider</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with skilled professionals for all your home and business needs. 
          From repairs to renovations, we've got you covered.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="What service do you need?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-primary"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg">
              Search
            </Button>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <span className="text-gray-600 mr-2">Popular:</span>
          {['Plumbing', 'Electrical', 'Cleaning', 'Moving', 'Painting'].map((term) => (
            <Badge key={term} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
              {term}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Service Categories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {serviceCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          How FixHub Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Post Your Job</h3>
            <p className="text-gray-600">
              Describe what you need done and set your budget. It's free to post!
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Bids</h3>
            <p className="text-gray-600">
              Qualified providers will bid on your job with their best offers.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose & Complete</h3>
            <p className="text-gray-600">
              Select the best provider and get your job done with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-6 opacity-90">
          Post your first job today and connect with skilled professionals in your area.
        </p>
        <Button size="lg" variant="secondary" className="text-primary">
          Post a Job Now
        </Button>
      </div>
    </div>
  )
}