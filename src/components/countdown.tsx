"use client"; 
import { useState, useRef, useEffect, ChangeEvent } from "react"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 

export default function Countdown() {

  const [duration, setDuration] = useState<number | string>("");
 
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const [isActive, setIsActive] = useState<boolean>(false);

  const [isPaused, setIsPaused] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to handle setting the duration of the countdown
  const handleSetDuration = (): void => {

    if (typeof duration === "number" && duration > 0) {

      setTimeLeft(duration); 
      setIsActive(false);
      setIsPaused(false); 
      
      if (timerRef.current) {

        clearInterval(timerRef.current);
      }
    }
  };

  // Function to start the countdown timer
  const handleStart = (): void => {

    if (timeLeft > 0) {
      setIsActive(true); 
      setIsPaused(false); 
    }
  };

  // Function to pause the countdown timer
  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);

      // Clear any existing timer
      if (timerRef.current) {

        clearInterval(timerRef.current);
      }
    }
  };

  // Function to reset the countdown timer
  const handleReset = (): void => {
    setIsActive(false); // Set the timer as inactive
    setIsPaused(false); // Set the timer as not paused
    setTimeLeft(typeof duration === "number" ? duration : 0); 
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // useEffect hook to manage the countdown interval
  useEffect(() => {
    // If the timer is active and not paused
    if (isActive && !isPaused) {
      // Set an interval to decrease the time left
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          // If time is up, clear the interval
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          // Decrease the time left by one second
          return prevTime - 1;
        });
      }, 1000); // Interval of 1 second
    }
    // Cleanup function to clear the interval
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]); 

  // Function to format the time left into mm:ss format
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60); 
    const seconds = time % 60; 

    // Return the formatted string
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Function to handle changes in the duration input field
  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || ""); // Update the duration state
  };

  // JSX return statement rendering the Countdown UI
  return (
    // Container div for centering the content
    <div className="flex flex-col items-center justify-center h-screen bg-blue-300">
      {/* Timer box container */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Title of the countdown timer */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
          Countdown Timer
        </h1>
        {/* Input and set button container */}
        <div className="flex items-center mb-6">
          <Input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <Button
            onClick={handleSetDuration}
            variant="outline"
            className="text-gray-800 dark:text-gray-200 bg-blue-400"
          >
            Set
          </Button>
        </div>
     
        <div className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
          {formatTime(timeLeft)}
        </div>
  
        <div className="flex justify-center gap-5">
          <Button
            onClick={handleStart}
            variant="outline"
            className="text-gray-800 dark:text-gray-200 bg-blue-400"
          >
            {isPaused ? "Resume" : "Start"}
          </Button>
          <Button
            onClick={handlePause}
            variant="outline"
            className="text-gray-800 dark:text-gray-200  bg-blue-400"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-gray-800 dark:text-gray-200  bg-blue-400"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}