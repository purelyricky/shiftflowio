"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, CheckCircleIcon, ClockIcon, DollarSignIcon, ScanIcon, ChevronLeft, ChevronRight, SunIcon, MoonIcon, AlertTriangle, InfoIcon } from 'lucide-react'
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function WorkerDashboardComponent() {
  const [worker, setWorker] = useState({
    name: "Alice Johnson",
    avatar: "/placeholder-avatar.jpg",
    email: "alice.johnson@example.com",
    phone: "+1 234 567 8901",
    punctuality: 98,
    completedShifts: 45,
    upcomingShifts: 5,
    earnings: 3750,
  })


  const [upcomingShifts, setUpcomingShifts] = useState([
    { id: 1, date: "2023-09-24", time: "09:00 AM - 05:00 PM", project: "Project A", location: "Site 1", expectedStart: "09:00 AM", expectedStop: "05:00 PM", actualStart: "N/A", actualStop: "N/A", leader: "John Doe", notes: "Remember to bring safety gear.", status: 'active' },
    { id: 2, date: "2023-09-25", time: "02:00 PM - 10:00 PM", project: "Project B", location: "Site 2", expectedStart: "02:00 PM", expectedStop: "10:00 PM", actualStart: "N/A", actualStop: "N/A", leader: "Jane Smith", notes: "Team meeting at 1:30 PM before shift.", status: 'active' },
    { id: 3, date: "2023-09-27", time: "08:00 AM - 04:00 PM", project: "Project A", location: "Site 1", expectedStart: "08:00 AM", expectedStop: "04:00 PM", actualStart: "N/A", actualStop: "N/A", leader: "John Doe", notes: "New equipment training scheduled.", status: 'active' },
  ])

  const [todayShifts, setTodayShifts] = useState([
    { id: 4, time: "10:00 AM - 06:00 PM", project: "Project C", location: "Site 3", clockedIn: false, completed: false, expectedStart: "10:00 AM", expectedStop: "06:00 PM", actualStart: "N/A", actualStop: "N/A", leader: "Bob Johnson", notes: "Client visit expected around noon." },
  ])

  const [fillerShifts, setFillerShifts] = useState([
    { id: 5, date: "2023-09-23", time: "01:00 PM - 09:00 PM", project: "Project D", location: "Site 4", expectedStart: "01:00 PM", expectedStop: "09:00 PM", actualStart: "N/A", actualStop: "N/A", leader: "Alice Brown", notes: "Overtime may be required.", status: 'available' },
    { id: 6, date: "2023-09-26", time: "07:00 AM - 03:00 PM", project: "Project E", location: "Site 5", expectedStart: "07:00 AM", expectedStop: "03:00 PM", actualStart: "N/A", actualStop: "N/A", leader: "Charlie Wilson", notes: "Bring lunch, cafeteria closed.", status: 'available' },
  ])

  const [notifications] = useState([
    { id: 1, message: "Your shift for tomorrow has been confirmed.", time: "1 hour ago" },
    { id: 2, message: "New safety guidelines have been posted for Project A.", time: "3 hours ago" },
    { id: 3, message: "Your latest payslip is now available.", time: "1 day ago" },
  ])

  const [cancelShiftId, setCancelShiftId] = useState<number | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [replacementEmail, setReplacementEmail] = useState('')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7)
  })

  const [shiftReports, setShiftReports] = useState([
    { id: 1, date: "2023-09-20", project: "Project A", hoursTracked: 8, clockIn: "09:00 AM", clockOut: "05:00 PM", leader: "John Doe" },
    { id: 2, date: "2023-09-21", project: "Project B", hoursTracked: 6, clockIn: "02:00 PM", clockOut: "08:00 PM", leader: "Jane Smith" },
    { id: 3, date: "2023-09-22", project: "Project C", hoursTracked: 7, clockIn: "10:00 AM", clockOut: "05:00 PM", leader: "Bob Johnson" },
    { id: 4, date: "2023-09-25", project: "Project D", hoursTracked: "N/A", clockIn: "N/A", clockOut: "N/A", leader: "Alice Brown" },
    { id: 5, date: "2023-09-26", project: "Project E", hoursTracked: "N/A", clockIn: "N/A", clockOut: "N/A", leader: "Charlie Wilson" },
    { id: 6, date: "2023-09-27", project: "Project F", hoursTracked: 8, clockIn: "09:00 AM", clockOut: "05:00 PM", leader: "David Lee" },
    { id: 7, date: "2023-09-28", project: "Project G", hoursTracked: 7, clockIn: "10:00 AM", clockOut: "05:00 PM", leader: "Eva Green" },
    { id: 8, date: "2023-09-29", project: "Project H", hoursTracked: 6, clockIn: "11:00 AM", clockOut: "05:00 PM", leader: "Frank White" },
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('')
  const [availability, setAvailability] = useState<string[]>([])

  const [payStubsModalOpen, setPayStubsModalOpen] = useState(false)
  const [timeOffModalOpen, setTimeOffModalOpen] = useState(false)
  const [timeOffStatus, setTimeOffStatus] = useState('active') // 'active', 'pending', 'inactive'

  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState<{
    id: number;
    project: string;
    expectedStart: string;
    expectedStop: string;
    actualStart: string;
    actualStop: string;
    leader: string;
    notes: string;
  } | null>(null) // Initialize as null

  const [clockInOutModalOpen, setClockInOutModalOpen] = useState(false)
  const [clockInOutAction, setClockInOutAction] = useState<'in' | 'out'>('in')

  const handleCancelShift = (shiftId: number) => {
    setUpcomingShifts(upcomingShifts.map(shift => 
      shift.id === shiftId ? { ...shift, status: 'pendingCancel' } : shift
    ))
    showToast("Cancel request submitted", "Your shift cancellation request has been submitted for approval.")
    setCancelShiftId(null)
    setCancelReason('')
    setReplacementEmail('')
    setCancelModalOpen(false)
  }

  const handleClockInOut = (shiftId: number, action: 'in' | 'out') => {
    setClockInOutAction(action)
    setClockInOutModalOpen(true)
  }

  const handleConfirmClockInOut = () => {
    setTodayShifts(todayShifts.map(shift => {
      if (clockInOutAction === 'in') {
        return { ...shift, clockedIn: true, actualStart: new Date().toLocaleTimeString() }
      } else {
        return { ...shift, clockedIn: false, completed: true, actualStop: new Date().toLocaleTimeString() }
      }
    }))
    setClockInOutModalOpen(false)
    showToast(`Clock ${clockInOutAction === 'in' ? 'In' : 'Out'} Successful`, `You have successfully clocked ${clockInOutAction} for your shift.`)
  }

  const handleTakeFillerShift = (shiftId: number) => {
    setFillerShifts(fillerShifts.map(shift => 
      shift.id === shiftId ? { ...shift, status: 'pendingApproval' } : shift
    ))
    showToast("Shift Request Submitted", "Your request to take this shift has been submitted for approval.")
  }

  const handleViewDetails = (shift: { id: number; project: string; expectedStart: string; expectedStop: string; actualStart: string; actualStop: string; leader: string; notes: string; }) => {
    setSelectedShift(shift)
    setDetailsModalOpen(true)
  }

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange)
    // In a real application, you would fetch the shift reports based on the new date range here
    // For this example, we'll just use the static data
  }

  const handleNextPage = () => {
    if (currentPage < Math.ceil(shiftReports.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleAddAvailability = () => {
    if (selectedDay && selectedTimeOfDay) {
      const newAvailability = `${selectedDay} ${selectedTimeOfDay}`
      if (!availability.includes(newAvailability)) {
        setAvailability([...availability, newAvailability])
      }
      setSelectedDay('')
      setSelectedTimeOfDay('')
    }
  }

  const handleRemoveAvailability = (item: string) => {
    setAvailability(availability.filter(a => a !== item))
  }

  const handleApplyAvailabilityChanges = () => {
    showToast("Availability Updated", "Your availability has been updated successfully.")
    setAvailabilityModalOpen(false)
  }

  const handleSubmitTimeOffRequest = () => {
    setTimeOffStatus('pending')
    setTimeOffModalOpen(false)
    showToast("Time Off Request Submitted", "Your time off request has been submitted for approval.")
  }

  const handleActivateAccount = () => {
    setTimeOffStatus('active')
    setTimeOffModalOpen(false)
    showToast("Account Activated", "Your account has been activated. You are now eligible for future shifts.")
  }

  const showToast = (title: string, description: string) => {
    toast({
      title: title,
      description: description,
      duration: 3000, // Auto-dismiss after 3 seconds
    })
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = shiftReports.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="shifts">Shifts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Punctuality Score</CardTitle>
                  <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{worker.punctuality}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Shifts</CardTitle>
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{worker.completedShifts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Shifts</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{worker.upcomingShifts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${worker.earnings}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Dialog open={availabilityModalOpen} onOpenChange={setAvailabilityModalOpen}>
                    <DialogTrigger asChild>
                      <Button>Update Availability</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Update Availability</DialogTitle>
                        <DialogDescription>
                          Set your availability for each day of the week.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="day" className="text-right">
                            Day
                          </Label>
                          <Select value={selectedDay} onValueChange={setSelectedDay}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select a day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monday">Monday</SelectItem>
                              <SelectItem value="Tuesday">Tuesday</SelectItem>
                              <SelectItem value="Wednesday">Wednesday</SelectItem>
                              <SelectItem value="Thursday">Thursday</SelectItem>
                              <SelectItem value="Friday">Friday</SelectItem>
                              <SelectItem value="Saturday">Saturday</SelectItem>
                              <SelectItem value="Sunday">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="timeOfDay" className="text-right">
                            Time
                          </Label>
                          <Select value={selectedTimeOfDay} onValueChange={setSelectedTimeOfDay}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select time of day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Day">Day</SelectItem>
                              <SelectItem value="Night">Night</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAddAvailability}>Add</Button>
                      </div>
                      <div className="space-y-2">
                        {availability.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>
                              {item}
                              {item.includes('Day') ? (
                                <SunIcon className="inline-block ml-2 h-4 w-4" />
                              ) : (
                                <MoonIcon className="inline-block ml-2 h-4 w-4" />
                              )}
                            </span>
                            <Button variant="outline" size="sm" onClick={() => handleRemoveAvailability(item)}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button onClick={handleApplyAvailabilityChanges}>Apply Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={payStubsModalOpen} onOpenChange={setPayStubsModalOpen}>
                    <DialogTrigger asChild>
                      <Button>View Pay Stubs</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pay Stubs</DialogTitle>
                        <DialogDescription>
                          Please contact your Admin for your Stubs.
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={timeOffModalOpen} onOpenChange={setTimeOffModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        disabled={timeOffStatus === 'pending'}
                        variant={timeOffStatus === 'pending' ? 'secondary' : 'default'}
                      >
                        {timeOffStatus === 'active' && "Request Time Off"}
                        {timeOffStatus === 'pending' && "Pending Time Off Request"}
                        {timeOffStatus === 'inactive' && "Activate Account"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {timeOffStatus === 'active' && "Request Time Off"}
                          {timeOffStatus === 'inactive' && "Activate Account"}
                        </DialogTitle>
                        <DialogDescription>
                          {timeOffStatus === 'active' && (
                            <Alert variant="default">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Warning</AlertTitle>
                              <AlertDescription>
                                Submitting this request will make you ineligible for any shifts until the admin changes your status to active.
                              </AlertDescription>
                            </Alert>
                          )}
                          {timeOffStatus === 'inactive' && (
                            <Alert>
                              <InfoIcon className="h-4 w-4" />
                              <AlertTitle>Information</AlertTitle>
                              <AlertDescription>
                                Requesting your account to be active makes you eligible for future upcoming shifts.
                              </AlertDescription>
                            </Alert>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setTimeOffModalOpen(false)}>Cancel</Button>
                        {timeOffStatus === 'active' && (
                          <Button onClick={handleSubmitTimeOffRequest}>Submit Request</Button>
                        )}
                        {timeOffStatus === 'inactive' && (
                          <Button onClick={handleActivateAccount}>Submit Request</Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Shifts</CardTitle>
                <CardDescription>Your shifts for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayShifts.map((shift) =>
                    <div key={shift.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{shift.project}</p>
                          {shift.clockedIn && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Clocked in
                            </span>
                          )}
                          {shift.completed && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              Clocked out
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{shift.time}</p>
                        <p className="text-sm text-gray-500">{shift.location}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(shift)}>
                          More Details
                        </Button>
                        {!shift.completed && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClockInOut(shift.id, shift.clockedIn ? 'out' : 'in')}
                            disabled={shift.completed}
                          >
                            <ScanIcon className="h-4 w-4 mr-2" />
                            {shift.clockedIn ? 'Clock Out' : 'Clock In'}
                          </Button>
                        )}
                        {shift.completed && (
                          <Button variant="outline" size="sm" disabled>
                            Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Shifts</CardTitle>
                <CardDescription>Your scheduled shifts for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingShifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{shift.project}</p>
                        <p className="text-sm text-gray-500">{shift.date} • {shift.time}</p>
                        <p className="text-sm text-gray-500">{shift.location}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(shift)}>
                          More Details
                        </Button>
                        <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={shift.status === 'pendingCancel'}
                              onClick={() => setCancelShiftId(shift.id)}
                            >
                              {shift.status === 'pendingCancel' ? 'Pending Cancel Request' : 'Cancel Shift'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancel Shift</DialogTitle>
                              <DialogDescription>
                                <Alert variant="default" className="mb-4">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertTitle>Warning</AlertTitle>
                                  <AlertDescription>
                                    Canceling shifts without a good reason or a replacement colleague reduces your priority score.
                                  </AlertDescription>
                                </Alert>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reason" className="text-right">
                                  Reason
                                </Label>
                                <Textarea
                                  id="reason"
                                  value={cancelReason}
                                  onChange={(e) => setCancelReason(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="replacementEmail" className="text-right">
                                  Replacement Email
                                </Label>
                                <Input
                                  id="replacementEmail"
                                  value={replacementEmail}
                                  onChange={(e) => setReplacementEmail(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button 
                                onClick={() => cancelShiftId !== null && handleCancelShift(cancelShiftId)}
                              >
                                Submit Cancel Request
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Filler Shifts</CardTitle>
                <CardDescription>Quick shifts you can take based on your availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fillerShifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{shift.project}</p>
                        <p className="text-sm text-gray-500">{shift.date} • {shift.time}</p>
                        <p className="text-sm text-gray-500">{shift.location}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(shift)}>
                          More Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleTakeFillerShift(shift.id)}
                          disabled={shift.status === 'pendingApproval'}
                        >
                          {shift.status === 'pendingApproval' ? 'Pending Shift Request' : 'Take Shift'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="shifts">
            <Card>
              <CardHeader>
                <CardTitle>Shift Reports</CardTitle>
                <CardDescription>View your shift details for a specific date range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <DatePickerWithRange date={dateRange} setDate={handleDateRangeChange} />
                    <Button onClick={() => handleDateRangeChange(dateRange)}>Apply</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Hours Tracked</TableHead>
                        <TableHead>Clock In</TableHead>
                        <TableHead>Clock Out</TableHead>
                        <TableHead>Leader</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell>{shift.date}</TableCell>
                          <TableCell>{shift.project}</TableCell>
                          <TableCell>{shift.hoursTracked}</TableCell>
                          <TableCell>{shift.clockIn}</TableCell>
                          <TableCell>{shift.clockOut}</TableCell>
                          <TableCell>{shift.leader}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous page</span>
                    </Button>
                    <span>
                      Page {currentPage} of {Math.ceil(shiftReports.length / itemsPerPage)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === Math.ceil(shiftReports.length / itemsPerPage)}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={worker.name} onChange={(e) => setWorker({...worker, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={worker.email} onChange={(e) => setWorker({...worker, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" value={worker.phone} onChange={(e) => setWorker({...worker, phone: e.target.value})} />
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedShift?.project}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expected Start Time</Label>
                <p>{selectedShift?.expectedStart}</p>
              </div>
              <div>
                <Label>Expected Stop Time</Label>
                <p>{selectedShift?.expectedStop}</p>
              </div>
              <div>
                <Label>Actual Start Time</Label>
                <p>{selectedShift?.actualStart}</p>
              </div>
              <div>
                <Label>Actual Stop Time</Label>
                <p>{selectedShift?.actualStop}</p>
              </div>
            </div>
            <div>
              <Label>Leader</Label>
              <p>{selectedShift?.leader}</p>
            </div>
            <div>
              <Label>Notes</Label>
              <p>{selectedShift?.notes}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setDetailsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={clockInOutModalOpen} onOpenChange={setClockInOutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code to Clock {clockInOutAction === 'in' ? 'In' : 'Out'}</DialogTitle>
            <DialogDescription>
              Please scan the QR code provided at your work location to clock {clockInOutAction}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-64 bg-gray-100 rounded-md">
            <p className="text-gray-500">Camera feed would appear here</p>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmClockInOut}>
              Manual Clock {clockInOutAction === 'in' ? 'In' : 'Out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}