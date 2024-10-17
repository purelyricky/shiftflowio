"use client"

import { useState, FormEvent, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Clock, AlertTriangle, DollarSign, Search, ChevronLeft, ChevronRight, FileDown, Briefcase, ArrowUp, ArrowDown, Filter } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Mock data for reports
const initialReports = [
  { id: 1, name: "Alice Johnson", avatar: "/avatars/alice.jpg", shiftsCompleted: 45, trackedHours: 360, lostHours: 5, earnings: 2250, datesWorked: [2, 3, 5, 8, 10, 12, 15, 17, 20, 22, 24, 26, 29, 31], projects: ["VITESCO DQ QUALITY", "Project B", "Project C", "Project D", "Project E", "Project F"] },
  { id: 2, name: "Bob Smith", avatar: "/avatars/bob.jpg", shiftsCompleted: 38, trackedHours: 304, lostHours: 8, earnings: 1900, datesWorked: [1, 4, 6, 9, 11, 13, 16, 18, 21, 23, 25, 27, 30], projects: ["Project B", "Project C", "Project E"] },
  { id: 3, name: "Charlie Brown", avatar: "/avatars/charlie.jpg", shiftsCompleted: 52, trackedHours: 416, lostHours: 2, earnings: 2600, datesWorked: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31], projects: ["Project A", "Project D", "Project F", "Project G"] },
  { id: 4, name: "Diana Ross", avatar: "/avatars/diana.jpg", shiftsCompleted: 41, trackedHours: 328, lostHours: 6, earnings: 2050, datesWorked: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31], projects: ["Project B", "Project C", "Project E", "Project H"] },
  { id: 5, name: "Ethan Hunt", avatar: "/avatars/ethan.jpg", shiftsCompleted: 30, trackedHours: 240, lostHours: 10, earnings: 1500, datesWorked: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], projects: ["Project A", "Project D", "Project G", "Project I"] },
]

type SortField = 'trackedHours' | 'earnings'
type SortOrder = 'asc' | 'desc' | null

interface SortState {
  field: SortField
  order: SortOrder
}

