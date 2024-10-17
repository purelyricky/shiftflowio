"use client"

import { useState, FormEvent, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Clock, AlertTriangle, CheckCircle, Search, ChevronLeft, ChevronRight, Info, MessageSquare, Sliders, Send } from 'lucide-react'

// Updated mock data for attendance (without visible date field)
const initialAttendance = [
  { id: 1, name: "Alice Johnson", avatar: "/avatars/alice.jpg", scheduledCheckIn: "09:00 AM", scheduledCheckOut: "05:30 PM", actualCheckIn: "08:55 AM", actualCheckOut: "05:35 PM", project: "VITESCO DQ QUALITY", status: "Present", date: new Date("2023-10-01") },
  { id: 2, name: "Bob Smith", avatar: "/avatars/bob.jpg", scheduledCheckIn: "09:00 AM", scheduledCheckOut: "05:30 PM", actualCheckIn: "09:15 AM", actualCheckOut: "05:45 PM", project: "Project B", status: "Late", date: new Date("2023-10-02") },
  { id: 3, name: "Charlie Brown", avatar: "/avatars/charlie.jpg", scheduledCheckIn: "09:00 AM", scheduledCheckOut: "05:00 PM", actualCheckIn: "08:55 AM", actualCheckOut: "05:05 PM", project: "Project A", status: "Present", date: new Date("2023-10-03") },
  { id: 4, name: "Diana Ross", avatar: "/avatars/diana.jpg", scheduledCheckIn: "09:00 AM", scheduledCheckOut: "05:30 PM", actualCheckIn: "--", actualCheckOut: "--", project: "Project C", status: "Absent", date: new Date("2023-10-04") },
  { id: 5, name: "Ethan Hunt", avatar: "/avatars/ethan.jpg", scheduledCheckIn: "09:00 AM", scheduledCheckOut: "05:30 PM", actualCheckIn: "09:05 AM", actualCheckOut: "05:25 PM", project: "Project D", status: "Not Declared", date: new Date("2023-10-05") },
]

