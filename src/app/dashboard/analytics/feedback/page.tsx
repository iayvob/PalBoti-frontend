import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { MessageSquare, ArrowLeft, Send } from "lucide-react"
import { Textarea } from "../../../../components/ui/textarea"
import Link from "next/link"

export const metadata = {
  title: "Feedback | Analytics | Smart Warehouse Manager",
  description: "Share your thoughts and feedback on the warehouse management system",
}

export default function FeedbackPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/analytics">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary">System Feedback</h1>
            <p className="text-muted-foreground">Share your thoughts and suggestions for improvement</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Submit Feedback
              </CardTitle>
              <CardDescription>Your feedback helps us improve the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Brief description of your feedback"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select a category</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="improvement">Improvement Suggestion</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium mb-1">
                    Detailed Feedback
                  </label>
                  <Textarea
                    id="feedback"
                    placeholder="Please provide detailed information about your feedback..."
                    className="min-h-[200px]"
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input type="radio" name="priority" value="low" className="mr-2" />
                      Low
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="priority" value="medium" className="mr-2" />
                      Medium
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="priority" value="high" className="mr-2" />
                      High
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>Previously submitted feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <p className="font-medium">Robot Navigation Issue</p>
                  <p className="text-xs text-muted-foreground mb-2">Submitted on April 5, 2025</p>
                  <p className="text-sm">Robot sometimes gets stuck when navigating between zones A and B.</p>
                  <div className="mt-2 text-xs text-primary">Status: Under Review</div>
                </div>
                <div className="border rounded-md p-3">
                  <p className="font-medium">UI Improvement Suggestion</p>
                  <p className="text-xs text-muted-foreground mb-2">Submitted on April 2, 2025</p>
                  <p className="text-sm">Dashboard could benefit from customizable widgets.</p>
                  <div className="mt-2 text-xs text-green-600">Status: Implemented</div>
                </div>
                <div className="border rounded-md p-3">
                  <p className="font-medium">Product Classification Enhancement</p>
                  <p className="text-xs text-muted-foreground mb-2">Submitted on March 28, 2025</p>
                  <p className="text-sm">Add more granular categories for product classification.</p>
                  <div className="mt-2 text-xs text-yellow-600">Status: Planned</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Feedback
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
