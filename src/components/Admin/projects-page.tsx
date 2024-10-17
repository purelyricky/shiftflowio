"use client"

import { useState, FormEvent } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Users, UserCheck, PieChart, TrendingUp, Search, AlertCircle, ChevronLeft, ChevronRight, Star, Mail, UserPlus, Filter, UserMinus, Trash2 } from 'lucide-react'

// Mock data for projects
const initialProjects = [
  { id: 1, name: "Alice Johnson", avatar: "/avatars/alice.jpg", shiftsCompleted: 45, punctuality: 92, earnings: 2250, suspended: false, leaderFeedback: 4, mailboxCount: 2, notes: [
    { id: 1, leader: "John Doe", leaderAvatar: "/avatars/john.jpg", date: "2024-10-01", content: "Alice has been performing exceptionally well. Her attention to detail is commendable." },
    { id: 2, leader: "Jane Smith", leaderAvatar: "/avatars/jane.jpg", date: "2024-10-02", content: "Great team player. Always willing to help others and take on additional responsibilities." }
  ], role: "worker" },
  { id: 2, name: "Bob Smith", avatar: "/avatars/bob.jpg", shiftsCompleted: 38, punctuality: 78, earnings: 1900, suspended: false, leaderFeedback: 3, mailboxCount: 0, notes: [], role: "worker" },
  { id: 3, name: "Charlie Brown", avatar: "/avatars/charlie.jpg", shiftsCompleted: 52, punctuality: 95, earnings: 2600, suspended: false, leaderFeedback: 5, mailboxCount: 1, notes: [
    { id: 3, leader: "Emily Johnson", leaderAvatar: "/avatars/emily.jpg", date: "2024-10-01", content: "Charlie consistently exceeds expectations. His work ethic is inspiring to the whole team." }
  ], role: "shift-leader" },
  { id: 4, name: "Diana Ross", avatar: "/avatars/diana.jpg", shiftsCompleted: 41, punctuality: 88, earnings: 2050, suspended: false, leaderFeedback: 4, mailboxCount: 3, notes: [
    { id: 4, leader: "Michael Brown", leaderAvatar: "/avatars/michael.jpg", date: "2024-09-30", content: "Diana has shown significant improvement in her time management skills." },
    { id: 5, leader: "Sarah Lee", leaderAvatar: "/avatars/sarah.jpg", date: "2024-10-01", content: "Excellent communication skills. Diana ensures all team members are well-informed." },
    { id: 6, leader: "John Doe", leaderAvatar: "/avatars/john.jpg", date: "2024-10-02", content: "Diana's creative problem-solving abilities have been a great asset to the team." }
  ], role: "worker" },
  { id: 5, name: "Ethan Hunt", avatar: "/avatars/ethan.jpg", shiftsCompleted: 30, punctuality: 85, earnings: 1500, suspended: false, leaderFeedback: 2, mailboxCount: 1, notes: [
    { id: 7, leader: "Jane Smith", leaderAvatar: "/avatars/jane.jpg", date: "2024-10-01", content: "Ethan needs to work on his punctuality. He has been late to several shifts this week." }
  ], role: "client" },
]

