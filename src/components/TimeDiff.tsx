import React, { useState, useEffect } from 'react';

interface TimerData {
  dueDateTime: string;
}

const TimeDiff: React.FC<TimerData> = ({ dueDateTime }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    // Function to calculate time remaining
    const calculateTimeRemaining = () => {
      const now = new Date();
      const dueDate = new Date(dueDateTime);

      // Calculate time difference in milliseconds
      const diffMs = dueDate.getTime() - now.getTime();

      // Convert milliseconds to units of time
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);
      const diffYears = Math.floor(diffDays / 365);

      // Determine which unit to display
      if (diffMs <= 0) {
        return 'Due time has passed';
      } else if (diffYears >= 1) {
        return `${diffYears} year${diffYears > 1 ? 's' : ''} remaining`;
      } else if (diffMonths >= 1) {
        return `${diffMonths} month${diffMonths > 1 ? 's' : ''} remaining`;
      } else if (diffWeeks >= 1) {
        return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} remaining`;
      } else if (diffDays >= 1) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
      } else if (diffHours >= 1) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`;
      } else if (diffMinutes >= 1) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} remaining`;
      } else {
        return `Less than a minute remaining`;
      }
    };

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    // Optional: Update the time every minute
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000); // Update every 60 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [dueDateTime]);

  return (
    <div>
      <h3>{timeRemaining}</h3>
    </div>
  );
};

export default TimeDiff;
