import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, BanknotesIcon, EllipsisVerticalIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import React from 'react'



interface TotalOrdersCardsData {
    ordersDiff: number;
    orderIncreased: boolean;
    OrderPercentageDifference: number;
    thisMonthsOrders: string;
  }

const TotalOrdersCard: React.FC<TotalOrdersCardsData> = ({ ordersDiff, orderIncreased, OrderPercentageDifference, thisMonthsOrders }) => {
  return (
    <div className=' cursor-pointer bg-white shadow-md shadow-slate-200 rounded-lg overflow-hidden p-3 flex flex-col justify-between space-y-7'>
      <div className='flex justify-between'>
        <div className='flex space-x-2'>
          {orderIncreased ?
            <div className='bg-green-100 flex justify-center items-center w-8 rounded-lg'>
              <ShoppingBagIcon className='h-6 w-6  !text-green-600 ' />
            </div> :
            <div className='bg-orange-100 flex justify-center items-center w-8 rounded-lg'>
              <ShoppingBagIcon className='h-6 w-6  !text-orange-600 ' />
            </div>
          }

          <h4 className=' font-semibold text-gray-500'>Total Orders</h4>
        </div>
        <div className=' bg-white  border cursor-pointer p-0.5 rounded-full'>
          <EllipsisVerticalIcon className='h-6 w-6' />
        </div>

      </div>
      <div>
        <h4 className=' text-4xl font-roboto'>
          {thisMonthsOrders}
          {/* {CurrencyFormatter({ amount: thisMonthsOrders, currencySymbol: 'Ksh', asString: true }) || ''} */}
        </h4>
      </div>
      <div className='flex items-center space-x-2'>
        {/* <div className='flex items-center space-x-2 bg-green-100 px-2 rounded-lg'></div> */}
        {orderIncreased ? <div className='flex items-center space-x-2 bg-green-100 px-2 rounded-lg'>
          <p className=' text-green-600'>{OrderPercentageDifference}%</p>
          <ArrowTrendingUpIcon className='h-4 w-4 text-green-600' />
        </div> : <div className='flex items-center space-x-2 bg-orange-100 px-2 rounded-lg'>
          <p className=' text-orange-600'>-{OrderPercentageDifference}%</p>
          <ArrowTrendingDownIcon className='h-4 w-4 text-orange-600' />
        </div>
        }


        <p className=' text-sm text-gray-400'>from last month</p>
      </div>
    </div>
  )
}

export default TotalOrdersCard