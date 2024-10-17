"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, SlidersHorizontal, ClipboardList, CheckSquare, Repeat, Sun, Moon, Check, ChevronLeft, ChevronRight, Star, Clock, XCircle, ArrowRightLeft, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { format, addDays, isBefore, isAfter, isWithinInterval, isSameDay } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface ShiftData {
  projectName: string
  isNightShift: boolean
  coverage: [number, number]
  demand: number
  assignedWorkers: number
  date: Date
}

interface ProjectData {
  projectName: string
  shifts: ShiftData[]
}

const generateMockProjectData = (): ProjectData[] => {
  const projects: ProjectData[] = [
    { projectName: "Project A", shifts: [] },
    { projectName: "Project B", shifts: [] },
    { projectName: "Project C", shifts: [] },
    { projectName: "Project D", shifts: [] },
    { projectName: "Project E", shifts: [] },
    { projectName: "Project F", shifts: [] },
    { projectName: "Project G", shifts: [] },
    { projectName: "Project H", shifts: [] },
  ]

  const startDate = new Date(2024, 9, 1) // October 1, 2024
  const week1 = [0, 1, 2, 3] // Monday to Thursday
  const week2 = [7, 8, 9, 10] // Following Monday to Thursday

  projects.forEach((project, index) => {
    const weekDays = index < 4 ? week1 : week2
    weekDays.forEach(dayIndex => {
      const shiftDate = addDays(startDate, dayIndex)
      project.shifts.push({
        projectName: project.projectName,
        isNightShift: false,
        coverage: [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5) + 5],
        demand: Math.floor(Math.random() * 100),
        assignedWorkers: Math.floor(Math.random() * 5),
        date: shiftDate
      })
      project.shifts.push({
        projectName: project.projectName,
        isNightShift: true,
        coverage: [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5) + 5],
        demand: Math.floor(Math.random() * 100),
        assignedWorkers: Math.floor(Math.random() * 5),
        date: shiftDate
      })
    })
  })

  return projects
}

const initialMockProjectData: ProjectData[] = generateMockProjectData()

interface WorkerData {
  id: number
  name: string
  image: string
  punctualityScore: number
  rating: number
  requestedDays: Array<{ day: string; isNight: boolean }>
  grantedShifts: Array<{ day: string; isNight: boolean }>
  rejectedShifts: Array<{ day: string; isNight: boolean }>
  assignedProjects: string[]
  cancelSwapStatus?: { type: 'cancel' | 'swap'; day: string; isNight: boolean }
  replacementWorker?: WorkerData
}

const generateMockWorkerData = (count: number): WorkerData[] => {
  const names = [
    "Alice", "Bob", "Carol", "David", "Eva", "Frank", "Grace", "Henry", "Ivy", "Jack",
    "Karen", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Rachel", "Sam", "Tina"
  ]
  const surnames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"
  ]

  return Array.from({ length: count }, (_, i) => {
    const requestedDays = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
      day: daysOfWeek[Math.floor(Math.random() * 7)],
      isNight: Math.random() > 0.5
    }))

    const grantedShifts = requestedDays.filter(() => Math.random() > 0.3)
    const rejectedShifts = requestedDays.filter(day => !grantedShifts.includes(day))

    return {
      id: i + 1,
      name: `${names[i % names.length]} ${surnames[i % surnames.length]}`,
      image: `/placeholder.svg?height=32&width=32`,
      punctualityScore: Math.floor(Math.random() * 16) + 85, // 85-100
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
      requestedDays,
      grantedShifts,
      rejectedShifts,
      assignedProjects: []
    }
  })
}

const calculateCoveragePercentage = (covered: number, total: number): number => {
  return Math.round((covered / total) * 100)
}

