"use client"

import { useState, FormEvent } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Users, UserCheck, Calendar, UserMinus, Trash2, AlertCircle, Search, Filter, Mail, ChevronLeft, ChevronRight } from 'lucide-react'

// Mock data for workers
const initialWorkers = [
  { id: 1, name: "Alice Johnson", avatar: "/avatars/alice.jpg", availability: ["Monday", "Tuesday", "Wednesday"], punctuality: 92, suspended: false },
  { id: 2, name: "Bob Smith", avatar: "/avatars/bob.jpg", availability: ["Tuesday", "Thursday", "Friday", "Saturday"], punctuality: 78, suspended: false },
  { id: 3, name: "Charlie Brown", avatar: "/avatars/charlie.jpg", availability: ["Wednesday", "Thursday", "Friday"], punctuality: 95, suspended: false },
  { id: 4, name: "Diana Ross", avatar: "/avatars/diana.jpg", availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], punctuality: 88, suspended: false },
  { id: 5, name: "Ethan Hunt", avatar: "/avatars/ethan.jpg", availability: ["Saturday", "Sunday"], punctuality: 45, suspended: false },
  { id: 6, name: "Fiona Gallagher", avatar: "/avatars/fiona.jpg", availability: ["Monday", "Wednesday", "Friday"], punctuality: 82, suspended: false },
  { id: 7, name: "George Clooney", avatar: "/avatars/george.jpg", availability: ["Tuesday", "Thursday"], punctuality: 91, suspended: false },
  { id: 8, name: "Hannah Montana", avatar: "/avatars/hannah.jpg", availability: ["Wednesday", "Saturday", "Sunday"], punctuality: 76, suspended: false },
  { id: 9, name: "Ian McKellen", avatar: "/avatars/ian.jpg", availability: ["Monday", "Tuesday", "Friday"], punctuality: 97, suspended: false },
  { id: 10, name: "Julia Roberts", avatar: "/avatars/julia.jpg", availability: ["Thursday", "Friday", "Saturday"], punctuality: 85, suspended: false },
]

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function AdminDashboardComponent() {
  const [totalWorkers, setTotalWorkers] = useState(150)
  const [shiftedWorkers, setShiftedWorkers] = useState(120)
  const [availableWorkers, setAvailableWorkers] = useState(100)
  const [unassignedWorkers, setUnassignedWorkers] = useState(30)
  const [workers, setWorkers] = useState(initialWorkers)
  const [searchTerm, setSearchTerm] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([])
  const [punctualityFilter, setPunctualityFilter] = useState({ min: 0, max: 100 })
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false)
  const [punctualityDialogOpen, setPunctualityDialogOpen] = useState(false)
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', role: '' })
  const [addUserConfirmation, setAddUserConfirmation] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [workersPerPage] = useState(5)

  // Suspend worker state
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null)
  const [suspensionDays, setSuspensionDays] = useState("1")
  const [suspensionReason, setSuspensionReason] = useState("")

  // Delete worker state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [workerToDelete, setWorkerToDelete] = useState<number | null>(null)

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    if (score >= 50) return "bg-black"
    return "bg-red-500"
  }

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault()
    filterWorkers()
  }

  const filterWorkers = () => {
    let filteredWorkers = initialWorkers.filter(worker =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (availabilityFilter.length === 0 || availabilityFilter.some(day => worker.availability.includes(day))) &&
      worker.punctuality >= punctualityFilter.min &&
      worker.punctuality <= punctualityFilter.max
    )
    setWorkers(filteredWorkers)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleAvailabilityFilterChange = (day: string) => {
    setAvailabilityFilter(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const applyAvailabilityFilter = () => {
    filterWorkers()
    setAvailabilityDialogOpen(false)
  }

  const applyPunctualityFilter = () => {
    filterWorkers()
    setPunctualityDialogOpen(false)
  }

  const handleAddUser = (e: FormEvent) => {
    e.preventDefault()
    setAddUserConfirmation('success')
    // Note: We're not clearing the newUser state here, so we can use it in the success message
  }

  const closeAddUserDialog = () => {
    setAddUserDialogOpen(false)
    setAddUserConfirmation('')
    setNewUser({ firstName: '', lastName: '', email: '', role: '' })
  }

  // Pagination logic
  const indexOfLastWorker = currentPage * workersPerPage
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage
  const currentWorkers = workers.slice(indexOfFirstWorker, indexOfLastWorker)

  const totalPages = Math.ceil(workers.length / workersPerPage)

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
      setWorkers(prevWorkers =>
        prevWorkers.map(worker =>
          worker.id === selectedWorker
            ? { ...worker, suspended: !worker.suspended }
            : worker
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
    setWorkers(prevWorkers =>
      prevWorkers.map(worker =>
        worker.id === workerId
          ? { ...worker, suspended: false }
          : worker
      )
    )
  }

  // Delete worker logic
  const openDeleteDialog = (workerId: number) => {
    setWorkerToDelete(workerId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteWorker = () => {
    if (workerToDelete !== null) {
      setWorkers(prevWorkers => prevWorkers.filter(worker => worker.id !== workerToDelete))
      setDeleteDialogOpen(false)
      setWorkerToDelete(null)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
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
            <CardTitle className="text-sm font-medium">Shifted Workers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shiftedWorkers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Workers (This week)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableWorkers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Workers</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedWorkers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section for Worker Data */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Worker Data</CardTitle>
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search workers"
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
                    Availability
                    <Dialog open={availabilityDialogOpen} onOpenChange={setAvailabilityDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground rounded-full transition-colors duration-200"
                        >
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Filter by Availability</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <p className="text-sm text-muted-foreground">Select days to show workers available on these days</p>
                          {daysOfWeek.map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={day}
                                checked={availabilityFilter.includes(day)}
                                onCheckedChange={() => handleAvailabilityFilterChange(day)}
                              />
                              <Label htmlFor={day}>{day}</Label>
                            </div>
                          ))}
                        </div>
                        <Button onClick={applyAvailabilityFilter}>Apply Filter</Button>
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
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Filter by Punctuality</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <p className="text-sm text-muted-foreground">Enter minimum and maximum scores to filter workers</p>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="min-score">Min Score:</Label>
                            <Input
                              id="min-score"
                              type="number"
                              value={punctualityFilter.min}
                              onChange={(e) => setPunctualityFilter(prev => ({ ...prev, min: Number(e.target.value) }))}
                              className="w-20"
                            />
                
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="max-score">Max Score:</Label>
                            <Input
                              id="max-score"
                              type="number"
                              value={punctualityFilter.max}
                              onChange={(e) => setPunctualityFilter(prev => ({ ...prev, max: Number(e.target.value) }))}
                              className="w-20"
                            />
                          </div>
                        </div>
                        <Button onClick={applyPunctualityFilter}>Apply Filter</Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableHead>
                <TableHead className="w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentWorkers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={worker.avatar} alt={worker.name} />
                      <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{worker.name}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {worker.availability.slice(0, 2).map((day, index) => (
                        <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                          {day.slice(0, 2)}
                        </span>
                      ))}
                      {worker.availability.length > 2 && (
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                          +{worker.availability.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-gray-300">
                        <div
                          className={`h-full ${getProgressBarColor(worker.punctuality)}`}
                          style={{ width: `${worker.punctuality}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{worker.punctuality}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {worker.suspended ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUnsuspendWorker(worker.id)}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Unsuspend
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openSuspendDialog(worker.id)}
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Suspend
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => openDeleteDialog(worker.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
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
                <SelectTrigger className="w-[180px]">
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

      {/* Delete Worker Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Worker</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this worker? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteWorker}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Add New User Button */}
      <div className="fixed right-8 bottom-8">
        <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group" size="icon">
              <UserPlus className="h-6 w-6" />
              <span className="sr-only">Add User</span>
              <span className="absolute right-full mr-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Add User
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            {addUserConfirmation === 'success' ? (
              <div className="py-6">
                <div className="text-center space-y-4">
                  <UserCheck className="mx-auto h-12 w-12 text-green-500" />
                  <p className="text-lg font-semibold">Worker Added Successfully!</p>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <span className="font-medium text-primary">{newUser.firstName} {newUser.lastName}</span> has been added as a new {newUser.role.toLowerCase()}.
                    </p>
                    <p>
                      A unique sign-up link has been sent to:
                      <br />
                      <span className="font-medium text-primary">{newUser.email}</span>
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-6" onClick={closeAddUserDialog}>Close</Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-4">
                    <UserPlus className="h-8 w-8 text-white" />
                  </div>
                  <DialogTitle className="text-2xl font-bold text-center">Add New Worker</DialogTitle>
                </div>
                <div className="w-full border-t border-gray-200 mb-6"></div>
                <form onSubmit={handleAddUser} className="space-y-6">
                  <div className="space-y-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      You are adding a new worker to the pool. They will receive an email inviting them to join.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Client">Client</SelectItem>
                          <SelectItem value="Shift Leader">Shift Leader</SelectItem>
                          <SelectItem value="Gateman">Gateman</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full" disabled={!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role}>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}