// @ts-nocheck

import React, { useEffect, useState } from 'react'
import LeftNav from '../components/LeftNav';
import TopNavBar from '../components/TopNavBar';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleSidebar } from '../features/sidebar/sidebarSlice';
import { addingNewStocks, addNewStock, checkStockExists, deleteStocks, fetchStock, selectAllStocks, updatingStock } from '../features/stock/stocksSlice';
import CurrencyFormatter from '../components/CurrencyFormatter';
import MetricFormatter from '../components/MetricFormatter';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { CircularProgress } from '@mui/material';

const Stock = () => {
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);
  const [searchTerm, setSearchTerm] = useState<string>("")

  const all_stock = useAppSelector(selectAllStocks);
  const [open, setOpen] = useState(false);
  const [deleteStock, setDeleteStock] = useState(null);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateStock, setUpdateStock] = useState(null);

  const [openAddStock, setOpenAddStock] = useState(false);
  const [addStock, setAddStock] = useState(null);
  const [newStockColor, setNewStockColor] = useState('')
  const [newStockName, setNewStockName] = useState('');
  const [newStockRolls, setNewStockRolls] = useState('');
  const [newStockPrice, setNewStockPrice] = useState('');
  const [newStockDate, setNewStockDate] = useState('');
  const [newStockSize, setNewStockSize] = useState('');




  const [updateNoOfRools, setUpdateNoOfRolls] = useState(null);
  const [updateSizePerRools, setUpdateSizePerRolls] = useState(null);


  const [updatedNoOfRools, setUpdatedNoOfRolls] = useState(null)
  const [updatedSizePerRools, setUpdatedSizePerRolls] = useState(null)
  const [updatedMaterial, setUpdatedMaterial] = useState(null)
  const [updatedColor, setUpdatedColor] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState(null);


  const [openAddAnotherStock, setOpenAddAnotherStock] = useState(false);


  const stockExists = useAppSelector((state) => state.stocks.stockExists);
  const addingStockStatus = useAppSelector((state) => state.stocks.addStockStatus)

  const [stockId, setStockId] = useState(null)


  const handleInputStockUpdateNoOfRollsChange = (e: any) => {
    setUpdateNoOfRolls(e.target.value);
  };


  const handleInputStockUpdateSizePerRollChange = (e: any) => {
    setUpdateSizePerRolls(e.target.value);
  };

  const handleClickOpenAddStock = (stock) => {
    setAddStock(stock);
    setOpenAddStock(true);
  }

  const handleClickCloseAddStock = () => {
    setOpenAddStock(false);
    // setAddStock(null);
  }

  const handleClickOpenUpdate = (stock) => {
    setUpdateStock(stock);
    setOpenUpdate(true);
  }

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setUpdateStock(null);
  }

  const handleClickOpen = (stock) => {
    setDeleteStock(stock)
    setOpen(true);
  };



  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(fetchStock())
  }, [dispatch])


  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };


  const handleClickOpenAddAnotherStock = () => {
    setOpenAddAnotherStock(!openAddAnotherStock)
  }


  const handleInputStockNameChange = (e: any) => {
    const name = e.target.value;
    setNewStockName(name);
    dispatch(checkStockExists(name)); // Check if the stock name already exists
  };

  const handleInputStockColorChange = (e: any) => {
    setNewStockColor(e.target.value);
  };

  const handleInputStockRollsChange = (e: any) => {
    setNewStockRolls(e.target.value);
  };

  const handleInputStockPriceChange = (e: any) => {
    setNewStockPrice(e.target.value);
  };

  const handleInputStockDateChange = (e: any) => {
    setNewStockDate(e.target.value);
  };

  const handleInputStockSizeChange = (e: any) => {
    setNewStockSize(e.target.value);
  };


  const handleAddStock = (e: any) => {
    e.preventDefault();
    const newStock = {
      material: {
        name: newStockName
      },
      color: {
        name: newStockColor
      },
      num_of_rolls: newStockRolls,
      buying_price: newStockPrice,
      size: newStockSize,
      date_stocked: newStockDate
    };

    // Dispatch the action to add stock
    dispatch(addNewStock(newStock))
      .unwrap()
      .then(() => {
        // Reset the form and close the dialog
        setNewStockName('');
        setNewStockColor('');
        setNewStockRolls('');
        setNewStockPrice('');
        setNewStockSize('');
        setOpenAddAnotherStock(false);
      })

  };

  const handleAddRollsSuccess = () => {
    setOpenAddStock(false);
    setUpdateNoOfRolls(null)
    setUpdateSizePerRolls(null)
  }

  const handleAddRolls = (e: any) => {
    e.preventDefault()
    const stockData = {
      num_of_rolls: updateNoOfRools,
      size: updateSizePerRools
    }
    const stockId = addStock?.id

    dispatch(addingNewStocks({ stockData, stockId }))

    handleAddRollsSuccess()
  }

  const handleUpdateStocksSuccess = () => {
    setOpenUpdate(false)
  }

  const handleUpdateStocks = (e: any) => {
    const updateData = {
      num_of_rolls: updateStock?.num_of_rolls, // Capture from the state
      total: updateStock?.total,                // Use the total size field
      material: {
        name: updateStock?.material?.name
      },   // Capture the material name
      color: {
        name: updateStock?.color?.name
      },         // Capture the color name
      buying_price: updateStock?.buying_price,
    }
    const stockId = updateStock?.id;

    dispatch(updatingStock({ stockId, updateData }))
    handleUpdateStocksSuccess()
  }

  const handleDeletStock = () => {
    const stockId = deleteStock?.id

    dispatch(deleteStocks({ stockId }))

    setOpen(false);
  }


  const filteredMaterials = all_stock.filter(stock =>
    stock.material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          <div className=" py-6 flex space-x-4">

          </div>

          <div className=" flex items-center w-1/2 relative  mt-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search stock..."
              className="border bg-white rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-purple-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div onClick={handleClickOpenAddAnotherStock} className=' border rounded-lg px-2 bg-white cursor-pointer py-2 ms-5 flex items-center gap-2 text-orange-600'>
              <PlusCircleIcon className='h-5 w-5' />
              <p className=' whitespace-nowrap font-semibold'>add Stock</p>
            </div>


          </div>
          {/* Table Section */}
          <div className='bg-white mt-6 shadow-lg rounded-lg overflow-x-auto'>
            <table className='min-w-full text-left text-gray-900 border-collapse  divide-y divide-gray-200'>
              <thead className=" text-sm font-semibold">
                <tr className="text-gray-600">
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4">Color</th>
                  {/* <th className="px-6 py-4">No Rolls</th> */}
                  <th className="px-6 py-4">Total Size(inches)</th>
                  <th className="px-6 py-4">Buying Price</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {filteredMaterials.map((stock) => (
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">{stock.material.name}</td>
                    <td className="px-6 py-4">{stock.color.name}</td>
                    {/* <td className="px-6 py-4">{stock.num_of_rolls}</td> */}
                    <td className="px-6 py-4"><MetricFormatter total={stock.total} /></td>
                    <td className="px-6 py-4">{CurrencyFormatter({ amount: stock.buying_price, currencySymbol: 'Ksh', asString: true }) || ''}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3 text-blue-600">
                        <button onClick={() => handleClickOpenAddStock(stock)} className=" bg-blue-500 text-white font-bold text-sm px-2 py-0.5 rounded-md">Add</button>
                        <button onClick={() => handleClickOpenUpdate(stock)} className="bg-green-500 text-white font-bold text-sm px-2 py-0.5 rounded-md">Update</button>
                        <button onClick={() => handleClickOpen(stock)} className="bg-red-500 text-white font-bold text-sm px-2 py-0.5 rounded-md">Delete</button>

                      </div>
                    </td>
                  </tr>
                ))}


              </tbody>
            </table>
          </div>

          {/* Delete dialogue */}

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`Delete ${deleteStock?.material?.name}`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Delete {deleteStock?.material.name} permanently
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <button className='bg-green-500 px-2 py-0.5 text-white font-bold text-sm rounded-md' onClick={handleClose}>Cancel</button>
              <button className='bg-red-500 px-2 py-0.5 text-white font-bold text-sm rounded-md' onClick={handleDeletStock} autoFocus>
                Delete
              </button>
            </DialogActions>
          </Dialog>


          {/* Update stock dialogue */}

          <Dialog
            open={openUpdate}
            onClose={handleCloseUpdate}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`Update ${updateStock?.material?.name}`}
            </DialogTitle>
            <DialogContent>

              {/* Material Field */}
              <div className='flex flex-col'>
                <label className='font-bold text-sm'>Material</label>
                <input
                  value={updateStock?.material?.name || ''} // Pre-populate the material name
                  onChange={(e) =>
                    setUpdateStock((prev) => ({
                      ...prev,
                      material: { ...prev.material, name: e.target.value }, // Update material name
                    }))
                  }
                  className='text-sm font-semibold outline-pink-600 border-none bg-gray-300 px-2 py-1'
                  type='text'
                />
              </div>

              {/* Color */}

              <div className='flex flex-col'>
                <label className='font-bold text-sm'>Color</label>
                <input
                  value={updateStock?.color?.name || ''} // Pre-populate the material name
                  onChange={(e) =>
                    setUpdateStock((prev) => ({
                      ...prev,
                      color: { ...prev.color, name: e.target.value }, // Update material name
                    }))
                  }
                  className='text-sm font-semibold outline-pink-600 border-none bg-gray-300 px-2 py-1'
                  type='text'
                />
              </div>

              {/* buying price */}
              <div className='flex flex-col'>
                <label className='font-bold text-sm'>Buying price</label>
                <input
                  value={updateStock?.buying_price || ''} // Pre-populate the material name
                  onChange={(e) =>
                    setUpdateStock((prev) => ({
                      ...prev,
                      buying_price: e.target.value, // Update material name
                    }))
                  }
                  className='text-sm font-semibold outline-pink-600 border-none bg-gray-300 px-2 py-1'
                  type='text'
                />
              </div>

              {/* Size Per Roll Field */}
              <div className='flex flex-col'>
                <label className='font-bold text-sm'>Size Per Roll:</label>
                <input
                  value={updateStock?.total || ''} // Pre-populate the total size
                  onChange={(e) =>
                    setUpdateStock((prev) => ({
                      ...prev,
                      total: e.target.value, // Update total size
                    }))
                  }
                  className='text-sm font-semibold outline-pink-600 border-none bg-gray-300 px-2 py-1'
                  type='number'
                />
              </div>



              {/* Number of Rolls Field */}
              <div className='flex flex-col'>
                <label className='font-bold text-sm'>Number of Rolls:</label>
                <input
                  value={updateStock?.num_of_rolls || ''} // Pre-populate the number of rolls
                  onChange={(e) =>
                    setUpdateStock((prev) => ({
                      ...prev,
                      num_of_rolls: e.target.value, // Update number of rolls
                    }))
                  }
                  className='text-sm font-semibold outline-pink-600 border-none bg-gray-300 px-2 py-1'
                  type='number'
                />
              </div>

            </DialogContent>
            <DialogActions>
              <button
                className='bg-red-500 px-2 py-0.5 text-white font-bold text-sm rounded-md'
                onClick={handleCloseUpdate}
              >
                Cancel
              </button>
              <button
                className='bg-green-500 px-2 py-0.5 text-white font-bold text-sm rounded-md'
                onClick={handleUpdateStocks}
                autoFocus
              >
                Update
              </button>
            </DialogActions>
          </Dialog>


          {/* Add stock dialogue */}

          <Dialog
            open={openAddStock}
            onClose={handleClickCloseAddStock}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`Add ${addStock?.material?.name} stock`}
            </DialogTitle>

            <DialogContent>

              <div className=' flex flex-col'>
                <label className=' font-bold text-sm'>Number of rolls:</label>
                <input
                  min={0}
                  value={updateNoOfRools}
                  onChange={handleInputStockUpdateNoOfRollsChange}
                  className=' text-sm font-semibold outline-pink-600 border-none bg-gray-300 px-2 py-1' type='number' />
              </div>

              <div className=' flex flex-col'>
                <label className=' font-bold text-sm'>Size Per roll:</label>
                <input
                  min={0}
                  value={updateSizePerRools}
                  onChange={handleInputStockUpdateSizePerRollChange}
                  className=' text-sm font-semibold outline-pink-600 border-none bg-gray-300 px-2 py-1' type='number' />
              </div>

            </DialogContent>
            <DialogActions>
              <button className='bg-green-500 px-2 py-0.5 text-white font-bold text-sm rounded-md' onClick={handleClickCloseAddStock}>Cancel</button>
              <button className='bg-red-500 px-2 py-0.5 text-white font-bold text-sm rounded-md' onClick={handleAddRolls} autoFocus>
                add
              </button>
            </DialogActions>

          </Dialog>



          <Dialog
            open={openAddAnotherStock}
            onClose={handleClickOpenAddAnotherStock}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Add a new product to store"}
            </DialogTitle>
            <form onSubmit={handleAddStock}>
              <DialogContent className=' '>
                <label className=' text-sm font-semibold'>Material name</label>
                <input
                  className='mb-3 w-full outline-none border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md'
                  type='text'
                  value={newStockName}
                  onChange={handleInputStockNameChange}
                  placeholder="Enter product name"
                />
                <label className=' text-sm font-semibold'>Color</label>
                <input
                  className='mb-3 w-full outline-none border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md'
                  type='text'
                  value={newStockColor}
                  onChange={handleInputStockColorChange}
                  placeholder="Enter product color"
                />
                <label className=' text-sm font-semibold'>Number of rolls</label>
                <input
                  className='mb-3 w-full outline-none border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md'
                  type='number'
                  value={newStockRolls}
                  onChange={handleInputStockRollsChange}
                  placeholder="Enter number of rolls"
                />
                <label className=' text-sm font-semibold'>Size per roll</label>
                <input
                  className='mb-3 w-full outline-none border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md'
                  type='number'
                  value={newStockSize}
                  onChange={handleInputStockSizeChange}
                  placeholder="size per roll"
                />
                <label className=' text-sm font-semibold'>Buying price per roll</label>
                <input
                  className='mb-3 w-full outline-none border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md'
                  type='number'
                  value={newStockPrice}
                  onChange={handleInputStockPriceChange}
                  placeholder="Enter buying price"
                />
                <label className=' text-sm font-semibold'>Date Stocked</label>
                <input
                  className='mb-3 w-full outline-none border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md'
                  type='date'
                  value={newStockDate}
                  onChange={handleInputStockDateChange}
                  placeholder="Enter buying price"
                />

                {stockExists && (
                  <div className="text-red-500 text-sm">
                    This stock already exists!
                  </div>
                )}
              </DialogContent>
              <DialogActions className='flex gap-2'>
                {addingStockStatus === 'loading' ? (
                  <>
                    <button
                      className=' cursor-not-allowed rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5'
                    >
                      Cancel
                    </button>
                    <button
                      className=' flex items-center rounded-md bg-blue-50 hover:bg-blue-300 px-2 py-0.5'
                    >
                      <CircularProgress color="secondary" className=' !h-5 !w-5' />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className='rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5'
                      onClick={handleClickOpenAddAnotherStock}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddStock}
                      className='rounded-md bg-blue-50 hover:bg-blue-300 px-2 py-0.5'
                      disabled={stockExists}
                    >
                      Add Stock
                    </button>
                  </>
                )}
              </DialogActions>
            </form>
          </Dialog>

        </div>
      </div>
    </div>
  );

}

export default Stock