// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleSidebar } from '../features/sidebar/sidebarSlice';
import LeftNav from '../components/LeftNav';
import TopNavBar from '../components/TopNavBar';
import { fetchCustomers, selectAllCustomer } from '../features/customer/customersSlice';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const Customers = () => {
  const dispatch = useAppDispatch();
  const all_customers = useAppSelector(selectAllCustomer);
  const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);
  const [open, setOpen] = useState({});

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // Toggle the expanded state of individual rows
  const toggleRow = (customerId) => {
    setOpen((prev) => ({
      ...prev,
      [customerId]: !prev[customerId],
    }));
  };

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  return (
    <div className='flex h-screen'>
      <LeftNav isCollapsed={isCollapsed} />
      <div className="flex-1 bg-gray-100">
        <TopNavBar isCollapsed={isCollapsed} toggleSidebar={handleToggleSidebar} />
        <div className="p-6 max-h-[550px] overflow-y-auto flex justify-center">
          <div className='bg-white mt-6 shadow-lg rounded-lg overflow-x-auto'>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Customer name</TableCell>
                    <TableCell align="right">Phone</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {all_customers.map((customer) => (
                    <React.Fragment key={customer.id}>
                      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => toggleRow(customer.id)}
                          >
                            {open[customer.id] ? <ChevronUpIcon className='h-4 w-4' /> : <ChevronDownIcon className='h-4 w-4' />}
                          </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {customer.name}
                        </TableCell>
                        <TableCell align="right">+254 {customer.phone}</TableCell>
                        <TableCell align="right">
                          <div className="flex space-x-3 text-blue-600">
                            <button
                              className="bg-blue-400 px-2 py-0.5 rounded-md text-white font-semibold flex items-center gap-2"
                            >
                              Create order
                            </button>
                            <button
                              className="bg-pink-400 px-2 py-0.5 rounded-md text-white font-semibold flex items-center gap-2"
                              onClick={() => toggleRow(customer.id)}
                            >
                              History
                            </button>
                            <button
                              className="bg-green-500 px-2 py-0.5 rounded-md text-white font-semibold flex items-center gap-2"
                            >
                              Update
                            </button>
                            <button
                              className="bg-red-400 px-2 py-0.5 rounded-md text-white font-semibold flex items-center gap-2"
                            >
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={open[customer.id]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <Typography variant="h6" gutterBottom component="div">
                                History
                              </Typography>
                              {customer.carts.length > 0 ? (
                                <Table size="small" aria-label="purchases">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Date</TableCell>
                                      <TableCell>Product</TableCell>
                                      <TableCell align="right">Quantity</TableCell>
                                      <TableCell align="right">Mode of Payment</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {customer.carts.map((cart) => (
                                      <TableRow key={cart.id}>
                                        <TableCell component="th" scope="row">
                                          {new Date(cart.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{cart.product.product.name} {cart.product.material.name} {cart.product.color.name} {cart.product.size.size}</TableCell>
                                        <TableCell align="right">{cart.quantity}</TableCell>
                                        <TableCell align="right">{cart.mode_of_payment}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <Typography>No cart history available</Typography>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
