import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Alert, AlertDescription } from '../ui/alert'
import { Loader2, DollarSign, Clock } from 'lucide-react'
import { bidService } from '../../services/database'
import { useAuth } from '../../hooks/useAuth'
import { Database } from '../../lib/supabase'

type Job = Database['public']['Tables']['jobs']['Row']

interface BidModalProps {
  job: Job
  trigger: React.ReactNode
  onBidSubmitted?: () => void
}

export function BidModal({ job, trigger, onBidSubmitted }: BidModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [bidData, setBidData] = useState({
    amount: '',
    message: '',
    estimatedDuration: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const bid = {
        job_id: job.id,
        provider_id: user.id,
        amount: parseFloat(bidData.amount),
        message: bidData.message,
        estimated_duration: bidData.estimatedDuration,
        status: 'pending' as const
      }

      const result = await bidService.createBid(bid)
      
      if (result) {
        setSuccess(true)
        setBidData({
          amount: '',
          message: '',
          estimatedDuration: ''
        })
        onBidSubmitted?.()
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
        }, 2000)
      } else {
        setError('Failed to submit bid. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while submitting your bid.')
      console.error('Error submitting bid:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setBidData({
      amount: '',
      message: '',
      estimatedDuration: ''
    })
    setError(null)
    setSuccess(false)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
        resetForm()
      }
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Bid for "{job.title}"</DialogTitle>
        </DialogHeader>

        {success && (
          <Alert className="mb-4">
            <AlertDescription>
              Bid submitted successfully! The customer will review your proposal.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Your Bid Amount *
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={bidData.amount}
                onChange={(e) => setBidData(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                {job.budget_type === 'hourly' ? '/hr' : 'total'}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Customer's budget: ${job.budget.toLocaleString()}{job.budget_type === 'hourly' ? '/hr' : ''}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Estimated Duration *
            </Label>
            <Input
              id="duration"
              placeholder="e.g., 2-3 days, 1 week, 4 hours"
              value={bidData.estimatedDuration}
              onChange={(e) => setBidData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Proposal Message *</Label>
            <Textarea
              id="message"
              placeholder="Explain your approach, experience, and why you're the right fit for this job..."
              rows={4}
              value={bidData.message}
              onChange={(e) => setBidData(prev => ({ ...prev, message: e.target.value }))}
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Location:</span> {job.location}</p>
              <p><span className="font-medium">Urgency:</span> {job.urgency} priority</p>
              <p><span className="font-medium">Category:</span> {job.category}</p>
              {job.subcategory && (
                <p><span className="font-medium">Subcategory:</span> {job.subcategory}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Bid
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}