export function AttendanceTracking() {
  const [presentWorkers, setPresentWorkers] = useState(0)
  const [absentWorkers, setAbsentWorkers] = useState(0)
  const [timelyArrivals, setTimelyArrivals] = useState(0)
  const [lateArrivals, setLateArrivals] = useState(0)
  const [attendance, setAttendance] = useState(initialAttendance)
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [attendancePerPage] = useState(5)

  // Date filter state
  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [dateFilterMode, setDateFilterMode] = useState<'quick' | 'custom'>('quick')
  const [quickDateFilter, setQuickDateFilter] = useState<string>('this-month')
  const [customStartDate, setCustomStartDate] = useState({ day: 1, month: 'January', year: '2023' })
  const [customEndDate, setCustomEndDate] = useState({ day: 31, month: 'December', year: '2023' })
  const [dateFilterActive, setDateFilterActive] = useState(false)

  // Contact modal state
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [contactType, setContactType] = useState<'worker' | 'leader'>('worker')
  const [selectedWorker, setSelectedWorker] = useState<typeof initialAttendance[0] | null>(null)
  const [message, setMessage] = useState("")

  // New filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [filterType, setFilterType] = useState<'project' | 'status'>('project')
  const [projectFilters, setProjectFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const allProjects = Array.from(new Set(initialAttendance.map(record => record.project)))
  const allStatuses = Array.from(new Set(initialAttendance.map(record => record.status)))

  useEffect(() => {
    updateSummaryCards(attendance)
  }, [attendance])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const filteredAttendance = initialAttendance.filter(record =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setAttendance(filteredAttendance)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Pagination logic
  const indexOfLastRecord = currentPage * attendancePerPage
  const indexOfFirstRecord = indexOfLastRecord - attendancePerPage
  const currentRecords = attendance.slice(indexOfFirstRecord, indexOfLastRecord)

  const totalPages = Math.ceil(attendance.length / attendancePerPage)

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const updateSummaryCards = (records: typeof initialAttendance) => {
    const present = records.filter(record => record.status === "Present").length
    const absent = records.filter(record => record.status === "Absent").length
    const timely = records.filter(record => record.status === "Present" && record.actualCheckIn <= record.scheduledCheckIn).length
    const late = records.filter(record => record.status === "Late").length

    setPresentWorkers(present)
    setAbsentWorkers(absent)
    setTimelyArrivals(timely)
    setLateArrivals(late)
  }

  const handleDateFilter = () => {
    let filteredAttendance = [...initialAttendance]
    let startDate: Date
    let endDate: Date

    if (dateFilterMode === 'quick') {
      const now = new Date()
      switch (quickDateFilter) {
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          break
        case 'last-month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          endDate = new Date(now.getFullYear(), now.getMonth(), 0)
          break
        case 'this-year':
          startDate = new Date(now.getFullYear(), 0, 1)
          endDate = new Date(now.getFullYear(), 11, 31)
          break
        case 'last-year':
          startDate = new Date(now.getFullYear() - 1, 0, 1)
          endDate = new Date(now.getFullYear() - 1, 11, 31)
          break
        default:
          startDate = new Date(0)
          endDate = new Date()
      }
    } else {
      startDate = new Date(`${customStartDate.month} ${customStartDate.day}, ${customStartDate.year}`)
      endDate = new Date(`${customEndDate.month} ${customEndDate.day}, ${customEndDate.year}`)
    }

    filteredAttendance = filteredAttendance.filter(record => {
      return record.date >= startDate && record.date <= endDate
    })

    setAttendance(filteredAttendance)
    updateSummaryCards(filteredAttendance)
    setDateFilterActive(true)
    setDateFilterOpen(false)
    setCurrentPage(1) // Reset to first page when applying filter
  }

  const clearDateFilter = () => {
    setAttendance(initialAttendance)
    updateSummaryCards(initialAttendance)
    setDateFilterActive(false)
    setDateFilterMode('quick')
    setQuickDateFilter('this-month')
    setCustomStartDate({ day: 1, month: 'January', year: '2023' })
    setCustomEndDate({ day: 31, month: 'December', year: '2023' })
    setCurrentPage(1) // Reset to first page when clearing filter
  }

  const handleContactWorker = (worker: typeof initialAttendance[0]) => {
    setSelectedWorker(worker)
    setContactType('worker')
    setContactModalOpen(true)
  }

  const handleContactLeader = (worker: typeof initialAttendance[0]) => {
    setSelectedWorker(worker)
    setContactType('leader')
    setContactModalOpen(true)
  }

  const handleSendMessage = () => {
    // Implement send message logic here
    console.log(`Sending message to ${contactType} for worker ${selectedWorker?.name}: ${message}`)
    setContactModalOpen(false)
    setMessage("")
  }

  const handleFilterIconClick = (type: 'project' | 'status') => {
    if ((type === 'project' && projectFilters.length > 0) || (type === 'status' && statusFilters.length > 0)) {
      // If filters are active, clear them
      if (type === 'project') {
        setProjectFilters([])
      } else {
        setStatusFilters([])
      }
      applyFilters(type === 'project' ? [] : projectFilters, type === 'status' ? [] : statusFilters)
    } else {
      // If no filters are active, open the filter modal
      setFilterType(type)
      setFilterModalOpen(true)
    }
  }

  const handleFilterChange = (item: string) => {
    if (filterType === 'project') {
      setProjectFilters(prev => 
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      )
    } else {
      setStatusFilters(prev => 
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      )
    }
  }

  const applyFilters = (projectFilters: string[], statusFilters: string[]) => {
    let filteredAttendance = [...initialAttendance]

    if (projectFilters.length > 0) {
      filteredAttendance = filteredAttendance.filter(record => projectFilters.includes(record.project))
    }

    if (statusFilters.length > 0) {
      filteredAttendance = filteredAttendance.filter(record => statusFilters.includes(record.status))
    }

    setAttendance(filteredAttendance)
    updateSummaryCards(filteredAttendance)
    setFilterModalOpen(false)
    setCurrentPage(1) // Reset to first page when applying filter
  }

  const CalendarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentWorkers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Workers</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absentWorkers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timely Arrivals</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timelyArrivals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lateArrivals}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section for Attendance Data */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendance Data</CardTitle>
            <div className="flex items-center space-x-2">
              <form onSubmit={handleSearch}   className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search attendance"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 py-2 w-64 h-9 text-sm"
                  />
                </div>
                <Button type="submit" size="sm">Search</Button>
              </form>
              <Dialog open={dateFilterOpen} onOpenChange={setDateFilterOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={dateFilterActive ? "bg-blue-500 text-white" : ""}
                    onClick={(e) => {
                      if (dateFilterActive) {
                        e.preventDefault()
                        clearDateFilter()
                      }
                    }}
                  >
                    <CalendarIcon />
                    {dateFilterActive ? "Clear Filter" : "Dates"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filter by Date</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Tabs defaultValue="quick" onValueChange={(value) => setDateFilterMode(value as 'quick' | 'custom')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="quick">Quick Select</TabsTrigger>
                        <TabsTrigger value="custom">Custom Range</TabsTrigger>
                      </TabsList>
                      <TabsContent value="quick">
                        <Select value={quickDateFilter} onValueChange={setQuickDateFilter}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="last-month">Last Month</SelectItem>
                            <SelectItem value="this-year">This Year</SelectItem>
                            <SelectItem value="last-year">Last Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </TabsContent>
                      <TabsContent value="custom">
                        <div className="space-y-4">
                          <div>
                            <Label>Start Date</Label>
                            <div className="flex space-x-2 mt-2">
                              <Input
                                type="number"
                                min="1"
                                max="31"
                                value={customStartDate.day}
                                onChange={(e) => setCustomStartDate(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                                className="w-16"
                              />
                              <Select 
                                value={customStartDate.month} 
                                onValueChange={(value) => setCustomStartDate(prev => ({ ...prev, month: value }))}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map((month) => (
                                    <SelectItem key={month} value={month}>{month}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                min="2000"
                                max="2099"
                                value={customStartDate.year}
                                onChange={(e) => setCustomStartDate(prev => ({ ...prev, year: e.target.value }))}
                                className="w-20"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <div className="flex space-x-2 mt-2">
                              <Input
                                type="number"
                                min="1"
                                max="31"
                                value={customEndDate.day}
                                onChange={(e) => setCustomEndDate(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                                className="w-16"
                              />
                              <Select 
                                value={customEndDate.month} 
                                onValueChange={(value) => setCustomEndDate(prev => ({ ...prev, month: value }))}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map((month) => (
                                    <SelectItem key={month} value={month}>{month}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                min="2000"
                                max="2099"
                                value={customEndDate.year}
                                onChange={(e) => setCustomEndDate(prev => ({ ...prev, year: e.target.value }))}
                                className="w-20"
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleDateFilter}>Apply Filter</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    <span>Project</span>
                    <button
                      onClick={() => handleFilterIconClick('project')}
                      className={`rounded-full p-1 transition-colors ${
                        projectFilters.length > 0
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-black hover:bg-gray-700"
                      }`}
                    >
                      <Sliders className={`h-3 w-3 ${
                        projectFilters.length > 0 ? "text-white" : "text-white"
                      }`} />
                    </button>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    <span>Status</span>
                    <button
                      onClick={() => handleFilterIconClick('status')}
                      className={`rounded-full p-1 transition-colors ${
                        statusFilters.length > 0
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-black hover:bg-gray-700"
                      }`}
                    >
                      <Sliders className={`h-3 w-3 ${
                        statusFilters.length > 0 ? "text-white" : "text-white"
                      }`} />
                    </button>
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecords.map((record, index) => (
                <TableRow key={record.id} className="hover:bg-gray-50">
                  <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                  <TableCell className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={record.avatar} alt={record.name} />
                      <AvatarFallback>{record.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-700">{record.name}</span>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center">
                          <span className="font-medium text-gray-800">{record.actualCheckIn}</span>
                          <Info className="h-4 w-4 ml-1 text-blue-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Scheduled: {record.scheduledCheckIn}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center">
                          <span className="font-medium text-gray-800">{record.actualCheckOut}</span>
                          <Info className="h-4 w-4 ml-1 text-blue-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Scheduled: {record.scheduledCheckOut}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-700">{record.project}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === 'Present' ? 'bg-green-100 text-green-800' :
                      record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                      record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                      record.status === 'Not Declared' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                        onClick={() => handleContactWorker(record)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Worker
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => handleContactLeader(record)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Leader
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

      {/* Contact Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact {contactType === 'worker' ? 'Worker' : 'Leader'}</DialogTitle>
            <DialogDescription>
              You are about to send a message to the {contactType} for {selectedWorker?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedWorker?.avatar} alt={selectedWorker?.name} />
                <AvatarFallback>{selectedWorker?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedWorker?.name}</p>
                <p className="text-sm text-gray-500">{selectedWorker?.project}</p>
              </div>
            </div>
            <Textarea
              placeholder="Type your message here."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSendMessage}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter by {filterType === 'project' ? 'Project' : 'Status'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {(filterType === 'project' ? allProjects : allStatuses).map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={item}
                  checked={(filterType === 'project' ? projectFilters : statusFilters).includes(item)}
                  onCheckedChange={() => handleFilterChange(item)}
                />
                <label htmlFor={item} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {item}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => applyFilters(projectFilters, statusFilters)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}