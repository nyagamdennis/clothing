// @ts-nocheck

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleSidebar } from '../features/sidebar/sidebarSlice';
import LeftNav from '../components/LeftNav';
import TopNavBar from '../components/TopNavBar';
import { ArchiveBoxXMarkIcon, CheckIcon, ClipboardDocumentCheckIcon, ClockIcon, FunnelIcon, MagnifyingGlassIcon, MapPinIcon, PencilIcon, PlusCircleIcon, SquaresPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { addEmployee, deleteThisEmployee, fetchEmployees, selectAllEmployee, updateThisEmployee } from '../features/employees/employeesSlice';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CurrencyFormatter from '../components/CurrencyFormatter';
import FormattedAmount from '../components/FormattedAmount';



const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const Employees = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const all_employees = useAppSelector(selectAllEmployee);

    const [isFilters, setIsFilters] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);
    const [deleteEmployee, setDeleteEmployee] = useState(null);

    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState(null);
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dateEmployed, setDateEmployed] = useState('');
    const [updateEmployee, setUpdateEmployee] = useState(null);
    const [openUpdate, setOpenUpdate] = useState(false);

    const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);


    const [updateFirstName, setUpdateFirstName] = useState('');
    const [updateIdNumber, setUpdateIdNumber] = useState(null);
    const [updateLastName, setUpdateLastName] = useState('');
    const [updateEmail, setUpdateEmail] = useState('');
    const [updatePhone, setUpdatePhone] = useState('');
    const [updateGender, setUpdateGender] = useState('');
    const [updateDateEmployed, setUpdateDateEmployed] = useState('');


    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true)
    }

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
    };


    const handleOpenFilters = () => {
        setIsFilters(!isFilters);
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order); // Set the clicked order as selected
        setIsPanelOpen(true); // Open the right-side panel
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false); // Close the right-side panel
        setTimeout(() => setSelectedOrder(null), 300); // Delay resetting the order data to match the closing animation
    };

    useEffect(() => {
        dispatch(fetchEmployees())
    }, [dispatch])




    
    function calculateCurrentMonthEstimatedPay(tasks) {
        if (!Array.isArray(tasks)) {
            return "0.00"; // Return zero if tasks is not an array
        }
        return tasks
            .reduce((total, task) => {
                return total + (parseFloat(task.estimated_pay) * task.task_completed);
            }, 0)
            .toFixed(2);
    }

    

   



    // Calculate total advances for the current month
    const calculateCurrentMonthAdvances = (advances) => {
        if (!advances || advances.length === 0) {
            return "0.00"; // Return zero if tasks is undefined or empty
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const currentMonthAdvances = advances.filter((advance) => {
            const advanceDate = new Date(advance.date_issued);
            return advanceDate.getMonth() === currentMonth && advanceDate.getFullYear() === currentYear;
        });

        const totalAdvances = currentMonthAdvances.reduce((sum, advance) => sum + parseFloat(advance.amount), 0);
        return totalAdvances;
    };

    const getEmployeeStatus = (tasks) => {
        if (!tasks || tasks.length === 0) {
            return "Idle"; // No tasks at all
        }
        const hasIncompleteTasks = tasks.some(task => !task.completed);
        return hasIncompleteTasks ? "Tasking" : "Idle";
    };

    const now = new Date();
    const currentMonth = now.getMonth()
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octomber", "November", "December"]


    const handelAddEmployee = () => {
        const formData = {
            id_number: idNumber,
            first_name: name,
            last_name: lastName,
            email: email,
            phone: phone,
            gender: gender,
            date_employed: dateEmployed
        }
        console.log('DD ', formData)
        dispatch(addEmployee(formData))
        setOpen(false)
    }

    const handleClickOpenUpdateEmployee = (employee) => {
        setUpdateEmployee(employee);
        setUpdateEmployee(employee);
        setUpdateIdNumber(employee.id_number || 0);
        setUpdateFirstName(employee.first_name || '');
        setUpdateLastName(employee.last_name || '');
        setUpdateEmail(employee.email || '');
        setUpdatePhone(employee.phone || '');
        setUpdateGender(employee.gender || '');
        setUpdateDateEmployed(employee.date_employed || '');
        setOpenUpdate(true);
    }

    const handleClickCloseUpdate = () => {
        setOpenUpdate(false);
    }


    const handleIdUpdateInputChange = (e) => setUpdateIdNumber(e.target.value);
    const handleFirtUpdateInputChange = (e) => setUpdateFirstName(e.target.value);
    const handleLastUpdateInputChange = (e) => setUpdateLastName(e.target.value);
    const handleEmailUpdateInputChange = (e) => setUpdateEmail(e.target.value);
    const handlePhoneUpdateInputChange = (e) => setUpdatePhone(e.target.value);
    const handleGenderUpdateInputChange = (e) => setUpdateGender(e.target.value);
    const handleDatesUpdateInputChange = (e) => setUpdateDateEmployed(e.target.value);

    const handleUpdateEmployee = () => {
        const formData = {
            id_number: updateIdNumber,
            first_name: updateFirstName,
            last_name: updateLastName,
            email: updateEmail,
            phone: updatePhone,
            gender: updateGender,
            date_employed: updateDateEmployed
        }

        dispatch(updateThisEmployee({ id: updateEmployee.id, updatedData: formData }))
        setOpenUpdate(false);
    }


    const handleClickOpenDelete = (employeeId) =>{
        setOpenDelete(true);
        setDeleteEmployee(employeeId)
        
    }

    

    const handleCloseDelete = () =>{
        setOpenDelete(false);
    }

    
    
    const handleDelete = () =>{
        // setOpenDelete(false);
        // console.log('sjd ', deleteEmployee)
        dispatch(deleteThisEmployee({employeeId:deleteEmployee}))
        setOpenDelete(false)
    }


    
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
                            placeholder="Search employee..."
                            className="border bg-white rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-purple-800"
                        />

                        <div onClick={handleOpen} className=' border rounded-lg px-2 bg-white cursor-pointer py-2 ms-5 flex items-center gap-2 text-orange-600'>
                            <PlusCircleIcon className='h-5 w-5' />
                            <p className=' whitespace-nowrap font-semibold'>add Employee</p>
                        </div>

                    </div>

                    {/* Table Section */}
                    <div className='bg-white mt-6 shadow-lg rounded-lg overflow-x-auto'>
                        <table className='min-w-full text-left text-gray-900 border-collapse divide-y divide-gray-200'>
                            <thead className="text-sm font-semibold text-gray-600">
                                <tr>
                                    <th className="px-4 py-4">ID No:</th>
                                    <th className="px-4 py-4">Name</th>
                                    <th className="px-4 py-4">Phone</th>
                                    <th className="px-4 py-4">No: Tasks</th>
                                    <th className="px-4 py-4">{months[currentMonth]} Task Earnings</th>
                                    <th className="px-4 py-4">Advances</th>
                                    <th className="px-4 py-4">Total Payment Due</th>
                                    <th className="px-4 py-4">Actions</th>

                                    <th className="px-4 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-200">
                                {all_employees.map((employee) => {
                                    const taskEarnings = calculateCurrentMonthEstimatedPay(employee.tasks);
                                    const totalAdvances = calculateCurrentMonthAdvances(employee.advances);
                                    const totalPaymentDue = (taskEarnings - totalAdvances).toFixed(2);
                                    const employeeStatus = getEmployeeStatus(employee.tasks);
                                    return (

                                        <tr key={employee.id} className="hover:bg-gray-50 cursor-pointer" >
                                            {/* <tr key={employee.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOrderClick(employee)}> */}
                                            <td className="px-4 py-4 whitespace-nowrap">{employee.id_number}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">{employee.first_name} {employee.last_name}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">+254 {employee.phone} </td>
                                            <td className="px-4 py-4 text-center">{employee?.tasks?.length}</td>
                                            <td className="px-4 py-4 text-center"><FormattedAmount amount={taskEarnings} /></td>
                                            <td className="px-4 py-4"><FormattedAmount amount={totalAdvances} /> </td>
                                            <td className="px-4 py-4"><FormattedAmount amount={totalPaymentDue} /></td>
                                            <td className="px-4 py-4 text-center">
                                                <div className=' flex space-x-1'>
                                                    <button
                                                        onClick={() => handleClickOpenUpdateEmployee(employee)}
                                                        className="bg-blue-800 px-2 py-0.5 mt-5 rounded-md text-white font-semibold"
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleClickOpenDelete(employee.id)}
                                                        className="bg-red-400 px-2 py-0.5 mt-5 rounded-md text-white font-semibold"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/employee/${employee.id}`)}
                                                        className="bg-blue-400 px-2 py-0.5 mt-5 rounded-md text-white font-semibold"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">{employeeStatus}</td>
                                        </tr>)
                                })}
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
                            <div>
                                {/* <h2 className="text-xl font-bold my-4">{selectedOrder.product} Details</h2> */}
                                <h2 className="text-xl font-bold my-4">Order Details</h2>
                                <hr />
                                <p className=' flex justify-between mt-2 mb-1'><span className='font-semibold text-xs'>Quantity:</span> <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.quantity}</span></p>
                                <p className=' flex justify-between mt-2 mb-1'><span className='font-semibold text-xs'>Status:</span> <span className=' text-xs text-white rounded-lg font-bold bg-purple-800 px-2 py-1 flex items-center gap-1 cursor-pointer'><CheckIcon className='h-4 w-4' /> {selectedOrder.status}</span></p>
                                <p className=' flex justify-between mt-2 mb-1'><span className='font-semibold text-xs'>Size:</span> <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.size}</span></p>
                                <p className=' flex justify-between mt-2 mb-1'><span className='font-semibold text-xs'>Delivery Date:</span> <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.deliveryDate}</span></p>
                                <p className=' flex justify-between mt-2 mb-1'><span className='font-semibold text-xs'>Delivery Phone:</span> <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.deliveryPhone}</span></p>
                            </div>
                            <div>
                                {/* <h2 className="text-xl font-bold my-4">{selectedOrder.product} Details</h2> */}
                                <h2 className="text-xl font-bold my-4">Product Details</h2>
                                <hr />
                                <p className=' flex justify-between mt-2 mb-1'><span className='font-semibold text-xs'>Quantity:</span> <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.quantity}</span></p>
                                <p className=' flex justify-between mt-2 mb-1'><span className='font-semibold text-xs'>Status:</span> <span className=' text-xs text-white rounded-lg font-bold bg-purple-800 px-2 py-1 flex items-center gap-1 cursor-pointer'><CheckIcon className='h-4 w-4' /> {selectedOrder.status}</span></p>
                                <p className=' flex justify-between mt-2 mb-1'><span className='font-semibold text-xs'>Size:</span> <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.size}</span></p>
                                <p className=' flex justify-between mt-2 mb-1'><span className='font-semibold text-xs'>Delivery Date:</span> <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.deliveryDate}</span></p>
                                <p className=' flex justify-between mt-2 mb-1'><span className='font-semibold text-xs'>Delivery Phone:</span> <span className=' text-xs text-gray-800 font-normal'>{selectedOrder.deliveryPhone}</span></p>
                            </div>


                        </>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-wrap justify-around gap-2">
                        <button className="border  flex items-center justify-center w-[48%] px-4 py-2 space-x-2 text-orange-600 rounded-lg">
                            <p className="text-sm lowercase">Unaprove</p>
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                        <button className="border flex-grow flex items-center justify-center w-[48%] px-4 py-2 space-x-2 text-orange-600 rounded-lg">
                            <p className="text-sm lowercase whitespace-nowrap">Edit order</p>
                            <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="border flex-grow flex items-center justify-center w-[48%] px-4 py-2 space-x-2 text-orange-600 rounded-lg">
                            <p className="text-sm lowercase">Track order</p>
                            <MapPinIcon className="h-4 w-4" />
                        </button>
                        <button className="border flex-grow flex items-center justify-center w-[48%] px-4 py-2 space-x-2 text-orange-600 rounded-lg">
                            <p className="text-sm lowercase">Cancel Order</p>
                            <ArchiveBoxXMarkIcon className="h-4 w-4" />
                        </button>
                    </div>



                </div>
            </div>


            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Add a new employee "}</DialogTitle>
                <DialogContent>
                    <div className=' flex flex-col justify-center'>
                        <form>
                            <div className=' mb-2'>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>ID Number</label>
                                <input
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='number'
                                    onChange={(e) => setIdNumber(e.target.value)}
                                />
                            </div>
                            <div className=' mb-2'>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>First name</label>
                                <input
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='text'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className=' mb-2'>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Last name</label>
                                <input
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='text'
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className=' mb-2'>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Email</label>
                                <input
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='text'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className=' mb-2'>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Phone</label>
                                <input
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='text'
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className=' mb-2'>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Gender</label>
                                <select onChange={(e) => setGender(e.target.value)} className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'>
                                    <option>--Gender--</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                             
                            </div>

                            <div>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Date employed</label>
                                <input
                                    onChange={(e) => setDateEmployed(e.target.value)}
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='date'
                                />
                            </div>




                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handelAddEmployee}>Add</Button>
                </DialogActions>
            </Dialog>


            <Dialog
                open={openUpdate}
                onClose={handleClickCloseUpdate}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Update  ${updateEmployee?.first_name}`}
                </DialogTitle>
                <DialogContent>
                    <div>
                        <label>ID Number</label>
                        <input className=' outline-none w-full border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md' type='number' onChange={handleIdUpdateInputChange} value={updateIdNumber} />
                    </div>
                    <div>
                        <label>First Name</label>
                        <input className=' outline-none w-full border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md' type='text' onChange={handleFirtUpdateInputChange} value={updateFirstName} />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input className=' outline-none w-full border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md' type='text' onChange={handleLastUpdateInputChange} value={updateLastName} />
                    </div>
                    <div>
                        <label>Email</label>
                        <input className=' outline-none w-full border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md' type='text' onChange={handleEmailUpdateInputChange} value={updateEmail} />
                    </div>
                    <div>
                        <label>Phone</label>
                        <input className=' outline-none w-full border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md' type='text' onChange={handlePhoneUpdateInputChange} value={updatePhone} />
                    </div>
                    <div>
                        <label>Gender</label>
                        <input className=' outline-none w-full border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md' type='text' onChange={handleGenderUpdateInputChange} value={updateGender} />

                    </div>
                    <div>
                        <label>Date employed</label>
                        <input className=' outline-none w-full border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md' type='date' onChange={handleDatesUpdateInputChange} value={updateDateEmployed} />

                    </div>
                </DialogContent>
                <DialogActions className=' flex gap-2'>
                    <button className=' rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5' onClick={handleClickCloseUpdate}>Cancel</button>
                    <button onClick={handleUpdateEmployee} className=' rounded-md bg-blue-50 hover:bg-blue-300 px-2 py-0.5'>
                        Update
                    </button>
                 

                </DialogActions>
            </Dialog>



            <Dialog
              open={openDelete}
              onClose={handleCloseDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {`Delete`}
              </DialogTitle>
              <DialogContent className=' '>
                <p>Delete permanently</p>
              </DialogContent>
              <DialogActions className=' flex gap-2'>
                <button className=' rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5' onClick={handleCloseDelete}>Cancel</button>
                <button onClick={handleDelete} className=' rounded-md bg-blue-50 hover:bg-blue-300 px-2 py-0.5'>
                  Delete
                </button>
              </DialogActions>
            </Dialog>

        </div>
    )
}

export default Employees