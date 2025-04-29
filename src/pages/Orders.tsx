// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleSidebar } from '../features/sidebar/sidebarSlice';
import LeftNav from '../components/LeftNav';
import TopNavBar from '../components/TopNavBar';
import Cards from '../components/Cards';
import { ArchiveBoxXMarkIcon, CheckIcon, ClipboardDocumentCheckIcon, ClockIcon, DocumentTextIcon, FunnelIcon, MagnifyingGlassIcon, MapPinIcon, PencilIcon, PlusCircleIcon, SquaresPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { addDeposit, CancelOrder, deliveredSet, fetchCart, selectAllCart } from '../features/orders/cartSlice';
import CurrencyFormatter from '../components/CurrencyFormatter';
import DatesOps from '../components/DatesOps';
import DatesOnly from '../components/DatesOnly';



const Orders = () => {
    const dispatch = useAppDispatch();
    const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);

    const all_orders = useAppSelector(selectAllCart);

    const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order
    const [isPanelOpen, setIsPanelOpen] = useState(false); // Track if panel is open
    const [isFilters, setIsFilters] = useState(false); // Tracks if filter ic open

    const [selectedOrderEdit, setSelectedOrderEdit] = useState(null);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

    const [newDeposit, setNewDeposit] = useState(null);




    const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0; // Convert to number and handle NaN
        setNewDeposit(value);
    };


    const handleSubmitNewDeposit = (e: any) => {
        e.preventDefault()
        const cartId = selectedOrder.id
        const newData = {
            deposit: newDeposit
        }
        dispatch(addDeposit({ cartId, newData }))

    }

    

    const handleSubmitDelivered = (e: any) => {
        e.preventDefault()
        const cartId = selectedOrder.id  
        
        dispatch(deliveredSet({ cartId }))
    }

    const handleCancelOrder = (e: any) => {
        e.preventDefault()
        const cartId = selectedOrder.id;

        dispatch(CancelOrder({cartId}))
        setIsPanelOpen(false)
    }


    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
    };



    const handleOrderClick = (order) => {
        setSelectedOrder(order); // Set the clicked order as selected
        setIsPanelOpen(true); // Open the right-side panel
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false); // Close the right-side panel
        setTimeout(() => setSelectedOrder(null), 300); // Delay resetting the order data to match the closing animation
    };

    const handleOrderEditClick = ({ order }: { order: any }) => {
        setSelectedOrderEdit(order);
        setIsEditPanelOpen(true);
    }

    const handleCloseEditPanel = () => {
        setIsEditPanelOpen(false);
        setIsPanelOpen(false);
        setTimeout(() => setSelectedOrder(null), 300);
    }



    const handleOpenFilters = () => {
        setIsFilters(!isFilters);
    };


    const handleInputChange = (event, field) => {
        const value = event.target.value;

        // Split the field path if it's nested, e.g., 'customer.name'
        const fieldPath = field.split('.');

        // Use a copy of the current selectedOrderEdit state
        let updatedOrder = { ...selectedOrderEdit };

        // Traverse the path to update the correct nested field
        fieldPath.reduce((acc, key, index) => {
            if (index === fieldPath.length - 1) {
                // When we reach the last key, update its value
                acc[key] = value;
            } else {
                // If not the last key, continue traversing
                return acc[key];
            }
        }, updatedOrder);

        // Update the state with the modified order data
        setSelectedOrderEdit(updatedOrder);

    };


    useEffect(() => {
        dispatch(fetchCart())
    }, [dispatch])


    useEffect(() => {
        if (selectedOrder) {
            // Find the updated selected order in the cart based on ID
            const updatedOrder = all_orders.find(order => order.id === selectedOrder.id);
            if (updatedOrder) {
                setSelectedOrder(updatedOrder); // Update selected order with the latest data from the store
            }
        }
    }, [all_orders, selectedOrder])

    return (
        <div className="flex h-screen">
            {/* Left Sidebar */}
            <LeftNav isCollapsed={isCollapsed} />

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-100">
                {/* Top Navbar */}
                <TopNavBar isCollapsed={isCollapsed} toggleSidebar={handleToggleSidebar} />

                {/* Main Content */}
                <div className='mx-8 max-h-[550px] overflow-y-auto'>
                    {/* Cards Section */}
                    <div className=" flex items-center w-1/2 relative mx-4 mt-4">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />

                        <input
                            type="text"
                            placeholder="Search..."
                            className="border bg-white rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-purple-800"
                        />
                        <div className=' relative'>
                            <div onClick={handleOpenFilters} className=' border rounded-lg px-2 bg-white cursor-pointer py-2 ms-5 flex items-center gap-2 text-orange-600'>
                                <FunnelIcon className='h-5 w-5' />
                                <p className=' font-semibold'>filters</p>
                            </div>

                            {isFilters && (
                                <div
                                    className="bg-gray-100 p-2 ms-5 mt-24 rounded-md absolute z-50"
                                    style={{ transform: "translateY(-100%)" }}
                                >
                                    <p className="border-b text-sm flex mb-2 justify-between px-2 items-center text-orange-500 cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors duration-300">
                                        All
                                        <SquaresPlusIcon className="h-4 w-4" />
                                    </p>
                                    <p className="border-b text-sm flex mb-2 justify-between px-2 items-center text-orange-500 cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors duration-300">
                                        Pending
                                        <ClockIcon className="h-4 w-4" />
                                    </p>
                                    <p className="text-sm flex mb-2 justify-between px-2 items-center text-orange-500 cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors duration-300">
                                        Complete
                                        <ClipboardDocumentCheckIcon className="h-4 w-4 ms-4" />
                                    </p>
                                </div>
                            )}

                        </div>
                        <div className=' border rounded-lg px-2 bg-white cursor-pointer py-2 ms-5 flex items-center gap-2 text-orange-600'>
                            <PlusCircleIcon className='h-5 w-5' />
                            <p className=' whitespace-nowrap font-semibold'>add order</p>
                        </div>

                    </div>

                    {/* Table Section */}
                    <div className='bg-white mt-6 shadow-lg rounded-lg overflow-x-auto'>
                        <table className='min-w-full text-left text-gray-900 border-collapse divide-y divide-gray-200'>
                            <thead className="text-sm font-semibold text-gray-600">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Material</th>
                                    <th className="px-6 py-4">Size</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Delivery Date</th>
                                    <th className="px-6 py-4">Delivery Name</th>
                                    <th className="px-6 py-4">Delivery Phone</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-200">
                                {all_orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOrderClick(order)}>
                                        <td className="px-6 py-4">{order.product.product.name}</td>
                                        <td className="px-6 py-4">{order.product.material.name}</td>
                                        {/* <td className="px-6 py-4">{order.product.size.size}</td> */}
                                        <td className="px-6 py-4">
                                        {order.product.size.size && order.product.size.alphabetic_size
                            ? `${order.product.size.size} / ${order.product.size.alphabetic_size}`
                            : order.product.size.size || order.product.size.alphabetic_size || "N/A"}
                                        </td>
                                        <td className="px-6 py-4">{order.delivered ? <div className=' bg-green-500 px-1 rounded-lg text-white font-bold py-0.5 text-center'>Delivered</div> : <div className='bg-red-500 px-1 rounded-lg text-white font-bold py-0.5 text-center'>Pending</div>}</td>
                                        <td className="px-6 py-4"><DatesOnly dateStr={order.due_date} /></td>
                                        <td className="px-6 py-4">{order.to_be_delivered_to}</td>
                                        <td className="px-6 py-4">+254 {order.no_to_be_delivered}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right-Side Panel (Sliding) */}
            <div
                className={`fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg z-50 overflow-auto transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-6">
                    <div className=''>
                        <button onClick={handleClosePanel} className="absolute border rounded-lg right-10 text-gray-500 hover:text-gray-900 focus:outline-none">
                            <XMarkIcon className=' h-5 w-5 text-orange-600' />
                        </button>
                    </div>

                    {selectedOrder && (
                        <>
                            <div className=''>
                                {/* <h2 className="text-xl font-bold my-4">{selectedOrder.product} Details</h2> */}
                                <h2 className="text-xl font-bold my-4">Order Details</h2>
                                <hr />
                                <p className=' flex justify-between mt-2 mb-1 items-center'>
                                    <span className='font-semibold text-xs'>Customer Name:</span>
                                    <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.customer.name}</span>
                                </p>
                                <p className=' flex justify-between mt-2 mb-1 items-center'>
                                    <span className='font-semibold text-xs'>Customer Phone:</span>
                                    <span className=' text-xs text-gray-800 font-normal'>+254 {selectedOrder.customer.phone}</span>
                                </p>
                                <p className=' flex justify-between mt-2 mb-1 items-center'>
                                    <span className='font-semibold text-xs'>Delivered:</span>
                                    <span className=' text-xs text-white rounded-lg font-bold  px-2 py-1 flex items-center gap-1 cursor-pointer'>
                                        {selectedOrder.delivered ? <div className=' bg-green-800 text-white font-bold flex items-center gap-2 px-4 py-1 rounded-lg'>
                                            <CheckIcon className='h-4 w-4' /> Delivered</div> : <div className=' flex text-white font-bold items-center gap-2 bg-red-500 px-4 py-1 rounded-lg'>
                                            <ClockIcon className='h-4 w-4' /> Pending</div>}</span>
                                </p>
                                <p className=' flex justify-between mt-2 mb-1 items-center'><span className='font-semibold text-xs'>Delivery Date:</span> <span className=' text-xs text-gray-800 font-normal'><DatesOnly dateStr={selectedOrder.due_date} /></span></p>
                                <p className=' flex justify-between mt-2 mb-1 items-center'><span className='font-semibold text-xs'>Delivery to:</span> <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.to_be_delivered_to}</span></p>
                                <p className=' flex justify-between mt-2 mb-1 items-center'><span className='font-semibold text-xs'>Phone number:</span> <span className=' text-xs text-gray-800 font-normal'>+254 {selectedOrder.no_to_be_delivered}</span></p>
                                <p className=' flex justify-between mt-2 mb-1 items-center'><span className='font-semibold text-xs'>Ordered on:</span> <span className=' text-xs text-gray-800 font-normal'><DatesOps dateStr={selectedOrder.date} /></span></p>

                                {selectedOrder.fully_payed ? <div>
                                    <p className=' flex justify-between mt-2 mb-1 items-center text-green-600'>
                                        <span className='font-semibold text-xs'>Balance:</span>
                                        <span className=' text-xs  font-normal text-green-600'>
                                            cleared
                                        </span>
                                    </p>
                                </div> :
                                    <div>
                                        <form className='' onSubmit={handleSubmitNewDeposit}>
                                            <label className=' text-sm font-semibold'>Add Deposit</label>
                                            <div className=' flex gap-3 items-center'>
                                                <input type='number'
                                                    className='outline-none bg-gray-200 px-1 py-0.5 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 '
                                                    min={0}
                                                    value={newDeposit}
                                                    onChange={handleDepositChange}
                                                />
                                                <button className=' bg-slate-400 px-1 py-0.5 rounded-md text-sm text-white font-bold '>add</button>
                                            </div>
                                        </form>
                                        <p className=' flex justify-between mt-2 mb-1 text-red-600 items-center'>
                                            <span className='font-semibold text-xs'>Balance:</span>
                                            <span className=' text-xs  font-normal text-red-600'>
                                                {console.log('heee ', selectedOrder.deposited)}
                                                <CurrencyFormatter amount={(selectedOrder.quantity * selectedOrder.product.price) - selectedOrder.deposited} currencySymbol='Ksh' asString='true' />
                                            </span>
                                        </p>
                                    </div>

                                }








                            </div>
                            <div>
                                {/* <h2 className="text-xl font-bold my-4">{selectedOrder.product} Details</h2> */}
                                <h2 className="text-xl font-bold my-4">Product Details</h2>
                                <hr />
                                <p className=' flex justify-between mt-2 mb-1'>
                                    <span className='font-semibold text-xs'>Product:</span>
                                    <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.product.product.name}</span>
                                </p>
                                <p className=' flex justify-between mt-2 mb-1'>
                                    <span className='font-semibold text-xs'>Material</span>
                                    <span className=' text-xs text-gray-800 font-normal'>
                                        {selectedOrder.product.material.name}</span>
                                </p>
                                <p className=' flex justify-between mt-2 mb-1'>
                                    <span className='font-semibold text-xs'>Size:</span>
                                    {/* <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.product.size.size}</span> */}
                                    <span className=' text-xs text-gray-800 font-normal'>
                                    {selectedOrder.product.size.size && selectedOrder.product.size.alphabetic_size
                            ? `${selectedOrder.product.size.size} / ${selectedOrder.product.size.alphabetic_size}`
                            : selectedOrder.product.size.size || selectedOrder.product.size.alphabetic_size || "N/A"}
                                    </span>
                                </p>
                                <p className=' flex justify-between mt-2 mb-1'>
                                    <span className='font-semibold text-xs'>Color:</span>
                                    <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.product.color.name}</span>
                                </p>
                                <p className=' flex justify-between mt-2 mb-1'>
                                    <span className='font-semibold text-xs'>Quantity:</span>
                                    <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.quantity}</span>
                                </p>

                            </div>


                        </>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-wrap justify-around gap-2">

                        <button onClick={() => handleOrderEditClick(selectedOrder)} className="border flex-grow flex items-center justify-center w-[48%] px-4 py-2 space-x-2 text-orange-600 rounded-lg">
                            <p className="text-sm lowercase whitespace-nowrap">Edit order</p>
                            <PencilIcon className="h-4 w-4" />
                        </button>
                        <button onClick={handleSubmitDelivered} className="border flex-grow flex items-center justify-center w-[48%] px-4 py-2 space-x-2 text-orange-600 rounded-lg">
                            <p className="text-sm lowercase whitespace-nowrap">Complete Order</p>
                            <ArchiveBoxXMarkIcon className="h-4 w-4" />
                        </button>
                        <button onClick={handleCancelOrder} className="border flex-grow flex items-center justify-center w-[48%] px-4 py-2 space-x-2 text-orange-600 rounded-lg">
                            <p className="text-sm lowercase">Cancel Order</p>
                            <ArchiveBoxXMarkIcon className="h-4 w-4" />
                        </button>
                    </div>



                </div>
            </div>
            {/* Right-Side Panel (Editing) */}
            <div className={`fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg z-50 overflow-auto transition-transform duration-300 ease-in-out ${isEditPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <div className=''>
                        <button onClick={handleCloseEditPanel} className="absolute border rounded-lg right-10 text-gray-500 hover:text-gray-900 focus:outline-none">
                            <XMarkIcon className=' h-5 w-5 text-orange-600' />
                        </button>
                    </div>

                    {selectedOrderEdit && (
                        <>
                            <div>
                                <h2 className="text-xl font-bold my-4">Edit Order</h2>
                                <hr />

                                {/* Customer Name */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <label className='font-semibold text-xs'>Customer Name:</label>
                                    <input
                                        type="text"
                                        value={selectedOrderEdit.customer.name}
                                        onChange={(e) => handleInputChange(e, 'customer.name')}
                                        className='text-xs text-gray-800 font-normal bg-gray-100 px-1 py-0.5 rounded-md outline-none'
                                    />
                                </p>

                                {/* Customer Phone */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <label className='font-semibold text-xs'>Customer Phone:</label>
                                    <input
                                        type="text"
                                        value={selectedOrderEdit.customer.phone}
                                        onChange={(e) => handleInputChange(e, 'customer.phone')}
                                        className='text-xs text-gray-800 font-normal bg-gray-100 px-1 py-0.5 rounded-md outline-none'
                                    />
                                </p>

                                {/* Status (non-editable) */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <span className='font-semibold text-xs'>Status:</span>
                                    <span className='text-xs text-white rounded-lg font-bold px-2 py-1 flex items-center gap-1 cursor-pointer'>
                                        {selectedOrderEdit.delivered ?
                                            <div className='bg-green-800 text-white font-bold flex items-center gap-2 px-4 py-1 rounded-lg'>
                                                <CheckIcon className='h-4 w-4' /> Delivered
                                            </div> :
                                            <div className='flex text-white font-bold items-center gap-2 bg-red-500 px-4 py-1 rounded-lg'>
                                                <ClockIcon className='h-4 w-4' /> Pending
                                            </div>
                                        }
                                    </span>
                                </p>

                                {/* Delivery Date */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <label className='font-semibold text-xs'>Delivery Date:</label>
                                    <input
                                        type="date"
                                        value={selectedOrderEdit.due_date}
                                        onChange={(e) => handleInputChange(e, 'due_date')}
                                        className='text-xs text-gray-800 font-normal bg-gray-100 px-1 py-0.5 rounded-md outline-none'
                                    />
                                </p>

                                {/* Delivery Address */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <label className='font-semibold text-xs'>Delivery to:</label>
                                    <input
                                        type="text"
                                        value={selectedOrderEdit.to_be_delivered_to}
                                        onChange={(e) => handleInputChange(e, 'to_be_delivered_to')}
                                        className='text-xs text-gray-800 font-normal bg-gray-100 px-1 py-0.5 rounded-md outline-none'
                                    />
                                </p>

                                {/* Phone number for delivery */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <label className='font-semibold text-xs'>Phone number:</label>
                                    <input
                                        type="text"
                                        value={selectedOrderEdit.no_to_be_delivered}
                                        onChange={(e) => handleInputChange(e, 'no_to_be_delivered')}
                                        className='text-xs text-gray-800 font-normal bg-gray-100 px-1 py-0.5 rounded-md outline-none'
                                    />
                                </p>

                                {/* Ordered on */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <label className='font-semibold text-xs'>Ordered on:</label>
                                    <input
                                        type="datetime"
                                        value={selectedOrderEdit.date}
                                        onChange={(e) => handleInputChange(e, 'date')}
                                        className='text-xs text-gray-800 font-normal bg-gray-100 px-1 py-0.5 rounded-md outline-none'
                                    />
                                </p>

                                {/* Balance */}
                                <p className='flex justify-between mt-2 mb-1 text-green-600'>
                                    <span className='font-semibold text-xs'>Balance:</span>
                                    <span className='text-xs font-normal text-green-600'>
                                        cleared
                                    </span>
                                </p>

                            </div>

                            <div>
                                <h2 className="text-xl font-bold my-4">Product Edit</h2>
                                <hr />

                                {/* Product */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <label className='font-semibold text-xs'>Product:</label>
                                    <input
                                        type="text"
                                        value={selectedOrderEdit.product.product.name}
                                        onChange={(e) => handleInputChange(e, 'product.product.name')}
                                        className='text-xs text-gray-800 font-normal bg-gray-100 px-1 py-0.5 rounded-md outline-none'
                                    />
                                </p>

                                {/* Material */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <label className='font-semibold text-xs'>Material:</label>
                                    <input
                                        type="text"
                                        value={selectedOrderEdit.product.material.name}
                                        onChange={(e) => handleInputChange(e, 'product.material.name')}
                                        className='text-xs text-gray-800 font-normal bg-gray-100 px-1 py-0.5 rounded-md outline-none'
                                    />
                                </p>

                                {/* Size */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <label className='font-semibold text-xs'>Size:</label>
                                    <input
                                        type="text"
                                        value={selectedOrderEdit.product.size.size}
                                        onChange={(e) => handleInputChange(e, 'product.size.size')}
                                        className='text-xs text-gray-800 font-normal bg-gray-100 px-1 py-0.5 rounded-md outline-none'
                                    />
                                </p>

                                {/* Color */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <label className='font-semibold text-xs'>Color:</label>
                                    <input
                                        type="text"
                                        value={selectedOrderEdit.product.color.name}
                                        onChange={(e) => handleInputChange(e, 'product.color.name')}
                                        className='text-xs text-gray-800 font-normal bg-gray-100 px-1 py-0.5 rounded-md outline-none'
                                    />
                                </p>
                                {/* Quantity */}
                                <p className='flex justify-between mt-2 mb-1'>
                                    <label className='font-semibold text-xs'>Quantity:</label>
                                    <input
                                        type="text"
                                        value={selectedOrderEdit.quantity}
                                        onChange={(e) => handleInputChange(e, 'selectedOrderEdit.quantity')}
                                        className='text-xs text-gray-800 font-normal bg-gray-100 px-1 py-0.5 rounded-md outline-none'
                                    />
                                </p>
                            </div>
                        </>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-wrap justify-around gap-2">
                        <button className="border flex-grow flex items-center justify-center w-[48%] px-4 py-2 space-x-2 text-orange-600 rounded-lg">
                            <p className="text-sm lowercase whitespace-nowrap">Edit order</p>
                            <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="border flex-grow flex items-center justify-center w-[48%] px-4 py-2 space-x-2 text-orange-600 rounded-lg">
                            <p className="text-sm lowercase whitespace-nowrap">Complete Order</p>
                            <ArchiveBoxXMarkIcon className="h-4 w-4" />
                        </button>
                        <button className="border flex-grow flex items-center justify-center w-[48%] px-4 py-2 space-x-2 text-orange-600 rounded-lg">
                            <p className="text-sm lowercase">Cancel Order</p>
                            <ArchiveBoxXMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Orders;