const getProgressBarColor = (coveragePercentage: number): string => {
  if (coveragePercentage > 100) return "bg-red-500"
  if (coveragePercentage === 100) return "bg-green-500"
  return "bg-primary"
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= Math.floor(rating)
              ? "text-yellow-400 fill-current"
              : star - rating < 1
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

const ShiftBadge = ({ day, isNight }: { day: string; isNight: boolean }) => (
  <div className="px-2 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-md flex items-center">
    {day}
    {isNight ? (
      <Moon className="w-3 h-3 ml-1 text-black fill-current" />
    ) : (
      <Sun className="w-3 h-3 ml-1 text-black fill-current" />
    )}
  </div>
)

const ProjectCard = ({ project, isAssigned, onAssign }: { project: ShiftData; isAssigned: boolean; onAssign: () => void }) => {
  const coveragePercentage = calculateCoveragePercentage(project.coverage[0], project.coverage[1])
  const progressBarColor = getProgressBarColor(coveragePercentage)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm">{project.projectName}</span>
        <span className={`text-xs font-medium ${coveragePercentage > 100 ? 'text-red-500' : 'text-gray-500'}`}>
          {coveragePercentage}%
        </span>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressBarColor}`}
            style={{ width: `${Math.min(coveragePercentage, 100)}%` }}
          ></div>
        </div>
        <div className="bg-gray-100 rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap">
          {`${project.coverage[0]}/${project.coverage[1]}`}
        </div>
      </div>
      <div className="text-xs text-gray-500 mb-2">
        {format(project.date, "MMM d, yyyy")}
      </div>
      <Button
        variant={isAssigned ? "destructive" : "default"}
        size="sm"
        className="w-full text-xs py-1"
        onClick={onAssign}
      >
        {isAssigned ? "Cancel Shift" : "Assign Shift"}
      </Button>
    </div>
  )
}

const ReviewedWorkerModal = ({ worker, onClose, onSave, projects, updateProject }: { worker: WorkerData; onClose: () => void; onSave: (updatedWorker: WorkerData) => void; projects: ProjectData[]; updateProject: (projectName: string, isAssigning: boolean) => void }) => {
  const [isCancelled, setIsCancelled] = useState(false)

  const handleCancelShift = () => {
    setIsCancelled(!isCancelled)
    if (worker.assignedProjects.length > 0) {
      updateProject(worker.assignedProjects[0], isCancelled)
    }
  }

  const handleSaveChanges = () => {
    if (isCancelled) {
      const updatedWorker = { ...worker, assignedProjects: [] }
      onSave(updatedWorker)
    }
    onClose()
  }

  const isFromCancelSwap = worker.cancelSwapStatus !== undefined

  return (
    <DialogContent className="sm:max-w-[900px] bg-white p-0">
      <div className="flex h-full">
        <div className="flex-1 p-6 border-r border-gray-200">
          <DialogHeader>
            <DialogTitle>Worker Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={worker.image} alt={worker.name} />
                <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold">{worker.name}</h2>
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">Punctuality Score:</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${worker.punctualityScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{worker.punctualityScore}%</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Average Rating from Leaders:</label>
              <div className="flex items-center space-x-2 mt-1">
                <StarRating rating={parseFloat(worker.rating.toString())} />
                <span className="text-sm font-medium">{worker.rating}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Requested Days:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {worker.requestedDays.map((dayInfo, index) => (
                  <ShiftBadge key={index} day={dayInfo.day} isNight={dayInfo.isNight} />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Granted Shifts:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {worker.grantedShifts.map((dayInfo, index) => (
                  <ShiftBadge key={index} day={dayInfo.day} isNight={dayInfo.isNight} />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Rejected Shifts:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {worker.rejectedShifts.map((dayInfo, index) => (
                  <ShiftBadge key={index} day={dayInfo.day} isNight={dayInfo.isNight} />
                ))}
              </div>
            </div>
            {worker.cancelSwapStatus && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {worker.cancelSwapStatus.type === 'cancel' ? 'Canceled Shift:' : 'Swapped Shift:'}
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <ShiftBadge day={worker.cancelSwapStatus.day} isNight={worker.cancelSwapStatus.isNight} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {worker.cancelSwapStatus ? 'Replacement' : 'Assigned Project'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-grow flex items-center justify-center">
            <div className="w-full">
              {worker.cancelSwapStatus && worker.replacementWorker ? (
                <Card  className="w-full mb-2">
                  <CardContent className="p-2">
                    <div className="flex items-center  space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={worker.replacementWorker.image} alt={worker.replacementWorker.name} />
                        <AvatarFallback>{worker.replacementWorker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div  className="flex-grow min-w-0">
                        <div className="flex items-center  justify-between">
                          <h3 className="font-semibold text-sm  truncate">{worker.replacementWorker.name}</h3>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium ml-0.5">{worker.replacementWorker.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${worker.replacementWorker.punctualityScore}%` }}
                            />
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 text-primary mr-0.5" />
                            <span className="text-xs">{worker.replacementWorker.punctualityScore}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                worker.assignedProjects.length > 0 && !isFromCancelSwap && (
                  <ProjectCard
                    project={projects.find(p => p.projectName === worker.assignedProjects[0])?.shifts[0] || projects[0].shifts[0]}
                    isAssigned={!isCancelled}
                    onAssign={handleCancelShift}
                  />
                )
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={isFromCancelSwap ? onClose : handleSaveChanges} className="text-sm py-1 px-3">
              {isFromCancelSwap ? 'Close' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

const UnreviewedWorkerModal = ({ worker, onClose, onSave, projects, updateProject }: { worker: WorkerData; onClose: () => void; onSave: (updatedWorker: WorkerData) => void; projects: ProjectData[]; updateProject: (projectName: string, isAssigning: boolean) => void }) => {
  const [assignedProject, setAssignedProject] = useState<string | null>(worker.assignedProjects[0] || null)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)

  const handleAssignProject = (projectName: string) => {
    setAssignedProject(prevAssigned => {
      if (prevAssigned === projectName) {
        updateProject(projectName, false)
        return null
      }
      if (prevAssigned) {
        updateProject(prevAssigned, false)
      }
      updateProject(projectName, true)
      return projectName
    })
  }

  const handleSaveChanges = () => {
    const updatedWorker = { ...worker, assignedProjects: assignedProject ? [assignedProject] : [] }
    onSave(updatedWorker)
    onClose()
  }

  const handleNavigateProjects = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentProjectIndex(prev => Math.max(0, prev - 1))
    } else {
      setCurrentProjectIndex(prev => Math.min(projects.length - 3, prev + 1))
    }
  }

  const visibleProjects = projects.slice(currentProjectIndex, currentProjectIndex + 3)

  return (
    <DialogContent className="sm:max-w-[900px] bg-white p-0">
      <div className="flex h-full">
        <div className="flex-1 p-6 border-r border-gray-200">
          <DialogHeader>
            <DialogTitle>Worker Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={worker.image} alt={worker.name} />
                <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold">{worker.name}</h2>
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">Punctuality Score:</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${worker.punctualityScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{worker.punctualityScore}%</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Average Rating from Leaders:</label>
              <div className="flex items-center space-x-2 mt-1">
                <StarRating rating={parseFloat(worker.rating.toString())} />
                <span className="text-sm font-medium">{worker.rating}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Requested Days:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {worker.requestedDays.map((dayInfo, index) => (
                  <ShiftBadge key={index} day={dayInfo.day} isNight={dayInfo.isNight} />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Granted Shifts:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {worker.grantedShifts.map((dayInfo, index) => (
                  <ShiftBadge key={index} day={dayInfo.day} isNight={dayInfo.isNight} />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Rejected Shifts:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {worker.rejectedShifts.map((dayInfo, index) => (
                  <ShiftBadge key={index} day={dayInfo.day} isNight={dayInfo.isNight} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col">
          <DialogHeader>
            <DialogTitle>Recommended Projects to Assign</DialogTitle>
          </DialogHeader>
          <div className="flex-grow flex items-center justify-center">
            <div className="w-full">
              <Tabs defaultValue={visibleProjects[0].projectName}>
                <div className="relative mb-4">
                  <TabsList className="grid grid-cols-3 gap-2">
                    {visibleProjects.map((project) => (
                      <TabsTrigger key={project.projectName} value={project.projectName} className="text-xs py-1 px-2">
                        {project.projectName.slice(0, 8)}...
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {currentProjectIndex > 0 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-black h-6 w-6"
                      onClick={() => handleNavigateProjects('left')}
                    >
                      <ChevronLeft className="h-3 w-3 text-black" />
                      <span className="sr-only">Previous projects</span>
                    </Button>
                  )}
                  {currentProjectIndex < projects.length - 3 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-black h-6 w-6"
                      onClick={() => handleNavigateProjects('right')}
                    >
                      <ChevronRight className="h-3 w-3 text-black" />
                      <span className="sr-only">Next projects</span>
                    </Button>
                  )}
                </div>
                {visibleProjects.map((project) => (
                  <TabsContent key={project.projectName} value={project.projectName}>
                    <ProjectCard
                      project={project.shifts[0]}
                      isAssigned={assignedProject === project.projectName}
                      onAssign={() => handleAssignProject(project.projectName)}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveChanges} className="text-sm py-1 px-3">Save Changes</Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

const CompactWorkerCard = ({ worker, onReview, isReviewed, projects, updateProject }: { worker: WorkerData; onReview: (worker: WorkerData) => void; isReviewed: boolean; projects: ProjectData[]; updateProject: (projectName: string, isAssigning: boolean) => void }) => {
  const formattedRating = worker.rating.toString()
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = (updatedWorker: WorkerData) => {
    onReview(updatedWorker)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="w-full mb-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsOpen(true)}>
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={worker.image} alt={worker.name} />
                <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm truncate">{worker.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium ml-0.5">{formattedRating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mt-0.5">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${worker.punctualityScore}%` }}
                    />
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 text-primary mr-0.5" />
                    <span className="text-xs">{worker.punctualityScore}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {worker.requestedDays.map((dayInfo, index) => (
                <div
                  key={index}
                  className="px-1.5 py-0.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded-md flex items-center"
                >
                  {dayInfo.day}
                  {dayInfo.isNight ? (
                    <Moon className="w-3 h-3 ml-1 text-black fill-current" />
                  ) : (
                    <Sun className="w-3 h-3 ml-1 text-black fill-current" />
                  )}
                </div>
              ))}
            </div>
            {worker.cancelSwapStatus && (
              <div className="flex items-center mt-2 text-sm">
                {worker.cancelSwapStatus.type === 'cancel' ? (
                  <XCircle className="w-4 h-4 text-red-500 mr-1" />
                ) : (
                  <ArrowRightLeft className="w-4 h-4 text-blue-500 mr-1" />
                )}
                <span className="font-medium mr-1">
                  {worker.cancelSwapStatus.type === 'cancel' ? 'Canceled:' : 'Swapped:'}
                </span>
                <div className="flex items-center bg-gray-100 rounded-md px-2 py-1">
                  <span className="text-xs font-medium mr-1">{worker.cancelSwapStatus.day}</span>
                  {worker.cancelSwapStatus.isNight ? (
                    <Moon className="w-3 h-3 text-black fill-current" />
                  ) : (
                    <Sun className="w-3 h-3 text-black fill-current" />
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      {isReviewed ? (
        <ReviewedWorkerModal worker={worker} onClose={() => setIsOpen(false)} onSave={handleSave} projects={projects} updateProject={updateProject} />
      ) : (
        <UnreviewedWorkerModal worker={worker} onClose={() => setIsOpen(false)} onSave={handleSave} projects={projects} updateProject={updateProject} />
      )}
    </Dialog>
  )
}

interface CancelSwapRequest {
  type: 'cancel' | 'swap'
  day: string
  isNight: boolean
  projectName: string
  startTime: string
  endTime: string
  reason: string
}

interface WorkerDataWithRequest extends WorkerData {
  request: CancelSwapRequest
}

const CancelSwapWorkerModal = ({ worker, onClose, onSave, type, projects, updateProject }: { worker: WorkerDataWithRequest; onClose: () => void; onSave: (updatedWorker: WorkerDataWithRequest) => void; type: 'cancel' | 'swap'; projects: ProjectData[]; updateProject: (projectName: string, isAssigning: boolean) => void }) => {
  const [isPenalized, setIsPenalize] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<WorkerData | null>(null)

  const handlePenalize = () => {
    setIsPenalize(!isPenalized)
  }

  const handleSelectWorker = (worker: WorkerData) => {
    setSelectedWorker(worker)
  }

  const handleSaveChanges = () => {
    if (selectedWorker) {
      const updatedWorker: WorkerDataWithRequest = {
        ...worker,
        isPenalized,
        cancelSwapStatus: {
          type: type,
          day: worker.request.day,
          isNight: worker.request.isNight
        },
        replacementWorker: selectedWorker
      }
      if (worker.assignedProjects.length > 0) {
        updateProject(worker.assignedProjects[0], false)
      }
      onSave(updatedWorker)
      onClose()
    }
  }

  const suggestedWorkers = generateMockWorkerData(type === 'cancel' ? 3 : 1)

  return (
    <DialogContent className="sm:max-w-[900px] bg-white p-0">
      <div className="flex h-full">
        <div className="flex-1 p-6 border-r border-gray-200">
          <DialogHeader>
            <DialogTitle>{type === 'cancel' ? 'Worker Cancelling a Shift' : 'Worker Swapping a Shift'}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={worker.image} alt={worker.name} />
                <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold">{worker.name}</h2>
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">Punctuality Score:</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${worker.punctualityScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{worker.punctualityScore}%</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Shift Details:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                <ShiftBadge day={worker.request.day} isNight={worker.request.isNight} />
                <div className="px-2 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-md">
                  {worker.request.projectName}
                </div>
                <div className="px-2 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-md">
                  {worker.request.startTime} - {worker.request.endTime}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Reason for {type === 'cancel' ? 'Canceling' : 'Swapping'}:</label>
              <p className="mt-1 text-sm text-gray-600">{worker.request.reason}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="penalize" checked={isPenalized} onCheckedChange={handlePenalize} />
              <Label htmlFor="penalize">Penalize worker if the reason is unjustified</Label>
            </div>
            {isPenalized && (
              <div className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 border border-red-200 rounded-md inline-block">
                Penalized
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col">
          <DialogHeader>
            <DialogTitle>Replacement</DialogTitle>
          </DialogHeader>
          <div className="flex-grow flex items-center justify-center">
            <div className="w-full">
              {suggestedWorkers.map((suggestedWorker) => (
                <Card
                  key={suggestedWorker.id}
                  className={`w-full mb-2 cursor-pointer transition-all ${
                    selectedWorker?.id === suggestedWorker.id ? 'ring-2 ring-primary' : ''
                  } ${selectedWorker && selectedWorker.id !== suggestedWorker.id ? 'opacity-50' : ''}`}
                  onClick={() => handleSelectWorker(suggestedWorker)}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={suggestedWorker.image} alt={suggestedWorker.name} />
                        <AvatarFallback>{suggestedWorker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm truncate">{suggestedWorker.name}</h3>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium ml-0.5">{suggestedWorker.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${suggestedWorker.punctualityScore}%` }}
                            />
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 text-primary mr-0.5" />
                            <span className="text-xs">{suggestedWorker.punctualityScore}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {suggestedWorker.requestedDays.map((dayInfo, index) => (
                        <ShiftBadge key={index} day={dayInfo.day} isNight={dayInfo.isNight} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveChanges} disabled={!selectedWorker} className="text-sm py-1 px-3">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

const CancelSwapWorkerCard = ({ worker, onReview, projects, updateProject }: { worker: WorkerDataWithRequest; onReview: (worker: WorkerDataWithRequest) => void; projects: ProjectData[]; updateProject: (projectName: string, isAssigning: boolean) => void }) => {
  const formattedRating = worker.rating.toString()
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = (updatedWorker: WorkerDataWithRequest) => {
    onReview(updatedWorker)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="w-full mb-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsOpen(true)}>
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={worker.image} alt={worker.name} />
                <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm truncate">{worker.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium ml-0.5">{formattedRating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mt-0.5">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${worker.punctualityScore}%` }}
                    />
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 text-primary mr-0.5" />
                    <span className="text-xs">{worker.punctualityScore}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              {worker.request.type === 'cancel' ? (
                <XCircle className="w-4 h-4 text-red-500 mr-1" />
              ) : (
                <ArrowRightLeft className="w-4 h-4 text-blue-500 mr-1" />
              )}
              <span className="font-medium mr-1">
                {worker.request.type === 'cancel' ? 'Cancelling:' : 'Swapping:'}
              </span>
              <div className="flex items-center bg-gray-100 rounded-md px-2 py-1">
                <span className="text-xs font-medium mr-1">{worker.request.day}</span>
                {worker.request.isNight ? (
                  <Moon className="w-3 h-3 text-black fill-current" />
                ) : (
                  <Sun className="w-3 h-3 text-black fill-current" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <CancelSwapWorkerModal worker={worker} onClose={() => setIsOpen(false)} onSave={handleSave} type={worker.request.type} projects={projects} updateProject={updateProject} />
    </Dialog>
  )
}

const SmoothScrollSection = ({ title, icon, workers, onReview, type, isReviewed, projects, updateProject }: { title: string; icon: React.ReactNode; workers: WorkerData[] | WorkerDataWithRequest[]; onReview: (worker: WorkerData | WorkerDataWithRequest) => void; type: 'regular' | 'cancelSwap'; isReviewed: boolean; projects: ProjectData[]; updateProject: (projectName: string, isAssigning: boolean) => void }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let isScrolling = false
    let startY: number
    let startScrollTop: number

    const handleTouchStart = (e: TouchEvent) => {
      isScrolling = true
      startY = e.touches[0].pageY
      startScrollTop = scrollContainer.scrollTop
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling) return
      const deltaY = e.touches[0].pageY - startY
      scrollContainer.scrollTop = startScrollTop - deltaY
      e.preventDefault()
    }

    const handleTouchEnd = () => {
      isScrolling = false
    }

    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: false })
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false })
    scrollContainer.addEventListener('touchend', handleTouchEnd)

    return () => {
      scrollContainer.removeEventListener('touchstart', handleTouchStart)
      scrollContainer.removeEventListener('touchmove', handleTouchMove)
      scrollContainer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <Card className="col-span-1">
      <CardContent className="p-0">
        <div className="pt-3 pb-1 flex flex-col items-center justify-center">
          <div className="flex items-center mb-1">
            {icon}
            <span className="text-sm font-bold text-black ml-2">
              {title}
            </span>
          </div>
          <div className="w-16 h-0.5 bg-black rounded-full"></div>
        </div>
        <div className="p-2 h-[calc(100vh-200px)] overflow-y-auto" ref={scrollContainerRef}>
          <div className="space-y-2">
            {workers.map(worker => (
              type === 'regular' ? (
                <CompactWorkerCard key={worker.id} worker={worker as WorkerData} onReview={onReview as (worker: WorkerData) => void} isReviewed={isReviewed} projects={projects} updateProject={updateProject} />
              ) : (
                <CancelSwapWorkerCard key={worker.id} worker={worker as WorkerDataWithRequest} onReview={onReview as (worker: WorkerDataWithRequest) => void} projects={projects} updateProject={updateProject} />
              )
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ProjectFilterModal = ({ isOpen, onClose, projects, selectedProjects, onSelectProject, onApplyFilter }: {
  isOpen: boolean
  onClose: () => void
  projects: ProjectData[]
  selectedProjects: string[]
  onSelectProject: (projectName: string) => void
  onApplyFilter: () => void
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let isScrolling = false
    let startY: number
    let startScrollTop: number

    const handleTouchStart = (e: TouchEvent) => {
      isScrolling = true
      startY = e.touches[0].pageY
      startScrollTop = scrollContainer.scrollTop
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling) return
      const deltaY = e.touches[0].pageY - startY
      scrollContainer.scrollTop = startScrollTop - deltaY
      e.preventDefault()
    }

    const handleTouchEnd = () => {
      isScrolling = false
    }

    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: false })
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false })
    scrollContainer.addEventListener('touchend', handleTouchEnd)

    return () => {
      scrollContainer.removeEventListener('touchstart', handleTouchStart)
      scrollContainer.removeEventListener('touchmove', handleTouchMove)
      scrollContainer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Projects Filter</DialogTitle>
        </DialogHeader>
        <div className="flex h-[500px]">
          <div className="flex-1 p-6 border-r border-gray-200">
            <h3 className="font-semibold mb-2">Projects Pool</h3>
            <div className="h-[400px] overflow-y-auto space-y-2 pr-2" ref={scrollContainerRef}>
              {projects.filter(p => !selectedProjects.includes(p.projectName)).map((project) => (
                <Card key={project.projectName} className="cursor-pointer hover:bg-gray-50" onClick={() => onSelectProject(project.projectName)}>
                  <CardContent className="flex justify-between items-center p-2">
                    <span>{project.projectName}</span>
                    <Checkbox checked={false} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex-1 p-6 flex flex-col">
            <h3 className="font-semibold mb-2">Selected Projects</h3>
            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
              {selectedProjects.map((projectName) => (
                <Card key={projectName} className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="flex justify-between items-center p-2">
                    <span>{projectName}</span>
                    <Button variant="ghost" size="sm" onClick={() => onSelectProject(projectName)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={onApplyFilter}>Apply Filter</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ShiftAllocation() {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isProjectsSelected, setIsProjectsSelected] = useState(false)
  const [isCalendarSelected, setIsCalendarSelected] = useState(false)
  const [isDayShift, setIsDayShift] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [workers, setWorkers] = useState(generateMockWorkerData(50))
  const [projects, setProjects] = useState(initialMockProjectData)
  const [cancelSwapRequests, setCancelSwapRequests] = useState<WorkerDataWithRequest[]>([
    {
      ...workers[0],
      request: { type: 'cancel', day: 'Mon', isNight: false, projectName: 'Project A', startTime: '10:00 AM', endTime: '12:00 PM', reason: 'Family emergency' }
    },
    {
      ...workers[1],
      request: { type: 'swap', day: 'Wed', isNight: true, projectName: 'Project B', startTime: '8:00 PM', endTime: '10:00 PM', reason: 'Doctor appointment' }
    },
    {
      ...workers[2],
      request: { type: 'cancel', day: 'Fri', isNight: true, projectName: 'Project C', startTime: '11:00 PM', endTime: '1:00 AM', reason: 'Unexpected travel' }
    },
    {
      ...workers[3],
      request: { type: 'swap', day: 'Tue', isNight: false, projectName: 'Project D', startTime: '2:00 PM', endTime: '4:00 PM', reason: 'Personal commitment' }
    },
    {
      ...workers[4],
      request: { type: 'cancel', day: 'Thu', isNight: false, projectName: 'Project E', startTime: '9:00 AM', endTime: '11:00 AM', reason: 'Car trouble' }
    },
  ])

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })

  const projectsPerPage = 18

  const filteredProjects = useMemo(() => {
    if (selectedDays.length === 0 && !isFilterActive && !dateRange.from && !dateRange.to) {
      return projects
    }

    return projects.filter(project => {
      const hasSelectedDayShift = selectedDays.length === 0 || project.shifts.some(shift => selectedDays.includes(daysOfWeek[shift.date.getDay()]))
      const isSelectedProject = !isFilterActive || selectedProjects.includes(project.projectName)
      const isWithinDateRange = !dateRange.from && !dateRange.to || project.shifts.some(shift => 
        (!dateRange.from || isAfter(shift.date, dateRange.from) || isSameDay(shift.date, dateRange.from)) &&
        (!dateRange.to || isBefore(shift.date, dateRange.to) || isSameDay(shift.date, dateRange.to))
      )
      const matchesShiftType = project.shifts.some(shift => shift.isNightShift === !isDayShift)
      return hasSelectedDayShift && isSelectedProject && isWithinDateRange && matchesShiftType
    })
  }, [projects, selectedDays, isFilterActive, selectedProjects, dateRange, isDayShift])

  const aggregatedProjects = useMemo(() => {
    return filteredProjects.map(project => {
      const relevantShifts = project.shifts.filter(shift => 
        (selectedDays.length === 0 || selectedDays.includes(daysOfWeek[shift.date.getDay()])) &&
        (!dateRange.from || isAfter(shift.date, dateRange.from) || isSameDay(shift.date, dateRange.from)) &&
        (!dateRange.to || isBefore(shift.date, dateRange.to) || isSameDay(shift.date, dateRange.to)) &&
        shift.isNightShift === !isDayShift
      )
      const totalDemand = relevantShifts.reduce((sum, shift) => sum + shift.demand, 0)
      const totalCoverage = relevantShifts.reduce((sum, shift) => sum + shift.coverage[0], 0)
      const totalRequired = relevantShifts.reduce((sum, shift) => sum + shift.coverage[1], 0)
      const totalAssignedWorkers = relevantShifts.reduce((sum, shift) => sum + shift.assignedWorkers, 0)

      return {
        projectName: project.projectName,
        isNightShift: !isDayShift,
        coverage: [totalCoverage, totalRequired] as [number, number],
        demand: totalDemand,
        assignedWorkers: totalAssignedWorkers
      }
    })
  }, [filteredProjects, selectedDays, dateRange, isDayShift])

  const totalPages = Math.ceil(aggregatedProjects.length / projectsPerPage)

  const paginatedProjects = aggregatedProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  )

  const handleDaySelect = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleProjectSelect = (projectName: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectName)
        ? prev.filter(p => p !== projectName)
        : [...prev, projectName]
    )
  }

  const handleApplyFilter = () => {
    setIsFilterActive(selectedProjects.length > 0)
    setIsFilterModalOpen(false)
  }

  const handleProjectsButtonClick = () => {
    if (isFilterActive) {
      setSelectedProjects([])
      setIsFilterActive(false)
    } else {
      setIsFilterModalOpen(true)
    }
  }

  const updateProject = (projectName: string, isAssigning: boolean) => {
    setProjects(prevProjects => prevProjects.map(project => {
      if (project.projectName === projectName) {
        const updatedShifts = project.shifts.map(shift => {
          const [covered, total] = shift.coverage
          const newCovered = isAssigning ? covered + 1 : Math.max(0, covered - 1)
          const newAssignedWorkers = isAssigning ? shift.assignedWorkers + 1 : Math.max(0, shift.assignedWorkers - 1)
          return { ...shift, coverage: [newCovered, total] as [number, number], assignedWorkers: newAssignedWorkers }
        })
        return { ...project, shifts: updatedShifts }
      }
      return project
    }))
  }

  const handleReviewWorker = (updatedWorker: WorkerData) => {
    setWorkers(prevWorkers => prevWorkers.map(worker => 
      worker.id === updatedWorker.id ? updatedWorker : worker
    ))
  }

  const handleReviewCancelSwap = (updatedWorker: WorkerDataWithRequest) => {
    setCancelSwapRequests(prevRequests => prevRequests.filter(request => request.id !== updatedWorker.id))
    setWorkers(prevWorkers => [...prevWorkers, updatedWorker])
  }

  const unreviewedWorkers = workers.filter(worker => worker.assignedProjects.length === 0 && !worker.cancelSwapStatus)
  const reviewedWorkers = workers.filter(worker => worker.assignedProjects.length > 0 || worker.cancelSwapStatus)

  const formatDateRange = (from: Date | undefined, to: Date | undefined) => {
    if (!from && !to) return ''
    if (from && to && isSameDay(from, to)) {
      return `Viewing: ${format(from, 'MMM d')} only`
    }
    return `Viewing: ${from ? format(from, 'MMM d') : 'Start'} - ${to ? format(to, 'MMM d') : 'End'}`
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mb-6">
        <CardContent className="pt-2">
          <div className="flex justify-center mb-8 items-center">
            <button
              className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors relative overflow-hidden border-2 ${
                isDayShift ? "bg-white text-black border-black" : "bg-black text-white border-white"
              }`}
              onClick={() => setIsDayShift(!isDayShift)}
              style={{ width: '140px', height: '32px' }}
            >
              <AnimatePresence initial={false}>
                {isDayShift ? (
                  <motion.div
                    key="day"
                    className="absolute inset-0 flex items-center justify-between px-2"
                    initial={{ x: -140 }}
                    animate={{ x: 0 }}
                    exit={{ x: -140 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Sun className="w-4 h-4 text-black" />
                    <span className="mx-1 text-black">Day Shifts</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="night"
                    className="absolute inset-0 flex items-center justify-between px-2"
                    initial={{ x: 140 }}
                    animate={{ x: 0 }}
                    exit={{ x: 140 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <span className="mx-1 text-white">Night Shifts</span>
                    <Moon className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <div className="w-1.5"></div>
            <button
              className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isFilterActive
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
              onClick={handleProjectsButtonClick}
            >
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              <span>Projects</span>
            </button>
            <div className="w-1.5"></div>
            <nav className="bg-black rounded-md p-0.75 flex">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    selectedDays.includes(day)
                      ? "bg-red-500 text-white"
                      : "text-white hover:bg-gray-800"
                  }`}
                  onClick={() => handleDaySelect(day)}
                >
                  {day}
                </button>
              ))}
            </nav>
            <div className="w-1.5"></div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={isCalendarSelected ? "outline" : "default"}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isCalendarSelected
                      ? "bg-white text-black border border-black"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setIsCalendarSelected(true)
                    setIsProjectsSelected(false)
                    setSelectedDays([])
                  }}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Calendar</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(newDateRange) => {
                    if (newDateRange) {
                      setDateRange(newDateRange)
                      setIsCalendarSelected(true)
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <div className="w-1.5"></div>
            {(dateRange.from || dateRange.to) && (
              <span className="text-sm font-medium">
                {formatDateRange(dateRange.from, dateRange.to)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {paginatedProjects.map((shift, index) => {
              const coveragePercentage = calculateCoveragePercentage(shift.coverage[0], shift.coverage[1])
              const progressBarColor = getProgressBarColor(coveragePercentage)
              
              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-sm truncate">
                            {shift.projectName}
                          </span>
                          {coveragePercentage === 100 ? (
                            <div className="w-5 h-5 rounded-full bg-white border-2 border-green-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-green-500" />
                            </div>
                          ) : (
                            <span className={`text-xs font-medium ${coveragePercentage > 100 ? 'text-red-500' : 'text-gray-500'}`}>
                              {coveragePercentage}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${progressBarColor}`}
                              style={{ width: `${Math.min(coveragePercentage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="bg-gray-100 rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap">
                            {`${shift.coverage[0]}/${shift.coverage[1]}`}
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{shift.projectName}</p>
                      <p>Assigned Workers: {shift.assignedWorkers}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SmoothScrollSection
          title="Unreviewed"
          icon={<ClipboardList className="w-5 h-5 text-black" />}
          workers={unreviewedWorkers}
          onReview={handleReviewWorker}
          type="regular"
          isReviewed={false}
          projects={projects}
          updateProject={updateProject}
        />
        <SmoothScrollSection
          title="Reviewed"
          icon={<CheckSquare className="w-5 h-5 text-black" />}
          workers={reviewedWorkers}
          onReview={handleReviewWorker}
          type="regular"
          isReviewed={true}
          projects={projects}
          updateProject={updateProject}
        />
        <SmoothScrollSection
          title="Cancels & Swaps"
          icon={<Repeat className="w-5 h-5 text-black" />}
          workers={cancelSwapRequests}
          onReview={handleReviewCancelSwap}
          type="cancelSwap"
          isReviewed={false}
          projects={projects}
          updateProject={updateProject}
        />
      </div>

      <ProjectFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        projects={projects}
        selectedProjects={selectedProjects}
        onSelectProject={handleProjectSelect}
        onApplyFilter={handleApplyFilter}
      />
    </div>
  )
}