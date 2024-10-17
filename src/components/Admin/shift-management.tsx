"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mock data for available projects
const availableProjects = [
  { id: 1, name: "Project A" },
  { id: 2, name: "Project B" },
  { id: 3, name: "Project C" },
]

// Mock data for shift leaders
const shiftLeaders = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Mike Johnson" },
]

// Days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

interface Shift {
  date: string
  day: string
  startTime: string
  endTime: string
  workers: number
  type: "day" | "night"
  leader: string
  shiftType: "normal" | "filler"
}

interface ProjectWithShifts {
  id: number
  name: string
  shifts: Shift[]
}

export function ShiftManagementComponent() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [selectedLeader, setSelectedLeader] = useState<string>("")
  const [projectsWithShifts, setProjectsWithShifts] = useState<ProjectWithShifts[]>([])
  const [currentShift, setCurrentShift] = useState<Shift>({
    date: "",
    day: "Monday",
    startTime: "",
    endTime: "",
    workers: 1,
    type: "day",
    leader: "",
    shiftType: "normal",
  })
  const [editingShift, setEditingShift] = useState<{ projectId: number; shiftIndex: number } | null>(null)

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(Number(projectId))
    setSelectedLeader("") // Reset leader when project changes
  }

  const handleLeaderSelect = (leaderId: string) => {
    const leader = shiftLeaders.find(l => l.id.toString() === leaderId)
    setSelectedLeader(leader ? leader.name : "")
  }

  const handleShiftChange = (field: keyof Shift, value: string | number) => {
    setCurrentShift(prev => ({ ...prev, [field]: value }))
  }

  const handleAddShift = () => {
    if (selectedProject && selectedLeader) {
      const newShift = { ...currentShift, leader: selectedLeader }
      setProjectsWithShifts(prev => {
        const existingProjectIndex = prev.findIndex(p => p.id === selectedProject)
        if (existingProjectIndex > -1) {
          const updatedProjects = [...prev]
          updatedProjects[existingProjectIndex].shifts.push(newShift)
          return updatedProjects
        } else {
          const newProject = availableProjects.find(p => p.id === selectedProject)
          if (newProject) {
            return [...prev, { ...newProject, shifts: [newShift] }]
          }
        }
        return prev
      })
      // Reset current shift
      setCurrentShift({
        date: "",
        day: "Monday",
        startTime: "",
        endTime: "",
        workers: 1,
        type: "day",
        leader: "",
        shiftType: "normal",
      })
    }
  }

  const handleEditShift = () => {
    if (editingShift) {
      setProjectsWithShifts(prev =>
        prev.map(project =>
          project.id === editingShift.projectId
            ? {
                ...project,
                shifts: project.shifts.map((shift, index) =>
                  index === editingShift.shiftIndex ? currentShift : shift
                ),
              }
            : project
        )
      )
      setEditingShift(null)
    }
  }

  const openEditModal = (projectId: number, shiftIndex: number) => {
    const project = projectsWithShifts.find(p => p.id === projectId)
    if (project) {
      setCurrentShift(project.shifts[shiftIndex])
      setEditingShift({ projectId, shiftIndex })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Project and Leader Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project-select">Select Project</Label>
              <Select onValueChange={handleProjectSelect}>
                <SelectTrigger id="project-select">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedProject && (
              <div>
                <Label htmlFor="leader-select">Select Shift Leader</Label>
                <Select onValueChange={handleLeaderSelect}>
                  <SelectTrigger id="leader-select">
                    <SelectValue placeholder="Select a shift leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {shiftLeaders.map(leader => (
                      <SelectItem key={leader.id} value={leader.id.toString()}>
                        {leader.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedLeader && (
              <div>
                <Label>Shift Type</Label>
                <RadioGroup
                  value={currentShift.shiftType}
                  onValueChange={(value) => handleShiftChange("shiftType", value as "normal" | "filler")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal-shift" />
                    <Label htmlFor="normal-shift">Normal Shift</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="filler" id="filler-shift" />
                    <Label htmlFor="filler-shift">Filler Shift</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={currentShift.date}
                    onChange={e => handleShiftChange("date", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="day">Day</Label>
                  <Select
                    value={currentShift.day}
                    onValueChange={value => handleShiftChange("day", value)}
                  >
                    <SelectTrigger id="day">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map(day => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={currentShift.startTime}
                    onChange={e => handleShiftChange("startTime", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={currentShift.endTime}
                    onChange={e => handleShiftChange("endTime", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="workers">Number of Workers</Label>
                <Input
                  id="workers"
                  type="number"
                  min="1"
                  value={currentShift.workers}
                  onChange={e => handleShiftChange("workers", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Shift Time</Label>
                <RadioGroup
                  value={currentShift.type}
                  onValueChange={value => handleShiftChange("type", value as "day" | "night")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="day" id="day" />
                    <Label htmlFor="day">Day Shift</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="night" id="night" />
                    <Label htmlFor="night">Night Shift</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button
                type="button"
                onClick={handleAddShift}
                disabled={!selectedProject || !selectedLeader || !currentShift.date || !currentShift.shiftType}
                className="w-full"
              >
                Add Shift
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <Card>
        <CardHeader>
          <CardTitle>Projects with Shifts</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={projectsWithShifts.map(p => p.id.toString())}>
            {projectsWithShifts.map(project => (
              <AccordionItem key={project.id} value={project.id.toString()}>
                <AccordionTrigger>{project.name}</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Workers</TableHead>
                        <TableHead>Shift Time</TableHead>
                        <TableHead>Shift Type</TableHead>
                        <TableHead>Leader</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.shifts.map((shift, index) => (
                        <TableRow key={index}>
                          <TableCell>{shift.date}</TableCell>
                          <TableCell>{shift.day}</TableCell>
                          <TableCell>{shift.startTime}</TableCell>
                          <TableCell>{shift.endTime}</TableCell>
                          <TableCell>{shift.workers}</TableCell>
                          <TableCell>{shift.type} shift</TableCell>
                          <TableCell>{shift.shiftType} shift</TableCell>
                          <TableCell>{shift.leader}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditModal(project.id, index)}
                                >
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Shift</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-date">Date</Label>
                                      <Input
                                        id="edit-date"
                                        type="date"
                                        value={currentShift.date}
                                        onChange={e => handleShiftChange("date", e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-day">Day</Label>
                                      <Select
                                        value={currentShift.day}
                                        onValueChange={value => handleShiftChange("day", value)}
                                      >
                                        <SelectTrigger id="edit-day">
                                          <SelectValue placeholder="Select a day" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {daysOfWeek.map(day => (
                                            <SelectItem key={day} value={day}>
                                              {day}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-startTime">Start Time</Label>
                                      <Input
                                        id="edit-startTime"
                                        type="time"
                                        value={currentShift.startTime}
                                        onChange={e => handleShiftChange("startTime", e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-endTime">End Time</Label>
                                      <Input
                                        id="edit-endTime"
                                        type="time"
                                        value={currentShift.endTime}
                                        onChange={e => handleShiftChange("endTime", e.target.value)}
                                      />
                                    
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-workers">Number of Workers</Label>
                                    <Input
                                      id="edit-workers"
                                      type="number"
                                      min="1"
                                      value={currentShift.workers}
                                      onChange={e => handleShiftChange("workers", parseInt(e.target.value))}
                                    />
                                  </div>
                                  <div>
                                    <Label>Shift Time</Label>
                                    <RadioGroup
                                      value={currentShift.type}
                                      onValueChange={value => handleShiftChange("type", value as "day" | "night")}
                                      className="flex space-x-4"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="day" id="edit-day-shift" />
                                        <Label htmlFor="edit-day-shift">Day Shift</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="night" id="edit-night-shift" />
                                        <Label htmlFor="edit-night-shift">Night Shift</Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                  <div>
                                    <Label>Shift Type</Label>
                                    <RadioGroup
                                      value={currentShift.shiftType}
                                      onValueChange={value => handleShiftChange("shiftType", value as "normal" | "filler")}
                                      className="flex space-x-4"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="normal" id="edit-normal-shift" />
                                        <Label htmlFor="edit-normal-shift">Normal Shift</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="filler" id="edit-filler-shift" />
                                        <Label htmlFor="edit-filler-shift">Filler Shift</Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-leader">Shift Leader</Label>
                                    <Select
                                      value={currentShift.leader}
                                      onValueChange={value => handleShiftChange("leader", value)}
                                    >
                                      <SelectTrigger id="edit-leader">
                                        <SelectValue placeholder="Select a shift leader" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {shiftLeaders.map(leader => (
                                          <SelectItem key={leader.id} value={leader.name}>
                                            {leader.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button type="button" onClick={handleEditShift} className="w-full">
                                    Save Changes
                                  </Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}