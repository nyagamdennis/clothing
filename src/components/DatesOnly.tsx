import React from 'react'

interface DatesData {
    dateStr: string;
}

const DatesOnly: React.FC<DatesData> = ({dateStr}) => {
    const date = new Date(dateStr);

    const readableDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  return (
    <>{readableDate}</>
  )
}

export default DatesOnly