export function ReportsPageComponent() {
  const [totalShiftsCompleted, setTotalShiftsCompleted] = useState(206)
  const [totalTrackedHours, setTotalTrackedHours] = useState(1648)
  const [totalLostHours, setTotalLostHours] = useState(31)
  const [totalEarnings, setTotalEarnings] = useState(10300)
  const [reports, setReports] = useState(initialReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortState, setSortState] = useState<SortState>({ field: 'trackedHours', order: null })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [reportsPerPage] = useState(5)

  // Export state
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf')
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    shiftsCompleted: true,
    trackedHours: true,
    lostHours: true,
    earnings: true,
    datesWorked: true,
    projects: true
  })

  // Project filter state
  const [projectFilterOpen, setProjectFilterOpen] = useState(false)
  const [projectFilterActive, setProjectFilterActive] = useState(false)
  const [availableProjects, setAvailableProjects] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  // Date filter state
  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [dateFilterMode, setDateFilterMode] = useState<'quick' | 'custom'>('quick')
  const [quickDateFilter, setQuickDateFilter] = useState<string>('this-month')
  const [customStartDate, setCustomStartDate] = useState({ day: 1, month: 'January', year: '2023' })
  const [customEndDate, setCustomEndDate] = useState({ day: 31, month: 'December', year: '2023' })
  const [dateFilterActive, setDateFilterActive] = useState(false)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  useEffect(() => {
    // Extract unique projects from all reports
    const projects = Array.from(new Set(reports.flatMap(report => report.projects)))
    setAvailableProjects(projects)
  }, [reports])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const filteredReports = initialReports.filter(report =>
      report.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setReports(filteredReports)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleSort = (field: SortField) => {
    setSortState(prevState => {
      if (prevState.field !== field) {
        return { field, order: 'asc' }
      } else if (prevState.order === null) {
        return { field, order: 'asc' }
      } else if (prevState.order === 'asc') {
        return { field, order: 'desc' }
      } else {
        return { field, order: null }
      }
    })
  }

  const sortedReports = [...reports].sort((a, b) => {
    if (sortState.order === null) return 0
    if (a[sortState.field] < b[sortState.field]) return sortState.order === 'asc' ? -1 : 1
    if (a[sortState.field] > b[sortState.field]) return sortState.order === 'asc' ? 1 : -1
    return 0
  })

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = sortedReports.slice(indexOfFirstReport, indexOfLastReport)

  const totalPages = Math.ceil(reports.length / reportsPerPage)

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      exportToPDF()
    } else if (exportFormat === 'excel') {
      exportToExcel()
    }
    setExportDialogOpen(false)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text('Reports', 14, 15)

    const tableColumn = Object.keys(selectedFields)
      .filter(key => selectedFields[key as keyof typeof selectedFields])
      .map(key => key.charAt(0).toUpperCase() + key.slice(1))

    const tableRows = reports.map(report => 
      Object.entries(selectedFields)
        .filter(([key, value]) => value)
        .map(([key]) => {
          if (key === 'datesWorked' || key === 'projects') {
            return report[key as keyof typeof report].join(', ')
          }
          return report[key as keyof typeof report]
        })
    )

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    })

    doc.save('reports.pdf')
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reports.map(report => {
      const filteredReport: any = {}
      Object.entries(selectedFields).forEach(([key, value]) => {
        if (value) {
          if (key === 'datesWorked' || key === 'projects') {
            filteredReport[key] = report[key as keyof typeof report].join(', ')
          } else {
            filteredReport[key] = report[key as keyof typeof report]
          }
        }
      })
      return filteredReport
    }))

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports")
    XLSX.writeFile(workbook, 'reports.xlsx')
  }

  const toggleAllFields = (checked: boolean) => {
    setSelectedFields(Object.fromEntries(
      Object.keys(selectedFields).map(key => [key, checked])
    ))
  }

  // Function to shorten project name
  const shortenProjectName = (name: string) => {
    return name.length > 8 ? name.slice(0, 8) + '...' : name
  }

  const handleProjectFilter = () => {
    if (selectedProjects.length > 0) {
      const filteredReports = initialReports.filter(report =>
        report.projects.some(project => selectedProjects.includes(project))
      )
      setReports(filteredReports)
      setProjectFilterActive(true)
    } else {
      setReports(initialReports)
      setProjectFilterActive(false)
    }
    setProjectFilterOpen(false)
  }

  const handleDateFilter = () => {
    let filteredReports = [...initialReports]
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

    filteredReports = filteredReports.filter(report => {
      const reportDate = new Date(report.datesWorked[0], 0) // Assuming datesWorked[0] is the year
      return reportDate >= startDate && reportDate <= endDate
    })

    setReports(filteredReports)
    updateSummaryCards(filteredReports)
    setDateFilterActive(true)
    setDateFilterOpen(false)
  }

  const clearDateFilter = () => {
    setReports(initialReports)
    updateSummaryCards(initialReports)
    setDateFilterActive(false)
    setDateFilterMode('quick')
    setQuickDateFilter('this-month')
    setCustomStartDate({ day: 1, month: 'January', year: '2023' })
    setCustomEndDate({ day: 31, month: 'December', year: '2023' })
  }

  const updateSummaryCards = (filteredReports: typeof initialReports) => {
    const totalShifts = filteredReports.reduce((sum, report) => sum + report.shiftsCompleted, 0)
    const totalHours = filteredReports.reduce((sum, report) => sum + report.trackedHours, 0)
    const totalLost = filteredReports.reduce((sum, report) => sum + report.lostHours, 0)
    const totalEarned = filteredReports.reduce((sum, report) => sum + report.earnings, 0)

    setTotalShiftsCompleted(totalShifts)
    setTotalTrackedHours(totalHours)
    setTotalLostHours(totalLost)
    setTotalEarnings(totalEarned)
  }

  const SortButton = ({ field }: { field: SortField }) => {
    const isActive = sortState.field === field && sortState.order !== null
    const order = sortState.field === field ? sortState.order : null

    return (
      <button
        onClick={() => handleSort(field)}
        className={`ml-2 p-1 rounded-full ${isActive ? 'bg-white border-2 border-blue-500' : 'bg-black'}`}
        aria-label={`Sort by ${field}`}
      >
        <div className="relative w-4 h-4">
          {order === 'asc' ? (
            <ArrowUp className={`h-4 w-4 ${isActive ? 'text-blue-500' : 'text-white'}`} />
          ) : order === 'desc' ? (
            <ArrowDown className={`h-4 w-4 ${isActive ? 'text-blue-500' : 'text-white'}`} />
          ) : (
            <>
              <ArrowUp className="h-4 w-4 text-white absolute top-0 left-0" />
              <ArrowDown className="h-4 w-4 text-white absolute bottom-0 left-0" />
            </>
          )}
        </div>
      </button>
    )
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
            <CardTitle className="text-sm font-medium">Shifts Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShiftsCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracked Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrackedHours}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lost Hours</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLostHours}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section for Reports Data */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reports Data</CardTitle>
            <div className="flex items-center space-x-2">
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search reports"
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
                    Dates
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
              <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Export Reports</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all"
                        checked={Object.values(selectedFields).every(Boolean)}
                        onCheckedChange={(checked) => toggleAllFields(checked as boolean)}
                      />
                      <label
                        htmlFor="select-all"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Select All
                      </label>
                    </div>
                    {Object.entries(selectedFields).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => 
                            setSelectedFields(prev => ({ ...prev, [key]: checked as boolean }))
                          }
                        />
                        <label
                          htmlFor={key}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      </div>
                    ))}
                    <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as 'pdf' | 'excel')}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">Export as PDF</SelectItem>
                        <SelectItem value="excel">Export as Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleExport}>Export</Button>
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
                <TableHead>Shifts Completed</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    <span>Tracked Hours</span>
                    <SortButton field="trackedHours" />
                  </div>
                </TableHead>
                <TableHead>Lost Hours</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    <span>Earnings</span>
                    <SortButton field="earnings" />
                  </div>
                </TableHead>
                <TableHead>Dates Worked</TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    <span>Projects</span>
                    <Dialog open={projectFilterOpen} onOpenChange={setProjectFilterOpen}>
                      <DialogTrigger asChild>
                        <button
                          className={`ml-2 p-1 rounded-full ${projectFilterActive ? 'bg-blue-500 hover:bg-blue-600' : 'bg-black hover:bg-gray-800'}`}
                          aria-label="Filter projects"
                        >
                          <Filter className="h-4 w-4 text-white" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Filter Projects</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <p className="text-sm text-gray-500">
                            Select the projects you want to show data for:
                          </p>
                          {availableProjects.map((project) => (
                            <div key={project} className="flex items-center space-x-2">
                              <Checkbox
                                id={project}
                                checked={selectedProjects.includes(project)}
                                onCheckedChange={(checked) => {
                                  setSelectedProjects(prev =>
                                    checked
                                      ? [...prev, project]
                                      : prev.filter(p => p !== project)
                                  )
                                }}
                              />
                              <label
                                htmlFor={project}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {project}
                              </label>
                            </div>
                          ))}
                        </div>
                        <DialogFooter>
                          <Button onClick={handleProjectFilter}>Apply Filter</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReports.map((report, index) => (
                <TableRow key={report.id}>
                  <TableCell>{indexOfFirstReport + index + 1}</TableCell>
                  <TableCell className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={report.avatar} alt={report.name} />
                      <AvatarFallback>{report.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{report.name}</span>
                  </TableCell>
                  <TableCell>{report.shiftsCompleted}</TableCell>
                  <TableCell>{report.trackedHours}</TableCell>
                  <TableCell>{report.lostHours}</TableCell>
                  <TableCell>${report.earnings}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {report.datesWorked.slice(0,5).map((date, i) => (
                        <span key={i} className="inline-block bg-gray-200 rounded-full px-1.5 py-0.5 text-xs font-semibold text-gray-700">
                          {date}
                        </span>
                      ))}
                      {report.datesWorked.length > 5 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="inline-flex items-center justify-center bg-gray-200 rounded-full w-5 h-5 text-xs font-semibold text-gray-700">
                                +{report.datesWorked.length - 5}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {report.datesWorked.slice(5).join(', ')}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">
                        {shortenProjectName(report.projects[0])}
                      </span>
                      {report.projects.length > 1 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="relative inline-flex items-center">
                                <Briefcase className="h-4 w-4 text-gray-400" />
                                <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-xs rounded-full h-4 w-4 font-medium">
                                  +{report.projects.length - 1}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {report.projects.slice(1).join(', ')}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
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
    </div>
  )
}