import React from 'react'


interface DatesData {
    dateStr: string;
}

const DatesOps: React.FC<DatesData> = ({dateStr}) => {
    const date = new Date(dateStr);

    const readableDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true, // For 12-hour format, use false for 24-hour format
      });

  return (
    <>{readableDate}</>
  )
}

export default DatesOps