export function ProjectsPage() {
  const [totalWorkers, setTotalWorkers] = useState(150)
  const [totalLeaders, setTotalLeaders] = useState(15)
  const [punctualityStats, setPunctualityStats] = useState(88)
  const [demandCoverage, setDemandCoverage] = useState(75)
  const [projects, setProjects] = useState(initialProjects)
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [projectsPerPage] = useState(5)

  // Filter states
  const [shiftsFilter, setShiftsFilter] = useState({ min: 0, max: 100 })
  const [earningsFilter, setEarningsFilter] = useState({ min: 0, max: 5000 })
  const [punctualityFilter, setPunctualityFilter] = useState({ min: 0, max: 100 })
  const [leaderFeedbackFilter, setLeaderFeedbackFilter] = useState({ min: 0, max: 5, type: 'rating' })

  // Filter modal states
  const [shiftsDialogOpen, setShiftsDialogOpen] = useState(false)
  const [earningsDialogOpen, setEarningsDialogOpen] = useState(false)
  const [punctualityDialogOpen, setPunctualityDialogOpen] = useState(false)
  const [leaderFeedbackDialogOpen, setLeaderFeedbackDialogOpen] = useState(false)

  // Suspend worker state
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null)
  const [suspensionDays, setSuspensionDays] = useState("1")
  const [suspensionReason, setSuspensionReason] = useState("")

  // Remove worker state
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [workerToRemove, setWorkerToRemove] = useState<number | null>(null)

  // Notes modal state
  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [selectedWorkerNotes, setSelectedWorkerNotes] = useState<typeof initialProjects[0] | null>(null)

  // Add User state
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', role: '' })
  const [addByEmail, setAddByEmail] = useState(false)

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    if (score >= 50) return "bg-black"
    return "bg-red-500"
  }

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault()
    filterProjects()
  }

  const filterProjects = () => {
    let filteredProjects = initialProjects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      project.shiftsCompleted >= shiftsFilter.min &&
      project.shiftsCompleted <= shiftsFilter.max &&
      project.earnings >= earningsFilter.min &&
      project.earnings <= earningsFilter.max &&
      project.punctuality >= punctualityFilter.min &&
      project.punctuality <= punctualityFilter.max &&
      (leaderFeedbackFilter.type === 'rating' 
        ? (project.leaderFeedback >= leaderFeedbackFilter.min && project.leaderFeedback <= leaderFeedbackFilter.max)
        : (project.mailboxCount >= leaderFeedbackFilter.min && project.mailboxCount <= leaderFeedbackFilter.max))
    )
    setProjects(filteredProjects)
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject)

  const totalPages = Math.ceil(projects.length / projectsPerPage)

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  // Suspend worker logic
  const openSuspendDialog = (workerId: number) => {
    setSelectedWorker(workerId)
    setSuspendDialogOpen(true)
  }

  const handleSuspendWorker = () => {
    if (selectedWorker !== null) {
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === selectedWorker
            ? { ...project, suspended: !project.suspended }
            : project
        )
      )
      setSuspendDialogOpen(false)
      setSelectedWorker(null)
      setSuspensionDays("1")
      setSuspensionReason("")
    }
  }

  // Unsuspend worker logic
  const handleUnsuspendWorker = (workerId: number) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === workerId
          ? { ...project, suspended: false }
          : project
      )
    )
  }

  // Remove worker logic
  const openRemoveDialog = (workerId: number) => {
    setWorkerToRemove(workerId)
    setRemoveDialogOpen(true)
  }

  const handleRemoveWorker = () => {
    if (workerToRemove !== null) {
      setProjects(prevProjects => prevProjects.filter(project => project.id !== workerToRemove))
      setRemoveDialogOpen(false)
      setWorkerToRemove(null)
    }
  }

  // Notes logic
  const openNotesDialog = (worker: typeof initialProjects[0]) => {
    setSelectedWorkerNotes(worker)
    setNotesDialogOpen(true)
  }

  const handleDeleteNote = (noteId: number) => {
    if (selectedWorkerNotes) {
      const updatedNotes = selectedWorkerNotes.notes.filter(note => note.id !== noteId)
      setSelectedWorkerNotes({ ...selectedWorkerNotes, notes: updatedNotes })
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === selectedWorkerNotes.id
            ? { ...project, notes: updatedNotes, mailboxCount: updatedNotes.length }
            : project
        )
      )
    }
  }

  // Add User logic
  const handleAddUser = () => {
    const newProject = {
      id: projects.length + 1,
      name: addByEmail ? newUser.email.split('@')[0] : `${newUser.firstName} ${newUser.lastName}`,
      avatar: "/placeholder.svg?height=40&width=40",
      shiftsCompleted: 0,
      punctuality: 100,
      earnings: 0,
      suspended: false,
      leaderFeedback: 0,
      mailboxCount: 0,
      notes: [],
      role: newUser.role
    }
    setProjects([...projects, newProject])
    setAddUserDialogOpen(false)
    setNewUser({ firstName: '', lastName: '', email: '', role: '' })
    setAddByEmail(false)
  }

  const isAddUserFormValid = () => {
    if (addByEmail) {
      return newUser.email.includes('@') && newUser.email.includes('.') && newUser.role !== ''
    } else {
      return newUser.firstName.trim() !== '' && newUser.lastName.trim() !== '' && newUser.role !== ''
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">Projects Dashboard</h1>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leaders</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeaders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Punctuality Stats</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{punctualityStats}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Coverage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{demandCoverage}%</div>
              <Progress value={demandCoverage} className="w-[60%]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section for Projects Data */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Projects Data</CardTitle>
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search projects"
                  
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-2 w-64 h-9 text-sm"
                />
              </div>
              <Button type="submit" size="sm">Search</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    Shifts Completed
                    <Dialog open={shiftsDialogOpen} onOpenChange={setShiftsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground rounded-full transition-colors duration-200"
                        >
                          <Filter className="h-4 w-4" />
                          <span className="sr-only">Filter shifts completed</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Filter Shifts Completed</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <p className="text-sm text-muted-foreground">Set the minimum and maximum number of shifts completed to filter the workers.</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="min-shifts">Minimum Shifts</Label>
                              <Input
                                id="min-shifts"
                                type="number"
                                value={shiftsFilter.min}
                                onChange={(e) => setShiftsFilter(prev => ({ ...prev, min: Number(e.target.value) }))}
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="max-shifts">Maximum Shifts</Label>
                              <Input
                                id="max-shifts"
                                type="number"
                                value={shiftsFilter.max}
                                onChange={(e) => setShiftsFilter(prev => ({ ...prev, max: Number(e.target.value) }))}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => { filterProjects(); setShiftsDialogOpen(false); }}>Apply Filter</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    Punctuality
                    <Dialog open={punctualityDialogOpen} onOpenChange={setPunctualityDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground rounded-full transition-colors duration-200"
                        >
                          <Filter className="h-4 w-4" />
                          <span className="sr-only">Filter punctuality</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Filter Punctuality</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <p className="text-sm text-muted-foreground">Set the minimum and maximum punctuality percentage to filter the workers.</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="min-punctuality">Minimum Punctuality</Label>
                              <Input
                                id="min-punctuality"
                                type="number"
                                value={punctualityFilter.min}
                                onChange={(e) => setPunctualityFilter(prev => ({ ...prev, min: Number(e.target.value) }))}
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="max-punctuality">Maximum Punctuality</Label>
                              <Input
                                id="max-punctuality"
                                type="number"
                                value={punctualityFilter.max}
                                onChange={(e) => setPunctualityFilter(prev => ({ ...prev, max: Number(e.target.value) }))}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => { filterProjects(); setPunctualityDialogOpen(false); }}>Apply Filter</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    Earnings
                    <Dialog open={earningsDialogOpen} onOpenChange={setEarningsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground rounded-full transition-colors duration-200"
                        >
                          <Filter className="h-4 w-4" />
                          <span className="sr-only">Filter earnings</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Filter Earnings</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <p className="text-sm text-muted-foreground">Set the minimum and maximum earnings to filter the workers.</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="min-earnings">Minimum Earnings</Label>
                              <Input
                                id="min-earnings"
                                type="number"
                                value={earningsFilter.min}
                                onChange={(e) => setEarningsFilter(prev => ({ ...prev, min: Number(e.target.value) }))}
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="max-earnings">Maximum Earnings</Label>
                              <Input
                                id="max-earnings"
                                type="number"
                                value={earningsFilter.max}
                                onChange={(e) => setEarningsFilter(prev => ({ ...prev, max: Number(e.target.value) }))}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => { filterProjects(); setEarningsDialogOpen(false); }}>Apply Filter</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    Leader Feedback
                    <Dialog open={leaderFeedbackDialogOpen} onOpenChange={setLeaderFeedbackDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground rounded-full transition-colors duration-200"
                        >
                          <Filter className="h-4 w-4" />
                          <span className="sr-only">Filter leader feedback</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Filter Leader Feedback</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="feedback-type">Filter by:</Label>
                            <Select
                              value={leaderFeedbackFilter.type}
                              onValueChange={(value) => setLeaderFeedbackFilter(prev => ({ ...prev, type: value as 'rating' | 'notes' }))}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rating">Rating</SelectItem>
                                <SelectItem value="notes">Number of Notes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Set the minimum and maximum {leaderFeedbackFilter.type === 'rating' ? 'rating' : 'number of notes'} to filter the workers.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="min-feedback">Minimum</Label>
                              <Input
                                id="min-feedback"
                                type="number"
                                value={leaderFeedbackFilter.min}
                                onChange={(e) => setLeaderFeedbackFilter(prev => ({ ...prev, min: Number(e.target.value) }))}
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="max-feedback">Maximum</Label>
                              <Input
                                id="max-feedback"
                                type="number"
                                value={leaderFeedbackFilter.max}
                                onChange={(e) => setLeaderFeedbackFilter(prev => ({ ...prev, max: Number(e.target.value) }))}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => { filterProjects(); setLeaderFeedbackDialogOpen(false); }}>Apply Filter</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableHead>
                <TableHead className="w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={project.avatar} alt={project.name} />
                      <AvatarFallback>{project.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{project.name}</span>
                  </TableCell>
                  <TableCell>{project.shiftsCompleted}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-gray-300">
                        <div
                          className={`h-full ${getProgressBarColor(project.punctuality)}`}
                          style={{ width: `${project.punctuality}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{project.punctuality}%</span>
                    </div>
                  </TableCell>
                  <TableCell>${project.earnings}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= project.leaderFeedback ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => openNotesDialog(project)}
                        className="relative focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                        aria-label={`View ${project.mailboxCount} notes for ${project.name}`}
                      >
                        <Mail className="h-5 w-5 text-blue-500 transition-colors duration-200 hover:text-blue-600" />
                        {project.mailboxCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {project.mailboxCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {project.suspended ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUnsuspendWorker(project.id)}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Unsuspend
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openSuspendDialog(project.id)}
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Suspend
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => openRemoveDialog(project.id)}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <Button
              onClick={prevPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suspend Worker Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Suspend Worker</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              You are about to suspend the selected worker. Please specify the duration and reason for suspension.
            </p>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suspensionDays" className="text-right">
                Suspension Days
              </Label>
              <Select value={suspensionDays} onValueChange={setSuspensionDays}>
                <SelectTrigger className="w-[180px] col-span-3">
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suspensionReason" className="text-right">
                Reason
              </Label>
              <Textarea
                id="suspensionReason"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                className="col-span-3"
                placeholder="Enter reason for suspension"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSuspendWorker}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Worker Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Worker</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove this worker? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveWorker}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Notes for {selectedWorkerNotes?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-grow mt-4 -mx-6 px-6">
            <div className="space-y-4">
              {selectedWorkerNotes?.notes.map((note) => (
                <div key={note.id} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={note.leaderAvatar} alt={note.leader} />
                        <AvatarFallback>{note.leader.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{note.leader}</span>
                    </div>
                    <span className="text-xs text-gray-500">{note.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{note.content}</p>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete note</span>
                    </Button>
                  </div>
                </div>
              ))}
              {selectedWorkerNotes?.notes.length === 0 && (
                <p className="text-center text-gray-500 py-4">No notes available for this worker.</p>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button onClick={() => setNotesDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Worker</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="add-by-email">Add by Email</Label>
              <Switch
                id="add-by-email"
                checked={addByEmail}
                onCheckedChange={setAddByEmail}
              />
            </div>
            {addByEmail ? (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstName" className="text-right">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastName" className="text-right">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="shift-leader">Shift Leader</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddUser} disabled={!isAddUserFormValid()}>
              Add Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Add New User Button */}
      <div className="fixed right-8 bottom-8">
        <Button 
          className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group" 
          size="icon"
          onClick={() => setAddUserDialogOpen(true)}
        >
          <UserPlus className="h-6 w-6" />
          <span className="sr-only">Add User</span>
          <span className="absolute right-full mr-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Add User
          </span>
        </Button>
      </div>
    </div>
  )
}