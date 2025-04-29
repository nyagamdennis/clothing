// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { AddAnAdvance, changeTaskCompletionStatus, fetchSingleEmployee, selectSingleEmployee, updateTaskCompletion } from '../features/employees/singleEmployeeSlice';
import LeftNav from '../components/LeftNav';
import TopNavBar from '../components/TopNavBar';
import { toggleSidebar } from '../features/sidebar/sidebarSlice';
import DatesOps from '../components/DatesOps';
import DatesOnly from '../components/DatesOnly';
import whatsapp from '../assets/images/whatsapp-svgrepo-com.svg'
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { deleteAdvance, updateAdvances } from '../features/advances/advancesSlice';
import { deleteRole, UpdateRoles } from '../features/roles/rolesSlice';
import FormattedAmount from '../components/FormattedAmount';



const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const EmployeeDetails = () => {
    const { employeeId } = useParams();
    const dispatch = useAppDispatch();
    const single_employee = useAppSelector(selectSingleEmployee);
    const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [estimatedAmount, setEstimatedAmount] = useState(null);
    const [taskName, setTaskName] = useState(null);
    const [dates, setDates] = useState('');
    const [updateThisAdvance, setUpdateThisAdvance] = useState(null);
    const [updateThisTask, setUpdateThisTask] = useState(null);

    const [updateAmount, setUpdateAmount] = useState(0);
    const [updateDates, setUpdateDates] = useState('');
    const [advanceId, setAdvanceId] = useState(0);

    const [openDeleteAdvance, setOpenDeleteAdvance] = useState(false);

    const [openTaskUpdate, setOpenTaskUpdate] = useState(false);
    const [updateTaskId, setUpdateTaskId] = useState(0);


    const [openEditAdvance, setOpenEditAdvance] = useState(false);

    const [openDeleteTask, setOpenDeleteTask] = useState(false);
    const [taskId, setTaskId] = useState(0);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toISOString().slice(0, 16);  // Extracts `yyyy-MM-ddThh:mm`
        return formattedDate;
    };


    const handleOpenUpdateTask = (task) => {
        setOpenTaskUpdate(true);
        setUpdateTaskId(task.id)
        setTaskName(task.task_name)
        setEstimatedAmount(task.estimated_pay)
        setStartDate(task.start_date ? formatDate(task.start_date) : '')
        setDueDate(task.due_date_time ? formatDate(task.due_date_time) : '')
    }


    const handleCloseUpdateTask = () => {
        setOpenTaskUpdate(false);
    }


    const handleUpdateTask = () => {
        const id = updateTaskId;

        const updatedData = {
            ...updateThisTask,
            task_name: taskName,
            estimated_pay: estimatedAmount,
            start_date: startDate,
            due_date: dueDate,

        };
        dispatch(UpdateRoles({ id, updatedData }));
        setOpenTaskUpdate(false);
    }

    const handleOpenEditAdvance = (advance) => {
        setAdvanceId(advance.id);
        setUpdateAmount(advance.amount || 0);
        setUpdateDates(advance.date_issued ? formatDate(advance.date_issued) : '');

        setOpenEditAdvance(true);
    }


    const handleCloseEditAdvance = () => {
        setOpenEditAdvance(false);
    }

    const handleOpenDeleteDialogue = (advance) => {
        setAdvanceId(advance.id)
        setOpenDeleteAdvance(true)
    }

    const handleCloseDeleteDialogue = () => {
        setOpenDeleteAdvance(false);
    }

    const handleDeleteAdvance = (advance) => {
        dispatch(deleteAdvance({ advanceId }))
        setOpenDeleteAdvance(false)
    }
    // delete task
    const handleOpenDeleteTask = (task) => {
        setTaskId(task.id)
        setOpenDeleteTask(true)
    }

    const handleCloseDeleteTask = () => {
        setOpenDeleteTask(false);
    }

    const handleDeleteTask = () => {
        dispatch(deleteRole({ taskId }))
        setOpenDeleteTask(false)
    }


    const handleEditAdvance = () => {
        // Perform save operation here (e.g., API call to save updates)

        const updatedData = {
            ...updateThisAdvance,
            amount: updateAmount,
            date_issued: updateDates,

        };
        dispatch(updateAdvances({ id: advanceId, updatedData }))
        // Close the dialog after updating
        handleCloseEditAdvance();
    };


    const handelAddAdvance = () => {
        const formData = {
            employee: employeeId,
            amount: amount,
            date_issued: dates
        }

        dispatch(AddAnAdvance(formData))
        setOpen(false)
    }



    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenAddEmployee = () => {
        setOpen(true)
    }

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
    };


    useEffect(() => {
        if (employeeId) {
            dispatch(fetchSingleEmployee(Number(employeeId)));
        }
    }, [dispatch, employeeId]);

    // Calculate totals for tasks and advances based on the selected month and year
    const calculateMonthlyTotals = () => {
        const filteredTasks = single_employee?.tasks?.filter((task) => {
            const taskDate = new Date(task.start_date);
            return (
                taskDate.getMonth() === selectedMonth &&
                taskDate.getFullYear() === selectedYear
            );
        });

        const filteredAdvances = single_employee?.advances?.filter((advance) => {
            const advanceDate = new Date(advance.date_issued);
            return (
                advanceDate.getMonth() === selectedMonth &&
                advanceDate.getFullYear() === selectedYear
            );
        });

       
        const totalTaskPay = filteredTasks?.reduce((sum, task) => {
            return sum + (parseFloat(task.estimated_pay) * task.task_completed);
        }, 0);

        const totalAdvances = filteredAdvances?.reduce((sum, advance) => sum + parseFloat(advance.amount), 0);
        const netPay = totalTaskPay - totalAdvances;

        return { totalTaskPay, totalAdvances, netPay, filteredTasks, filteredAdvances };
    };

    const { totalTaskPay, totalAdvances, netPay, filteredTasks, filteredAdvances } = calculateMonthlyTotals();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleChangeCompleted = (taskId, currentStatus) => {
        const updatedStatus = !currentStatus;
        console.log('Status ', currentStatus)
        dispatch(changeTaskCompletionStatus({ taskId, completed: updatedStatus }));
    }


    const handleQuantityClick = (taskId, quantityCompleted) => {
        // Send the quantity completed to the backend
        console.log('clicked task ', taskId)
        dispatch(updateTaskCompletion({taskId, quantityCompleted}))
        // dispatch(updateTaskCompletion(taskId, quantityCompleted))
    };




    return (
        <div className='flex h-screen'>
            <LeftNav isCollapsed={isCollapsed} />
            <div className="flex-1 bg-gray-100">
                <TopNavBar isCollapsed={isCollapsed} toggleSidebar={handleToggleSidebar} />

                <div className="p-6 space-y-2 max-h-[550px] overflow-y-auto">
                    <div className=' bg-white p-3 rounded-sm flex justify-evenly'>
                        <h4 className=' font-bold text-sm'>Id Number: <span className=' font-semibold text-gray-800'>{single_employee?.id_number}</span></h4>

                        <div className=' flex flex-col space-y-3'>
                            <h4 className=' font-bold text-sm'>Name: <span className=' font-semibold text-gray-800'>{single_employee?.first_name} {single_employee?.last_name}</span></h4>
                            <h4 className=' font-bold text-sm'>Phone: <span className=' font-semibold text-gray-800'>+254 {single_employee?.phone}</span></h4>
                            <h4 className=' font-bold text-sm'>Gender: <span className=' font-semibold text-gray-800'>{single_employee?.gender}</span></h4>

                        </div>
                        <div className=' flex flex-col space-y-3'>
                            <h4 className=' font-bold text-sm'>Employed on: <span className=' font-semibold text-gray-800'><DatesOnly dateStr={single_employee?.date_employed} /> </span></h4>
                            <h4 className=' font-bold text-sm'>Email: <span className=' font-semibold text-gray-800'>{single_employee?.email} </span></h4>

                        </div>
                        <div className=' flex flex-col space-y-3'>
                            <div className=' flex gap-1'>
                                <img className=' w-5 h-5 object-contain' src={whatsapp} alt='whatsapp' />
                                <h4 className=' font-bold text-sm'> <span className=' font-semibold text-gray-800'>+254 {single_employee?.phone}</span></h4>

                            </div>

                        </div>
                    </div>
                    {/* <h1 className="text-2xl font-bold text-gray-800 mb-4">Employee Details</h1> */}

                    {/* Month and Year Picker */}

                    <div className="flex space-x-1 items-center">
                        <label className="font-semibold text-sm">Select Month:</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className="border rounded-md px-3 py-1 text-sm outline-none focus:border-pink-700"
                        >
                            {months.map((month, index) => (
                                <option key={index} value={index}>{month}</option>
                            ))}
                        </select>

                        <label className="font-semibold text-sm">Select Year:</label>
                        <input
                            type="number"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="border rounded-md px-3 py-1 w-24 text-sm outline-none focus:border-pink-700"
                            min="2000"
                            max="2100"
                        />
                    </div>
                    <div className=' grid grid-cols-2 gap-5'>
                        <div className=' flex flex-col space-y-2'>

                            {/* Display Monthly Totals */}
                            <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                                <h2 className=" text-base font-bold text-gray-700">Financial Summary for {months[selectedMonth]} {selectedYear}</h2>
                                <p><span className="font-semibold text-sm">Total Task Pay:</span><FormattedAmount amount={totalTaskPay} /></p>
                                <p><span className="font-semibold text-sm">Total Advances:</span><FormattedAmount amount={totalAdvances} /></p>
                                <p><span className="font-semibold text-sm">Net Pay (Task Pay - Advances):</span><FormattedAmount amount={netPay} /></p>
                            </div>

                            {/* Display Filtered Advances */}
                            <div className="bg-white shadow-lg rounded-lg p-6 ">
                                <div className=' flex items-center justify-between '>
                                    <h2 className="text-base font-bold text-gray-700 mb-4">Advances for {months[selectedMonth]} {selectedYear}</h2>
                                    <div onClick={handleOpenAddEmployee} className=' border rounded-lg px-2 bg-gray-400 cursor-pointer py-1 ms-5 flex items-center gap-2 text-orange-800'>
                                        <PlusCircleIcon className='h-5 w-5' />
                                        <p className=' whitespace-nowrap font-semibold'>add Advance</p>
                                    </div>
                                </div>
                                {filteredAdvances?.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredAdvances?.slice().sort((a, b) => new Date(b.date_given) - new Date(a.date_given)).map((advance) => (
                                            <div key={advance.id} className="p-4 border border-gray-400 rounded-lg bg-gray-50 flex justify-between items-center">
                                                <div>
                                                    <p><span className="font-semibold text-sm">Amount:</span> Ksh {advance.amount}</p>
                                                    <p><span className="font-semibold text-sm">Date Issued:</span> <DatesOps dateStr={advance.date_issued} /></p>
                                                </div>

                                                <div className=' flex flex-col space-y-1'>
                                                    <div onClick={() => handleOpenEditAdvance(advance)} className=' bg-blue-400 flex items-center cursor-pointer justify-center p-1 rounded-full'>
                                                        <PencilSquareIcon className=' h-5 w-5 text-white' />
                                                    </div>
                                                    <div onClick={() => handleOpenDeleteDialogue(advance)} className=' bg-blue-400 flex items-center cursor-pointer text-red-700 justify-center p-1 rounded-full'>
                                                        <TrashIcon className=' h-5 w-5' />
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No advances found for this month.</p>
                                )}
                            </div>

                        </div>
                        {/* Display Filtered Tasks */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-base font-bold text-gray-700 mb-4">Tasks for {months[selectedMonth]} {selectedYear}</h2>
                            {filteredTasks?.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredTasks?.slice().sort((a, b) => new Date(b.date_created) - new Date(a.date_created)).map((task) => (
                                        <div  key={task.id} className='p-4 border rounded-lg bg-gray-50'>
                                            <div className=' text-center flex items-center justify-center  underline'>
                                                <p className=' flex space-x-3'>
                                                    <span className='font-bold'>Project name:</span>
                                                    <span>{task?.project.name}</span>
                                                </p>
                                            </div>
                                        <div className=" flex justify-between">
                                            
                                            <div>
                                                <p><span className="font-semibold text-sm">Task Name:</span> {task?.task_name}</p>
                                                <p><span className="font-semibold text-sm">Estimated Pay:</span> Ksh {task?.estimated_pay}</p>
                                                <p><span className="font-semibold text-sm">Start Date:</span> <DatesOps dateStr={task?.start_date} /></p>
                                                <p><span className="font-semibold text-sm">Due Date:</span> <DatesOps dateStr={task?.due_date_time} /></p>
                                                <p><span className="font-semibold text-sm">Completed:</span> {task?.completed ? "Yes" : "No"}</p>

                                                {/* <form className=' flex items-center space-x-2'>
                                                    <label>Mark as complete</label>
                                                    <input type='checkbox' checked={task?.completed}
                                                        onChange={() => handleChangeCompleted(task.id, task.completed)}
                                                    />
                                                </form> */}
                                                <div className="flex space-x-2 flex-wrap space-y-2">
                                                    {[...Array(task.quantity)].map((_, index) => (
                                                        <button
                                                            key={index}
                                                            className={`px-2 py-1 rounded ${index < task.task_completed ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                                                            onClick={() => handleQuantityClick(task.id, index + 1)}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>


                                            <div className='flex flex-col space-y-1'>
                                                <div onClick={() => handleOpenUpdateTask(task)} className='text-white bg-blue-400 flex items-center cursor-pointer justify-center p-1 rounded-full'>
                                                    <PencilSquareIcon className=' h-5 w-5' />
                                                </div>
                                                <div onClick={() => handleOpenDeleteTask(task)} className=' bg-blue-400 flex items-center cursor-pointer text-red-700 justify-center p-1 rounded-full'>
                                                    <TrashIcon className=' h-5 w-5' />
                                                </div>

                                            </div>
                                        </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No tasks found for this month.</p>
                            )}
                        </div>

                    </div>


                </div>
            </div>


            {/* add advance dialogue */}
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Add a new advance"}</DialogTitle>
                <DialogContent>
                    <div className=' flex flex-col justify-center'>
                        <form>
                            <div className=' mb-2'>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Advance amount</label>
                                <input
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='number'
                                    min={0}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Date time given</label>
                                <input
                                    onChange={(e) => setDates(e.target.value)}
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='datetime-local'
                                />
                            </div>




                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handelAddAdvance}>Create</Button>
                </DialogActions>
            </Dialog>


            {/* update advance */}
            <Dialog
                open={openEditAdvance}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseEditAdvance}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"update the Advance"}</DialogTitle>
                <DialogContent>
                    <div className=' flex flex-col justify-center'>
                        <form>
                            <div className=' mb-2'>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Advance amount</label>
                                <input
                                    value={updateAmount}
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='number'
                                    min={0}
                                    onChange={(e) => setUpdateAmount(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Date time given</label>
                                <input
                                    value={updateDates}
                                    onChange={(e) => setUpdateDates(e.target.value)}
                                    // onChange={(e) => setDates(e.target.value)}
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='datetime-local'
                                />
                            </div>




                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditAdvance}>cancel</Button>
                    <Button onClick={handleEditAdvance}>update</Button>
                </DialogActions>
            </Dialog>

            {/* delete advance */}
            <Dialog
                open={openDeleteAdvance}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDeleteDialogue}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"delete the Advance"}</DialogTitle>
                <DialogContent>
                    <div className=' flex flex-col justify-center'>
                        <p>Delete this advance permanently.</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialogue}>cancel</Button>
                    <Button onClick={handleDeleteAdvance}>delete</Button>
                </DialogActions>
            </Dialog>

            {/* delete task */}
            <Dialog
                open={openDeleteTask}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDeleteTask}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"delete the Advance"}</DialogTitle>
                <DialogContent>
                    <div className=' flex flex-col justify-center'>
                        <p>Delete this task permanently.</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteTask}>cancel</Button>
                    <Button onClick={handleDeleteTask}>delete</Button>
                </DialogActions>
            </Dialog>


            {/* update task */}
            <Dialog
                open={openTaskUpdate}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseUpdateTask}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"update task"}</DialogTitle>
                <DialogContent>
                    <div className=' flex flex-col justify-center'>
                        <form>
                            <div className=' mb-2'>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Task Name</label>
                                <input
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='text'
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                />
                            </div>
                            <div className=' mb-2'>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Estimated pay</label>
                                <input
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='number'
                                    min={0}
                                    value={estimatedAmount}
                                    onChange={(e) => setEstimatedAmount(e.target.value)}
                                />
                            </div>
                            <div className=' mb-2'>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Start Date</label>
                                <input
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='datetime-local'
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>


                            <div>
                                <label className=' text-sm font-semibold lowercase text-gray-400'>Due date</label>
                                <input
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                                    type='datetime-local'
                                />
                            </div>




                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdateTask}>cancel</Button>
                    <Button onClick={handleUpdateTask}>Update</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default EmployeeDetails;
