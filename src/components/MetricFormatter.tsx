import React from 'react'


interface MetricFormatterProps {
    total: number | string;
}


const MetricFormatter: React.FC<MetricFormatterProps> = ({ total }) => {
    // const formattedTotal = total.toLocaleString(); // Format the number with commas
    // return <span>{formattedTotal} m</span>;
    // const formattedTotal = total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // return <span>{formattedTotal} m</span>;

    const numericTotal = typeof total === 'string' ? parseFloat(total) : total;

    // Format the number with commas and two decimal places
    const formattedTotal = numericTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return <span>{formattedTotal} inches</span>;
};


export default MetricFormatter