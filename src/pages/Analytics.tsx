// @ts-nocheck

import React, { useEffect } from 'react'
import LeftNav from '../components/LeftNav'
import TopNavBar from '../components/TopNavBar'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleSidebar } from '../features/sidebar/sidebarSlice';
import Cards from '../components/Cards';
import { LineChart } from '@mui/x-charts/LineChart';
import { fetchAnalytics, selectAllAnalytics } from '../features/analysis/analyticsSlice';
import SalesCard from '../components/TotalOrdersCard';
import TotalCustomerCard from '../components/TotalCustomerCard';




const Analytics = () => {
    const analytics = useAppSelector(selectAllAnalytics);

    const dispatch = useAppDispatch();
    const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);

    useEffect(() => {
        dispatch(fetchAnalytics())
    }, [dispatch])


    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
    };

    const getMonthName = (monthNumber: number): string => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('default', { month: 'long' });
    };

    const today = new Date();
    const todaysMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();


    const lastMonthDate = new Date(today);
    lastMonthDate.setMonth(today.getMonth() - 1);
    const lastMonth = lastMonthDate.getMonth() + 1;
    const lastMonthYear = lastMonthDate.getFullYear();

    // Filter the analytics data for the current month and last month
    const todaysMonthData = analytics.find(
        (item) => item.month === todaysMonth && item.year === currentYear
    );

    // console.log('todays data ', todaysMonthData?.total_sales_amount)
    const lastMonthData = analytics.find(
        (item) => item.month === lastMonth && item.year === lastMonthYear
    );




    const xLabels = analytics.map((item) => getMonthName(item.month)); // Extract month names
    const uData = analytics.map((item) => parseFloat(item.total_sales_amount)); // Extract total sales amounts



    const thisMonthsSales = todaysMonthData?.total_sales_amount || '0';
    const lastMonthsSales = lastMonthData?.total_sales_amount || '0';

    const thisMonthsOrders = todaysMonthData?.number_of_orders || '0';
    const lastMonthsOrders = lastMonthData?.number_of_orders || '0';

    // console.log('sales diff ', thisMonthsSales - lastMonthsSales)

    const SalesDifference = (lastMSales: number, thisMSales: number): [number, boolean, number] => {
        const sales_diff = thisMSales - lastMSales;
        const percentage_diff = lastMSales !== 0 ? parseFloat(((sales_diff / lastMSales) * 100).toFixed(1)) : 0;

        // If the current month's sales are greater than last month's sales, return true and the sales difference
        if (thisMSales > lastMSales) {
            return [sales_diff, true, percentage_diff];
        }
        // If the current month's sales are less than or equal to last month's, return false and the absolute sales difference
        return [Math.abs(sales_diff), false, Math.abs(percentage_diff)];
    };


    const totalOrders = (thisMOrders: number, lastMOrders: number): [number, boolean, number] => {
        const orders_diff = thisMOrders - lastMOrders;
        const percentage_diff = lastMOrders !== 0 ? parseFloat(((orders_diff / lastMOrders) * 100).toFixed(1)) : 0;

        // If the current month's sales are greater than last month's sales, return true and the sales difference
        if (thisMOrders > lastMOrders) {
            return [orders_diff, true, percentage_diff];
        }
        // If the current month's sales are less than or equal to last month's, return false and the absolute sales difference
        return [Math.abs(orders_diff), false, Math.abs(percentage_diff)];
    }

    const [salesDifference, increased, percentageDifference] = SalesDifference(
        parseFloat(lastMonthsSales),
        parseFloat(thisMonthsSales)
    );

    const [ordersDifference, Ordersincreased, OrderspercentageDifference] = totalOrders(
        parseFloat(lastMonthsOrders),
        parseFloat(thisMonthsOrders)
    );



    return (
        <div className="flex h-screen">
            {/* Left Sidebar */}
            <LeftNav isCollapsed={isCollapsed} />

            {/* Main Content Area */}
            <div className=" mx-2 flex-1 bg-gray-100">
                {/* Top Navbar */}
                <TopNavBar isCollapsed={isCollapsed} toggleSidebar={handleToggleSidebar} />

                {/* Main Content */}
                <div className="p-2 grid grid-cols-2 gap-10 max-h-[550px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <Cards thisMonthsSales={thisMonthsSales} salesDiff={salesDifference} increased={increased} percentageDifference={percentageDifference} />
                        <SalesCard thisMonthsOrders={thisMonthsOrders} ordersDiff={ordersDifference} orderIncreased={Ordersincreased} OrderPercentageDifference={OrderspercentageDifference} />
                        <TotalCustomerCard thisMonthsOrders={thisMonthsOrders} ordersDiff={ordersDifference} orderIncreased={Ordersincreased} OrderPercentageDifference={OrderspercentageDifference} />
                        <Cards thisMonthsSales={thisMonthsSales} salesDiff={salesDifference} increased={increased} percentageDifference={percentageDifference} />
                    </div>
                    <div className='bg-white shadow-md shadow-slate-200 rounded-lg  flex justify-center'>
                        <LineChart
                            width={500}
                            height={300}
                            series={[
                                { data: uData, label: 'Sales' },
                            ]}
                            xAxis={[{ scaleType: 'point', data: xLabels }]}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Analytics