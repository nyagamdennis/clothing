import React from 'react';

interface Currency {
    amount: number | string | null | undefined; // Allow null or undefined to handle invalid values gracefully
    currencySymbol: string;
    asString?: boolean; // Optional prop
}

const CurrencyFormatter: React.FC<Currency> = ({ amount, currencySymbol, asString = false }) => {
    let formattedAmount = '';

    if (amount !== null && amount !== undefined) {
        // Ensure `amount` is valid before calling toLocaleString
        formattedAmount = typeof amount === 'number' 
            ? amount.toLocaleString() 
            : parseFloat(amount).toLocaleString();
    } else {
        // Default value if amount is invalid
        formattedAmount = '0';
    }

    if (asString) {
        return <>{`${currencySymbol} ${formattedAmount}`}</>;
    }

    return (
        <span className=''>
            {currencySymbol} {formattedAmount}
        </span>
    );
};

export default CurrencyFormatter;
