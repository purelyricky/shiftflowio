"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, RefreshCw } from "lucide-react"

export function WorkerClockIn() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isClockIn, setIsClockIn] = useState(true)
  const [workersExpected, setWorkersExpected] = useState(10)
  const [workersClockedIn, setWorkersClockedIn] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshData()
    }, 600000) // 10 minutes in milliseconds

    return () => clearInterval(refreshInterval)
  }, [])

  useEffect(() => {
    if (workersClockedIn === workersExpected) {
      setIsClockIn(false)
    }
  }, [workersClockedIn, workersExpected])

  const handleClockInOut = () => {
    setIsClockIn(!isClockIn)
  }

  const refreshData = () => {
    // Simulating data refresh
    setWorkersExpected(Math.floor(Math.random() * 20) + 1)
    setWorkersClockedIn(Math.floor(Math.random() * workersExpected))
    setLastRefresh(new Date())
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">Current Shift Status</CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">Overview of expected and clocked-in workers</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="text-lg sm:text-xl font-semibold">{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="text-xs sm:text-sm text-muted-foreground">
                Last refresh: {lastRefresh.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">Workers Expected: {workersExpected}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">Workers Clocked In: {workersClockedIn}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            QR Code for {isClockIn ? "Clock In" : "Clock Out"}
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            Workers should scan this QR code to {isClockIn ? "clock in" : "clock out"}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="w-48 h-48 sm:w-64 sm:h-64 bg-muted flex items-center justify-center">
            <span className="text-sm sm:text-base text-muted-foreground">QR Code Placeholder</span>
          </div>
          <Button onClick={handleClockInOut}>
            Switch to {isClockIn ? "Clock Out" : "Clock In"}
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-xs sm:text-sm text-muted-foreground">
        This page auto-refreshes every 10 minutes to ensure data accuracy.
      </div>
    </div>
  )
}