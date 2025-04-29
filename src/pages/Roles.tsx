// @ts-nocheck

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleSidebar } from '../features/sidebar/sidebarSlice';
import LeftNav from '../components/LeftNav';
import TopNavBar from '../components/TopNavBar';
import { CalendarDateRangeIcon, ChevronUpDownIcon, EllipsisVerticalIcon, PlusCircleIcon, PlusIcon, RectangleStackIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { addRoles, fetchRoles, selectAllRoles } from '../features/roles/rolesSlice';
import TimeDiff from '../components/TimeDiff';
import { addProject, fetchProject, resetAddProjectStatus, selectAllProjects } from '../features/roles/projectsSlice';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { fetchMaterial, selectAllMaterials } from '../features/material/materialSlice';
import { fetchProducts, selectAllProducts } from '../features/products/productsSlice';
import { fetchEmployees, selectAllEmployee } from '../features/employees/employeesSlice';




const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Roles = () => {
  const dispatch = useAppDispatch()
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectTask, setSelectedProjectTask] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [showTaskingDialogue, setShowTaskingDialogue] = useState(false)
  const [showTaskingDialogueAgain, setShowTaskingDialogueAgain] = useState(false)
  const [materialCount, setMaterialCount] = useState(0);

  const all_material = useAppSelector(selectAllMaterials);
  console.log('all materials ', all_material)

  const addprojectStatus = useAppSelector((state) => state.projects.addProjectStatus);
  const newlyCreatedProject = useAppSelector((state) => state.projects.newlyCreatedProject);

  const handleMaterialCountChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setMaterialCount(count);
    setMaterials(Array(count).fill({ materialId: "", materialSize: 0 }));
  };

  // Handler to update individual material in the array
  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][field] = value;
    setMaterials(updatedMaterials);
  };

  useEffect(() => {
    dispatch(fetchMaterial())
  }, [dispatch])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpenTaskingAgain = () => {
    setShowTaskingDialogueAgain(true);
  };

  const handleCloseTasking = () => {
    setShowTaskingDialogue(false);
  };
  const handleCloseTaskingAgain = () => {
    setShowTaskingDialogueAgain(false);
  };

  const all_project = useAppSelector(selectAllProjects);
  const all_employees = useAppSelector(selectAllEmployee);

  const all_roles = useAppSelector(selectAllRoles);
  const all_products = useAppSelector(selectAllProducts);
  const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);

  const [name, setName] = useState('');
  const [materialUsed, setMaterialUsed] = useState(null);
  const [materialSize, setMaterialSize] = useState(null);
  const [product, setProduct] = useState(null);
  const [productSize, setProductSize] = useState();
  const [quantity, setQuantity] = useState();
  const [materials, setMaterials] = useState([]);

  const [taskName, setTaskName] = useState('');
  const [pay, setPay] = useState(null);
  const [taskQuantity, setTaskQuantity] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignTo, setAssignTo] = useState(null);

  const handleAddTask = (e: any) => {
    e.preventDefault();
    const formData = {
      project: newlyCreatedProject?.id,
      task_name: taskName,
      estimated_pay: pay,
      start_date: startDate,
      due_date_time: dueDate,
      assigned_to: assignTo,
      quantity: taskQuantity
    }
    console.log('added this ', formData)
    dispatch(addRoles(formData))
  }

  const handelAddProject = (e: any) => {
    e.preventDefault();
    const formData = {
      name,
      // material_to_use: materialUsed,
      // material_size: materialSize,
      materials: materials.map((material) => ({
        material_to_use: material.materialId,      // Material ID
        material_size: material.materialSize        // Material size
      })),
      product,
      product_size: productSize,
      quantity
    }

    dispatch(addProject(formData))
  }

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project); // Set the clicked project as the selected one
  };

  const handleAddTheTaskClick = (project) => {
    setSelectedProjectTask(project);
    setShowTaskingDialogueAgain(true)
  }

  const filteredRoles = selectedProject
    ? all_roles.filter((role) => role.project.id === selectedProject.id)
    : all_roles;

    // console.log('filetered role data, ', filteredRoles)
  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])


  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchEmployees())
  }, [dispatch])



  useEffect(() => {
    dispatch(fetchProject())
  }, [dispatch])


  const handleCheckboxToggle = () => {
    // const updatedRole = { ...role, completed: !role.completed };
  }


  useEffect(() => {
    if (addprojectStatus === 'succeeded' && newlyCreatedProject) {
      setShowTaskingDialogue(true); // Show task dialog
      setSelectedProjectTask(newlyCreatedProject)
      setOpen(false);
      dispatch(resetAddProjectStatus());
    }
  }, [addprojectStatus, newlyCreatedProject]);



  const handleAddTheTask = (e: any) => {
    e.preventDefault();

    const formData = {
      project: selectedProjectTask?.id,
      task_name: taskName,
      estimated_pay: pay,
      start_date: startDate,
      due_date_time: dueDate,
      assigned_to: assignTo,
      quantity: taskQuantity,
      // materials: materials.map((material) => ({
      //   material_to_use: material.materialId,      // Material ID
      //   material_size: material.materialSize        // Material size
      // })),
    }
    dispatch(addRoles(formData))
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

        <div className="p-6 max-h-[550px] overflow-y-auto">
          <div className=' bg-white rounded-lg flex justify-between px-3 py-4'>
            <div>
              <h4 className=' text-gray-400 font-medium text-sm mb-2'>Total Projects</h4>
              <p className=' font-semibold'>1</p>
            </div>
            <div className='border-l border-dashed border-gray-300 pl-3'>
              <h4 className=' text-gray-400 font-medium text-sm mb-2'>Total Tasks</h4>
              <p className=' font-semibold'>0</p>
            </div>
            <div className='border-l border-dashed border-gray-300 pl-3'>
              <h4 className=' text-gray-400 font-medium text-sm mb-2'>Assigned Tasks</h4>
              <p className=' font-semibold'>1</p>
            </div>
            <div className='border-l border-dashed border-gray-300 pl-3'>
              <h4 className=' text-gray-400 font-medium text-sm mb-2'>Completed Tasks</h4>
              <p className=' font-semibold'>1</p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 mt-2'>
            <div className=' bg-gray-200 p-3 rounded-lg px-3'>
              <div className=' flex justify-between items-center '>
                <h5 className=' font-semibold text-sm'>Assigned tasks</h5>
                <div className=' flex space-x-4'>
                  <div className=' flex items-center space-x-2 bg-white rounded-lg px-2 py-0.5 cursor-pointer'>
                    <p className=' text-xs font-semibold lowercase'>Nearest Due date</p>
                    <ChevronUpDownIcon className=' h-4 w-4' />
                  </div>
                  <div className='bg-white rounded-xl p-2 cursor-pointer'>
                    <EllipsisVerticalIcon className='w-4 h-4 ' />
                  </div>

                </div>


              </div>
              <div className=' border border-dashed border-gray-400 my-4'></div>

              {filteredRoles.map((role) => (
                <div className=' mt-2 flex justify-between items-center bg-white px-2 py-1 rounded-lg'>
                  <div>
                    <div className=' flex gap-4'>
                      <h4 className=' font-bold text-base text-gray-700'>{role?.project?.name}</h4>
                      <h5 className=' flex gap-2'>
                        <span className='font-semibold'>Assigned To:</span>
                        {role.assigned_to ? (
                          <>
                            <span>{role?.assigned_to?.first_name} </span>
                            <span>{role?.assigned_to?.last_name}</span>
                          </>
                        ) : (
                          <div className=' flex gap-2'>
                            <p className=' bg-pink-500 px-1 py-0.5 rounded-md font-semibold lowercase text-white'>Unassigned</p>
                            <button className=' bg-slate-500 text-white font-semibold  border border-gray-300 px-2 rounded-md'>assign</button>
                          </div>

                        )}


                      </h5>

                    </div>
                    <div className=' flex items-center'>
                      <p className=' font-medium text-base text-gray-600'>{role?.task_name} x {role?.quantity}</p>
                      <StarIcon className=' h-2 w-2 mx-2' />
                      <p className=' flex items-center gap-2 text-gray-500 font-medium'><CalendarDateRangeIcon className='h-3 w-3' /> <TimeDiff dueDateTime={role.due_date_time} /></p>
                    </div>

                  </div>
                  <div className=' border border-gray-400 px-1 rounded-lg cursor-pointer'>
                    <input type='checkbox' onChange={() => handleCheckboxToggle(role)} checked={role?.completed} className=' cursor-pointer' />
                  </div>
                </div>
              ))}
            </div>

            {/* adding the project */}
            <div className=' bg-gray-200 p-3 rounded-lg px-3'>
              <div className=' flex justify-between items-center '>
                <h5 className=' font-semibold text-sm'>Assigned Projects</h5>
                <div className=' flex space-x-4'>
                  <div className=' flex items-center space-x-2 bg-white rounded-lg px-2 py-0.5 cursor-pointer'>
                    <p className=' text-xs font-semibold lowercase'>Nearest Due date</p>
                    <ChevronUpDownIcon className=' h-4 w-4' />
                  </div>
                  <div className='bg-white rounded-xl p-2 cursor-pointer'>
                    <EllipsisVerticalIcon className='w-4 h-4 ' />
                  </div>

                </div>
              </div>
              <div className=' border border-dashed border-gray-400 my-4'></div>
              <div className='mt-2 grid grid-cols-2 gap-5 items-center bg-gray-300 px-2 py-1 rounded-lg'>
                <div onClick={handleClickOpen} className='border border-pink-600 shadow-lg flex items-center bg-white px-4 py-1 rounded-lg gap-2 cursor-pointer h-full w-full'>
                  <div className='bg-gray-600 rounded-full p-1'>
                    <PlusIcon className='!text-white h-6 w-6' />
                  </div>
                  <p className='font-semibold'>New Project</p>
                </div>


                {all_project.slice().sort((a, b) => new Date(b.date_created) - new Date(a.date_created)).map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className='flex justify-between items-center bg-white px-4 py-1 rounded-lg gap-2 cursor-pointer h-full w-full'>
                    <div className='bg-gray-600 rounded-full p-1'>
                      <RectangleStackIcon className='!text-white h-6 w-6' />
                    </div>
                    <div>
                      <p className='font-semibold'>{project?.name}</p>
                      <span className='font-medium text-sm'>{project?.task_count} tasks due soon</span>
                    </div>
                    <div onClick={() => handleAddTheTaskClick(project)} className='right-0 bg-green-500  rounded-full p-2 cursor-pointer'>
                      <PlusIcon className=' h-5 w-5 text-white font-bold' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>



      <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"Add a new project"}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col justify-center">
            <form>
              <div className="mb-2">
                <label className="text-sm font-semibold lowercase text-gray-400">Project name</label>
                <input
                  className="w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* start Task material */}
              <div className='bg-orange-100 !px-1 rounded-md py-1'>
                <div>
                  <label className="text-sm font-semibold lowercase text-gray-400">How many materials to use</label>
                  <input
                    className="w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700"
                    type="number"
                    min={0}
                    onChange={handleMaterialCountChange}
                  />
                </div>

                {materials.map((_, index) => (
                  <div key={index} className="mb-4">
                    <div>
                      <label className="text-sm font-semibold lowercase text-gray-400">Material #{index + 1}</label>
                      <select
                        onChange={(e) => handleMaterialChange(index, "materialId", parseInt(e.target.value))}
                        className="w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700"
                      >
                        <option value="">---Select Material---</option>
                        {all_material.map((material) => (
                          <option key={material.id} value={material.id}>{material.material.name} {material.color.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold lowercase text-gray-400">Material size #{index + 1}</label>
                      <input
                        type="number"
                        min={0}
                        className="w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700"
                        onChange={(e) => handleMaterialChange(index, "materialSize", parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* end Task material */}
              
              {/* Product and other inputs below */}
              <div>
                <label className="text-sm font-semibold lowercase text-gray-400">Product</label>
                <select
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700"
                >
                  <option value="">--select product--</option>
                  {all_products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold lowercase text-gray-400">Product size</label>
                <input
                  value={productSize}
                  onChange={(e) => setProductSize(e.target.value)}
                  className="w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700"
                  type="number" min={0}
                />
              </div>

              <div>
                <label className="text-sm font-semibold lowercase text-gray-400">Quantity</label>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700"
                  type="number"
                  min={0}
                />
              </div>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handelAddProject}>Create</Button>
        </DialogActions>
      </Dialog>



      <Dialog
        open={showTaskingDialogue}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseTasking}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Add Task to  ${selectedProjectTask?.name}`}</DialogTitle>
        <DialogContent>
          <div className=' flex flex-col justify-center'>
            <form>
              <div className=' '>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Task name</label>
                <input
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  type='text'
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>

              

              <div>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Task Payment</label>
                <input
                  onChange={(e) => setPay(parseFloat(e.target.value))}
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  type='number' min={0}
                />
              </div>
              <div>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Quantity</label>
                <input
                  onChange={(e) => setTaskQuantity(parseFloat(e.target.value))}
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  type='number' min={0}
                />
              </div>
              <div>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Assign to</label>
                <select
                  onChange={(e) => setAssignTo(e.target.value)}
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  name="product" id="product">
                  <option value="">--select product--</option>
                  {all_employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>{employee?.first_name} {employee?.last_name}</option>
                  ))}

                </select>
              </div>
              <div>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Task start date</label>
                <input
                  onChange={(e) => setStartDate(e.target.value)}
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  type='datetime-local' min={0}
                />

              </div>
              <div>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Tast End Date</label>
                <input
                  onChange={(e) => setDueDate(e.target.value)}
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  type='datetime-local'
                  min={0} />
              </div>

            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTasking}>Cancel</Button>
          <Button onClick={handleAddTheTask}>Create</Button>
        </DialogActions>
      </Dialog>



      <Dialog
        open={showTaskingDialogueAgain}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseTaskingAgain}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Add Task to  ${selectedProjectTask?.name}`}</DialogTitle>
        <DialogContent>
          <div className=' flex flex-col justify-center'>
            <form>
              <div className=''>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Task name</label>
                <input
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  type='text'
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>

              {/* add task material */}
              {/* <div className='bg-orange-100 !px-1 rounded-md py-1'>
                <div>
                  <label className="text-sm font-semibold lowercase text-gray-400">How many materials to use</label>
                  <input
                    className="w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700"
                    type="number"
                    min={0}
                    onChange={handleMaterialCountChange}
                  />
                </div>

                {materials.map((_, index) => (
                  <div key={index} className="mb-4">
                    <div>
                      <label className="text-sm font-semibold lowercase text-gray-400">Material #{index + 1}</label>
                      <select
                        onChange={(e) => handleMaterialChange(index, "materialId", parseInt(e.target.value))}
                        className="w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700"
                      >
                        <option value="">---Select Material---</option>
                        {all_material.map((material) => (
                          <option key={material.id} value={material.id}>{material.material.name} {material.color.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold lowercase text-gray-400">Material size #{index + 1}</label>
                      <input
                        type="number"
                        min={0}
                        className="w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700"
                        onChange={(e) => handleMaterialChange(index, "materialSize", parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                ))}
              </div> */}
              {/* end task material */}

              <div>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Task Payment Per Quantity</label>
                <input
                  onChange={(e) => setPay(parseFloat(e.target.value))}
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  type='number' min={0}
                />
              </div>
              <div>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Quantity</label>
                <input
                  onChange={(e) => setTaskQuantity(parseFloat(e.target.value))}
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  type='number' min={0}
                />
              </div>
              <div>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Assign to</label>
                <select
                  onChange={(e) => setAssignTo(e.target.value)}
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  name="product" id="product">
                  <option value="">--select product--</option>
                  {all_employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>{employee?.first_name} {employee?.last_name}</option>
                  ))}

                </select>
              </div>
              <div>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Task start date</label>
                <input
                  onChange={(e) => setStartDate(e.target.value)}
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  type='datetime-local' min={0}
                />

              </div>
              <div>
                <label className=' text-sm font-semibold lowercase text-gray-400'>Tast End Date</label>
                <input
                  onChange={(e) => setDueDate(e.target.value)}
                  className=' w-full outline-none border border-gray-500 rounded-md px-2 py-0.5 focus:border-pink-700'
                  type='datetime-local'
                  min={0} />
              </div>

            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTaskingAgain}>Cancel</Button>
          <Button onClick={handleAddTheTask}>Create</Button>
        </DialogActions>
      </Dialog>



    </div>
  )
}

export default Roles;