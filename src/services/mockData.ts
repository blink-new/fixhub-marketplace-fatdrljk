import { Job, Bid } from '../types'

// Mock data service to replace database calls temporarily
class MockDataService {
  private storageKey = 'fixhub-data'

  private getData() {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : { jobs: [], bids: [] }
  }

  private saveData(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  // Generate unique ID
  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }

  // Jobs methods
  async createJob(jobData: Omit<Job, 'id'>): Promise<Job> {
    const data = this.getData()
    const job: Job = {
      ...jobData,
      id: this.generateId()
    }
    data.jobs.push(job)
    this.saveData(data)
    return job
  }

  async getJobs(filters?: { status?: string }): Promise<Job[]> {
    const data = this.getData()
    let jobs = data.jobs || []
    
    if (filters?.status) {
      jobs = jobs.filter((job: Job) => job.status === filters.status)
    }
    
    // Sort by createdAt desc
    return jobs.sort((a: Job, b: Job) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  async getJobById(id: string): Promise<Job | null> {
    const data = this.getData()
    return data.jobs.find((job: Job) => job.id === id) || null
  }

  // Bids methods
  async createBid(bidData: Omit<Bid, 'id'>): Promise<Bid> {
    const data = this.getData()
    const bid: Bid = {
      ...bidData,
      id: this.generateId()
    }
    data.bids.push(bid)
    this.saveData(data)
    return bid
  }

  async getBids(filters?: { providerId?: string; jobId?: string }): Promise<Bid[]> {
    const data = this.getData()
    let bids = data.bids || []
    
    if (filters?.providerId) {
      bids = bids.filter((bid: Bid) => bid.providerId === filters.providerId)
    }
    
    if (filters?.jobId) {
      bids = bids.filter((bid: Bid) => bid.jobId === filters.jobId)
    }
    
    // Sort by createdAt desc
    return bids.sort((a: Bid, b: Bid) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  async getBidById(id: string): Promise<Bid | null> {
    const data = this.getData()
    return data.bids.find((bid: Bid) => bid.id === id) || null
  }

  // Initialize with some sample data if empty
  initializeSampleData() {
    const data = this.getData()
    
    if (data.jobs.length === 0) {
      const sampleJobs: Job[] = [
        {
          id: 'job_1',
          customerId: 'customer_1',
          title: 'Fix Kitchen Faucet Leak',
          description: 'My kitchen faucet has been leaking for a week. Need someone to fix it ASAP. The leak is coming from the base of the faucet.',
          category: 'plumbing',
          subcategory: 'Faucet Repair',
          budget: 150,
          budgetType: 'fixed',
          location: 'San Francisco, CA',
          urgency: 'high',
          status: 'open',
          requirements: ['Licensed plumber', 'Own tools'],
          images: [],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'job_2',
          customerId: 'customer_2',
          title: 'Living Room Painting',
          description: 'Need to paint my living room (12x15 feet). Walls are currently white, want to change to light gray. All furniture can be moved.',
          category: 'painting',
          subcategory: 'Interior Painting',
          budget: 25,
          budgetType: 'hourly',
          location: 'Oakland, CA',
          urgency: 'medium',
          status: 'open',
          requirements: ['Professional painter', 'Bring own supplies'],
          images: [],
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'job_3',
          customerId: 'customer_3',
          title: 'Electrical Outlet Installation',
          description: 'Need 3 new electrical outlets installed in my home office. Already have the outlets, just need installation.',
          category: 'electrical',
          subcategory: 'Outlet Installation',
          budget: 200,
          budgetType: 'fixed',
          location: 'Berkeley, CA',
          urgency: 'low',
          status: 'open',
          requirements: ['Licensed electrician', 'Insured'],
          images: [],
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      data.jobs = sampleJobs
      this.saveData(data)
    }
  }
}

export const mockDataService = new MockDataService()