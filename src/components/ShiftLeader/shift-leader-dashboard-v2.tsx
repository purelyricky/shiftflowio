"use client"

import { useState, useEffect, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, BellIcon, CheckIcon, InfoIcon, StarIcon, XIcon, Users, BarChart2, FileText, Clock } from 'lucide-react'

export function ShiftLeaderDashboardV2() {
  const [leader] = useState({
    name: "John Smith",
    avatar: "/placeholder-avatar.jpg",
    project: "Project A",
    location: "Site 1",
  })

  const [workers, setWorkers] = useState([
    { id: 1, name: "Alice Johnson", avatar: "/placeholder-avatar.jpg", status: "pending", rating: 0, notes: "", clockedIn: null },
    { id: 2, name: "Bob Williams", avatar: "/placeholder-avatar.jpg", status: "pending", rating: 0, notes: "", clockedIn: null },
    { id: 3, name: "Charlie Brown", avatar: "/placeholder-avatar.jpg", status: "pending", rating: 0, notes: "", clockedIn: null },
  ])

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [openDialogId, setOpenDialogId] = useState<number | null>(null)
  const [tempNotes, setTempNotes] = useState("")

  const handleStatusChange = (workerId: number, status: "present" | "late" | "absent") => {
    setWorkers(workers.map(worker => 
      worker.id === workerId ? { ...worker, status } : worker
    ))
    setHasUnsavedChanges(true)
  }

  const handleRatingChange = (workerId: number, rating: number) => {
    setWorkers(workers.map(worker => 
      worker.id === workerId ? { ...worker, rating } : worker
    ))
    setHasUnsavedChanges(true)
  }

  const handleNotesChange = (notes: string) => {
    setTempNotes(notes)
  }

  const handleSaveNotes = (workerId: number) => {
    setWorkers(workers.map(worker => 
      worker.id === workerId ? { ...worker, notes: tempNotes } : worker
    ))
    setHasUnsavedChanges(true)
    setOpenDialogId(null)
    setTempNotes("")
  }

  const handleOpenDialog = (workerId: number) => {
    setOpenDialogId(workerId)
    setTempNotes(workers.find(w => w.id === workerId)?.notes || "")
  }

  const handleSaveChanges = () => {
    // Here you would typically send the updated data to your backend
    toast({
      title: "Changes Saved",
      description: "All changes have been successfully saved.",
    })
    setHasUnsavedChanges(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges) {
        toast({
          title: "Unsaved Changes",
          description: "You have unsaved changes. Please remember to save your work.",
          duration: 5000,
        })
      }
    }, 60000) // Remind every minute

    return () => clearInterval(interval)
  }, [hasUnsavedChanges])

  const attendanceRate = useMemo(() => {
    const presentWorkers = workers.filter(w => w.status === "present" || w.status === "late").length
    return (presentWorkers / workers.length) * 100
  }, [workers])

  const averageRating = useMemo(() => {
    const totalRating = workers.reduce((sum, worker) => sum + worker.rating, 0)
    return totalRating / workers.length
  }, [workers])

  const totalNotesSubmitted = useMemo(() => {
    return workers.filter(w => w.notes.trim() !== "").length
  }, [workers])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm">
        {/* Removed the entire header section */}
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Shift</CardTitle>
            <CardDescription>{leader.project} - {leader.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">{new Date().toLocaleTimeString()}</p>
                <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Expected Workers: {workers.length}</p>
                <p className="text-lg font-semibold">Clocked In Workers: {workers.filter(w => w.clockedIn).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {workers.filter(w => w.status === "present" || w.status === "late").length} out of {workers.length} present or late
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Out of 5 stars
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments Submitted</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNotesSubmitted}</div>
              <p className="text-xs text-muted-foreground">
                Out of {workers.length} workers
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Expected Workers</CardTitle>
            <CardDescription>Mark attendance, rate performance, and leave comments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {workers.map((worker) => (
                <div key={worker.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={worker.avatar} alt={worker.name} />
                    <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">{worker.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Button
                        size="sm"
                        variant={worker.status === "present" ? "default" : "outline"}
                        onClick={() => handleStatusChange(worker.id, "present")}
                      >
                        <CheckIcon className="h-4 w-4 mr-1" /> Present
                      </Button>
                      <Button
                        size="sm"
                        variant={worker.status === "late" ? "secondary" : "outline"}
                        onClick={() => handleStatusChange(worker.id, "late")}
                      >
                        <Clock className="h-4 w-4 mr-1" /> Late
                      </Button>
                      <Button
                        size="sm"
                        variant={worker.status === "absent" ? "destructive" : "outline"}
                        onClick={() => handleStatusChange(worker.id, "absent")}
                      >
                        <XIcon className="h-4 w-4 mr-1" /> Absent
                      </Button>
                    </div>
                    {worker.clockedIn && (
                      <p className="text-sm text-green-600 mt-1">Clocked in at {worker.clockedIn}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRatingChange(worker.id, star)}
                      >
                        <StarIcon
                          className={`h-5 w-5 ${
                            star <= worker.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                  <Dialog open={openDialogId === worker.id} onOpenChange={(open) => open ? handleOpenDialog(worker.id) : setOpenDialogId(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Leave Comment</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Leave Comment for {worker.name}</DialogTitle>
                        <DialogDescription>
                          Add any additional comments about the worker's performance.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        value={tempNotes}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        placeholder="Enter comment here..."
                      />
                      <Button 
                        onClick={() => handleSaveNotes(worker.id)} 
                        disabled={tempNotes.trim() === ""}
                      >
                        Save Comment
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center space-x-2">
          <InfoIcon className="h-5 w-5 text-blue-500" />
          <p className="text-sm text-gray-600">
            Remember to mark workers as present, late, or absent after confirming their status.
          </p>
        </div>
      </main>

      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-700">You have unsaved changes. Don't forget to save before leaving.</p>
          </div>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      )}
    </div>
  )
}
