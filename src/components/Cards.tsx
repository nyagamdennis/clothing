import React from 'react'
import { EllipsisVerticalIcon, BanknotesIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'
import CurrencyFormatter from './CurrencyFormatter';


interface cardsData {
  salesDiff: number;
  increased: boolean;
  percentageDifference: number;
  thisMonthsSales: string;
}

const Cards: React.FC<cardsData> = ({ salesDiff, increased, percentageDifference, thisMonthsSales }) => {

  return (
    <div className=' cursor-pointer bg-white shadow-md shadow-slate-200 rounded-lg overflow-hidden p-3 flex flex-col justify-between space-y-7'>
      <div className='flex justify-between'>
        <div className='flex space-x-2'>
          {increased ?
            <div className='bg-green-100 flex justify-center items-center w-8 rounded-lg'>
              <BanknotesIcon className='h-6 w-6  !text-green-600 ' />
            </div> :
            <div className='bg-orange-100 flex justify-center items-center w-8 rounded-lg'>
              <BanknotesIcon className='h-6 w-6  !text-orange-600 ' />
            </div>
          }

          <h4 className=' font-semibold text-gray-500'>New Income</h4>
        </div>
        <div className=' bg-white  border cursor-pointer p-0.5 rounded-full'>
          <EllipsisVerticalIcon className='h-6 w-6' />
        </div>

      </div>
      <div>
        <h4 className=' text-2xl whitespace-nowrap font-roboto'>
          {CurrencyFormatter({ amount: thisMonthsSales, currencySymbol: 'Ksh', asString: true }) || ''}
        </h4>
      </div>
      <div className='flex items-center space-x-2'>
        {/* <div className='flex items-center space-x-2 bg-green-100 px-2 rounded-lg'></div> */}
        {increased ? <div className='flex items-center space-x-2 bg-green-100 px-2 rounded-lg'>
          <p className=' text-green-600'>{percentageDifference}%</p>
          <ArrowTrendingUpIcon className='h-4 w-4 text-green-600' />
        </div> : <div className='flex items-center space-x-2 bg-orange-100 px-2 rounded-lg'>
          <p className=' text-orange-600'>-{percentageDifference}%</p>
          <ArrowTrendingDownIcon className='h-4 w-4 text-orange-600' />
        </div>
        }
        <p className=' text-sm text-gray-400'>from last month</p>
      </div>
    </div>
  )
}

export default Cards