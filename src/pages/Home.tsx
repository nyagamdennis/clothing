// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleSidebar } from '../features/sidebar/sidebarSlice';
import LeftNav from '../components/LeftNav';
import TopNavBar from '../components/TopNavBar';
import { MagnifyingGlassIcon, MapPinIcon, PencilIcon, PlusCircleIcon, ReceiptPercentIcon, ShoppingCartIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { addProduct, addProductPro, addToCart, checkProductExists, deleteProductPro, deleteThisProduct, fetchProducts, getProductsStatus, selectAllProducts, updateProduct, updateProductPro, updateProductProQuantity } from '../features/products/productsSlice';
import CurrencyFormatter from '../components/CurrencyFormatter';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { fetchCart } from '../features/orders/cartSlice';

const Home = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Track if panel is open
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateSelectedProduct, setUpdateSelectedProduct] = useState(null)
  const [productUpdateOpen, setProducUpdateOpen] = useState(false)
  const [material, setMaterial] = useState('')
  const [color, setColor] = useState('')
  const [size, setSize] = useState('');
  const [alphabeticalSize, setAlphabeticalSize] = useState('');
  const [price, setPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [isPanelOpenEdit, setIsPanelOpenEdit] = useState(false);
  const [selectedProductEdit, setSelectedProductEdit] = useState(null);
  const [selectedVariationEdit, setSelectedVariationEdit] = useState(null);

  const [isPanelOpenCart, setIsPanelOpenCart] = useState(false);
  const [selectedProductCart, setSelectedProductCart] = useState(null);
  const [selectedVariationCart, setSelectedVariationCart] = useState(null);

  const [successMessage, setSuccessMessage] = useState('')
  const [alertMessage, setAlertMessage] = useState('')

  const [deleteProduct, setDeleteProduct] = useState(null);

  const [recieveProduct, setRecieveProduct] = useState(null);
  const [recieveProductVariation, setRecieveProductVariation] = useState(null);
  const [openRecieveProduct, setOpenRecieveProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleteProd, setDeleteProd] = useState(null);
  const [openDeleteProd, setOpenDeleteProd] = useState(false);



  const [openAddProduct, setOpenAddProduct] = useState(false);


  const [editMaterial, setEditMaterial] = useState('');
  const [editMaterialId, setEditMaterialId] = useState();
  const [editColor, setEditColor] = useState('');
  const [editColorId, setEditColorId] = useState();
  const [editSize, setEditSize] = useState('');
  const [editAlphabeticalSize, setEditAlphabeticalSize] = useState('');
  const [editSizeId, setEditSizeId] = useState();
  const [editQuantity, setEditQuantity] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editId, setEditId] = useState('');
  const [addnewQuantity, setAddNewQuantity] = useState('')
  const [quantityEditId, setQuantityEditId] = useState('')


  const [customerName, setCustomerName] = useState('');
  const [cartProduct, setCartProduct] = useState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryTo, setDeliveryTo] = useState('');
  const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState('');
  const [selectedCartPayment, setSelectedCartPayment] = useState('fullyPaid');
  const [Balance, setBalance] = useState(0);

  const [quantity, setQuantity] = useState('');

  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedCompleteSale, setSelectedCompleteSale] = useState('');

  const [selectDelivery, setSelectDelivery] = useState('');

  const [deposit, setDeposit] = useState<number>(0);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isFullyPaid, setIsFullyPaid] = useState(true);

  const [isEditingProduct, setIsEditingProduct] = useState(false)

  const handleAddCartSuccess = () => {
    setQuantity('');
    setSelectedPayment('')
    setSelectedCompleteSale('')
    setSelectDelivery('')
    setDeposit(0)
    setCustomerName('')
    setPhoneNumber('')
    setDeliveryTo('')
    setDeliveryPhoneNumber('')
    setDeliveryDate('')
    setIsPanelOpenCart(false); // Clear the input field
    setSuccessMessage('Successfully Added to cart.');
    setShowSuccessMessage(true);

    // Start a timer to clear the success message
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage('');
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer
  };

  const handleDeliveryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryDate(e.target.value);
  };

  const handleSelection = (paymentType) => {
    setSelectedPayment(paymentType);

    // Set isFullyPaid based on the selected payment type
    if (paymentType === 'fullyPaid') {
      setIsFullyPaid(true); // Fully paid
    } else if (paymentType === 'partialPayment') {
      setIsFullyPaid(false); // Partial payment
    }

  };





  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVariationCart) {
      console.error("No product selected");
      return;
    }
    // Capture all the form data
    const orderData = {
      product: selectedVariationCart?.id,
      customer: {
        name: customerName,
        phone: phoneNumber,
      },
      to_be_delivered_to: selectDelivery === 'others' ? deliveryTo : customerName, // Use customer name if delivery is the same
      no_to_be_delivered: selectDelivery === 'others' ? deliveryPhoneNumber : phoneNumber,
      quantity,
      selectedPayment,
      deposited: selectedPayment === 'partialPayment' ? deposit : null,
      balance: selectedPayment === 'partialPayment' ? balance : null,
      delivered: selectedCompleteSale === 'complete' ? true : false,
      due_date: deliveryDate,
      fully_payed: selectedPayment === 'fullyPaid',
    };

    dispatch(addToCart({ orderData }))


      .unwrap()  // Get the result of the async thunk
      .then(() => {
        // Fetch the updated cart after adding the item
        dispatch(fetchCart());
      })
      .catch((error) => {
        console.error("Failed to add to cart: ", error);
      });

    handleAddCartSuccess()

  };

  const updatingProdStatus = useAppSelector((state) => state.products.updateProductProStatus)


  const handleOpenAddProduct = () => {
    setOpenAddProduct(!openAddProduct)
  }

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0; // Convert to number and handle NaN
    // setBalance(totalAmount - depositAmount)
    setDeposit(value);
  };

  // Calculate balance (price - deposit)
  const balance = (quantity * selectedVariationCart?.price) - deposit;

  const handleDeliverySelection = (deliveryTo: string) => {
    setSelectDelivery(deliveryTo);
  };





  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputQuantity = Number(e.target.value);
    const maxQuantity = selectedVariationCart?.quantity || 0; // Use the size as the maximum quantity

    // Ensure the input quantity is less than or equal to the maxQuantity and greater than or equal to 0
    if (inputQuantity <= maxQuantity && inputQuantity >= 0) {
      setQuantity(inputQuantity.toString());
    } else if (inputQuantity > maxQuantity) {
      // Optionally provide feedback if they try to input more than allowed
      setQuantity(maxQuantity.toString());
    } else {
      setQuantity(''); // Reset quantity if invalid
    }
  };


  const all_products = useAppSelector(selectAllProducts);

  const handleClickOpenRecievedProdcut = (product, variation) => {
    setRecieveProduct(product);
    setRecieveProductVariation(variation)

    setQuantityEditId(variation.id || '');


    setOpenRecieveProduct(true);
  }

  const handleClickCloseRecievedProdcut = (product, variation) => {
    setRecieveProduct(null);
    setRecieveProductVariation(null)
    setOpenRecieveProduct(false);
  }


  const handleProductClick = (product) => {

    setIsPanelOpenEdit(false);
    setIsPanelOpenCart(false);
    setSelectedProduct(product);
    setSelectedProductId(product.id);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleProductClickEdit = (product, variation) => {
    setSelectedProductEdit(product);
    setSelectedVariationEdit(variation);

    setEditMaterial(variation.material?.name || '');
    setEditMaterialId(variation.material?.id || '');
    setEditColor(variation.color?.name || '');
    setEditColorId(variation.color?.id || '');
    setEditSize(variation.size.size || '');
    setEditAlphabeticalSize(variation.size.alphabetic_size || '');
    setEditSizeId(variation.size.id || '');
    setEditQuantity(variation.quantity || '');
    setEditPrice(variation.price || '');
    setEditId(variation.id || '');


    setIsPanelOpenEdit(true);
  };

  const handleClosePanelEdit = () => {
    setIsPanelOpenEdit(false);
    setTimeout(() => setSelectedProductEdit(null), 300);
  };


  const handleProductProUpdateSuccess = () => {
    setEditMaterial('');
    setEditColor('');
    setEditSize('');
    setEditQuantity('');
    setEditPrice('');
    setEditId('');
    setIsPanelOpenEdit(false); // Clear the input field
    setSuccessMessage('Successfully updated the product!');
    setShowSuccessMessage(true);

    // Start a timer to clear the success message
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage('');
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer
  };

  const handleUpdateProductPro = async(e: any) => {
    e.preventDefault();

    const updatedProduct = {
      material: {
        id: editMaterialId,
        name: editMaterial
      },
      color: {
        id: editColorId,
        name: editColor
      },
      size: {
        id: editSizeId,
        size: editSize,
        alphabetic_size: editAlphabeticalSize
      },
      quantity: editQuantity,
      price: editPrice,
    };

    // Dispatch the update or call an API with the updatedProduct
    try {
      setIsEditingProduct(true)
      dispatch(updateProductPro({
        id: editId,
        updateProdId: selectedProductEdit?.id,
        updatedData: updatedProduct // Other fields can also be added here if necessary
      }));
      setIsEditingProduct(false)

    } catch (error) {
      setIsEditingProduct(false);
      alert('An error occured. Try again.')
    }
    

    handleProductProUpdateSuccess()
  };



  const handleProductClickCart = (product, variation) => {
    setSelectedProductCart(product);
    setSelectedVariationCart(variation);
    setIsPanelOpenCart(true);
  };


  const handleClosePanelCart = () => {
    setIsPanelOpenCart(false);
    setTimeout(() => setSelectedProductCart(null), 300);
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])


  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };




  //  handling adding new product logic start

  const productExists = useAppSelector((state) => state.products.productExists);

  const [newProductName, setNewProductName] = useState('');
  const addingProductStatus = useAppSelector((state) => state.products.addProductStatus)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)


  const handleInputChange = (e: any) => {
    const name = e.target.value;
    setNewProductName(name);
    dispatch(checkProductExists(name)); // Check if the product exists
  };

  let timer;
  const AddTocartSuccess = () => {
    setNewProductName(''); // Clear the input field
    setOpenAddProduct(false)
    setSuccessMessage('Successfully added the product!')
    setShowSuccessMessage(true);

    timer = setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage('');
    }, 3000);
  }
  const handleAddProduct = () => {
    if (!productExists) {
      // Proceed with adding the new product
      dispatch(addProduct({ name: newProductName })); // Adjust according to your action payload
      // setOpenAddProduct(false)
      // setOpenAddProduct(!openAddProduct)
      AddTocartSuccess()
    } else {
      alert('Product already exists!');
    }
  };


 

  //  Updating new product logic Start
  const updateProductStatus = useAppSelector((state) => state.products.updateProductStatus)
  const updateProductError = useAppSelector((state) => state.products.updateProductError)
  const [updatedProductName, setUpdatedProductName] = useState(updateSelectedProduct?.name);

  const [addingNewProduct, setAddingNewProduct] = useState(false);



  const handleClickOpenUpdateProduct = (product) => {
    setUpdateSelectedProduct(product);
    setUpdatedProductName(product.name);
    setProducUpdateOpen(true);
  }



  const handleClickCloseUpdateProduct = () => {
    setProducUpdateOpen(false)
  }


  const handleUpdateInputChange = (e) => {
    setUpdatedProductName(e.target.value);
  };

  const handleInputQuantityAddChange = (e: any) => {
    setAddNewQuantity(e.target.value)
  }

  const handleProductQuantityUpdateSuccess = () => {
    setOpenRecieveProduct(false);
    setAddNewQuantity(''); // Clear the input field
    setSuccessMessage('Successfully added the product quantity!');
    setShowSuccessMessage(true);

    // Start a timer to clear the success message
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage('');
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer
  };


  const handleAddQuantity = (e: any) => {
    e.preventDefault();
    const updatedProduct = {
      quantity: addnewQuantity,
    };

    dispatch(updateProductProQuantity({
      id: quantityEditId,
      updateProdId: recieveProduct?.id,
      updatedData: updatedProduct
    }))
    handleProductQuantityUpdateSuccess()
  }
  const handleProductUpdateSuccess = () => {
    setProducUpdateOpen(!productUpdateOpen)
    setUpdatedProductName(''); // Clear the input field
    setSuccessMessage('Successfully updated the product!');
    setShowSuccessMessage(true);

    // Start a timer to clear the success message
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage('');
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer
  };

  const handleUpdateProduct = () => {
    // Dispatch the updateProduct action with the updated name and ID
    dispatch(updateProduct({
      id: updateSelectedProduct?.id,
      updatedData: { name: updatedProductName } // Other fields can also be added here if necessary
    }));
    handleProductUpdateSuccess();
  };




  // Deleting the product

  const deleteProductStatus = useAppSelector((state) => state.products.deleteThisProductStatus)
  const deleteProductError = useAppSelector((state) => state.products.deleteThisProductError)


  const handleClickOpenDelete = (product) => {
    setDeleteProduct(product);
    setOpenDelete(true);
  };


  const handleClickCloseDelete = (product) => {
    setDeleteProduct(null);
    setOpenDelete(false);
  };

  const handleProductDeleteSuccess = () => {

    setSuccessMessage('Successfully Deleted the product!');
    setShowSuccessMessage(true);
    setOpenDelete(false)

    // Start a timer to clear the success message
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage('');
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer
  };

  const handleDeleteProduct = () => {
    // Dispatch the updateProduct action with the updated name and ID
    dispatch(deleteThisProduct({
      productId: deleteProduct?.id,
    }));
    handleProductDeleteSuccess();
  };


  // Deleting the product

  // Deleting the product pro start


  const deleting_productpro_status = useAppSelector((state) => state.products.deleteThisProductStatus)
  const deleting_productpro_error = useAppSelector((state) => state.products.deleteThisProductError)


  const handleOpenDeletProductProd = (product) => {
    setDeleteProd(product);
    console.log('Proo ', product.product)
    setOpenDeleteProd(true);
  }


  const handleCloseDeletProductProd = (product) => {
    setDeleteProd(product);
    setOpenDeleteProd(false);
  }

  const handleProductProDeleteSuccess = () => {

    setSuccessMessage('Successfully Deleted the product!');
    setShowSuccessMessage(true);
    setOpenDeleteProd(false)

    // Start a timer to clear the success message
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage('');
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer
  };

  const handleDeleteProductPro = () => {
    // Dispatch the updateProduct action with the updated name and ID
    dispatch(deleteProductPro({
      variationId: deleteProd?.id,
      productProId: deleteProd?.product
    }));
    handleProductProDeleteSuccess();
  };

  // Deleting the product pro end

  // adding the product pro start

  const adding_product_status = useAppSelector((state) => state.products.addProductProStatus)

  const handleAddProductPro = async(e) => {
    e.preventDefault();
setAddingNewProduct(true);
    if (selectedProduct) {
      try {
        await dispatch(addProductPro({
          product: selectedProduct.id,  // Get the selected product ID
          material: { name: material }, // Assuming material input is a string
          color: { name: color },       // Assuming color input is a string
          size: {
            size: size,
            alphabetic_size: alphabeticalSize
          },
          quantity: parseInt(quantity), // Convert quantity to number
          price: parseFloat(price),     // Convert price to number
        }));
  
        // Optionally, you can clear the form fields after submission
        // setIsPanelOpen(false);
        setAddingNewProduct(false)
        setMaterial('');
        setColor('');
        setSize('');
        setAlphabeticalSize('')
        setQuantity('');
        setPrice('');
      } catch (error) {
        setAddingNewProduct(false);
        alert('An error occured. Try again.')
      }
      
    }
  };
  // adding the product pro end

  const handleCompleteSale = (value: string) => {
    // Check if the current value is 'complete', if so, reset it, otherwise set to 'complete'
    setSelectedCompleteSale(value);
  };



  const filteredProducts = all_products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className='mx-2 max-h-[550px] overflow-y-auto'>
          {/* Cards Section */}
          <div className=" flex items-center w-1/2 relative  mt-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search product..."
              className="border bg-white rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-purple-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div onClick={handleOpenAddProduct} className=' border rounded-lg px-2 bg-white cursor-pointer py-2 ms-5 flex items-center gap-2 text-orange-600'>
              <PlusCircleIcon className='h-5 w-5' />
              <p className='  font-semibold whitespace-nowrap'>add Product</p>
            </div>


          </div>
          {showSuccessMessage && (
            <div className='  mt-2 flex justify-center'>
              <Alert className='absolute text-center' severity="success">{successMessage}</Alert>
            </div>
          )}



          {/* Table Section */}
          <div className='bg-white mt-6 shadow-lg rounded-lg overflow-x-auto'>
            <table className='min-w-full text-left text-gray-900 border-collapse divide-y divide-gray-200'>
              <thead className="text-sm font-semibold ">
                <tr className="text-gray-600 text-center">
                  <th className="px-3 py-4">Product</th>
                  <th className="px-3 py-4">Material</th>
                  <th className="px-3 py-4">Color</th>
                  <th className="px-3 py-4">Size</th>
                  <th className="px-3 py-4">Price</th>
                  <th className="px-3 py-4">Quantity</th>
                  <th className="px-3 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  Array.isArray(product.prod) && product.prod.length > 0 ? (
                    product.prod.map((variation, index) => (
                      <tr key={`${product.name}-${index}`} className="hover:bg-gray-100 text-center">
                        {index === 0 && (
                          <td className="px-3 py-4 font-medium align-top" rowSpan={product.prod.length}>
                            <div className='flex flex-col items-center'>
                              {product.name}
                              <div className='flex space-x-3'>
                                <button
                                  onClick={() => handleProductClick(product)}
                                  className="bg-green-800 px-2 py-0.5 mt-5 rounded-md text-white font-semibold whitespace-nowrap"
                                >
                                  Add Product
                                </button>
                                <button
                                  onClick={() => handleClickOpenUpdateProduct(product)}
                                  className="bg-blue-800 px-2 py-0.5 mt-5 rounded-md text-white font-semibold"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => handleClickOpenDelete(product)}
                                  className="bg-red-400 px-2 py-0.5 mt-5 rounded-md text-white font-semibold"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        )}
                        {/* Ensure that you're rendering string or number values, not objects */}
                        <td className="px-3 py-4 ">{variation.material.name}</td> {/* Accessing material.name */}
                        <td className="px-3 py-4 ">{variation.color.name}</td>    {/* Accessing color.name */}
                        <td className="px-3 py-4">
                          {/* Check if both size and alphabetic_size are present */}
                          {variation.size.size && variation.size.alphabetic_size
                            ? `${variation.size.size} / ${variation.size.alphabetic_size}`
                            : variation.size.size || variation.size.alphabetic_size || "N/A"}
                        </td>
                        {/* Accessing size.size */}
                        <td className="px-3 py-4 whitespace-nowrap ">
                          {CurrencyFormatter({ amount: variation.price, currencySymbol: 'Ksh', asString: true }) || ''}
                        </td>
                        <td className="px-3 py-4 ">{variation.quantity}</td>
                        <td className="px-3 py-4 ">
                          <div className="flex space-x-3 text-blue-600">
                            <button
                              onClick={() => handleProductClickCart(product, variation)}
                              className="bg-blue-400 px-2 py-0.5 rounded-md text-white font-semibold flex items-center gap-2"
                            >
                              Cart
                            </button>
                            <buttone
                              onClick={() => handleClickOpenRecievedProdcut(product, variation)}
                              className="bg-pink-400 px-2 py-0.5 rounded-md text-white font-semibold flex items-center gap-2"
                            >
                              Recieve
                            </buttone>
                            <button
                              onClick={() => handleProductClickEdit(product, variation)}
                              className="bg-green-500 px-2 py-0.5 rounded-md text-white font-semibold flex items-center gap-2"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleOpenDeletProductProd(variation)}
                              className="bg-red-400 px-2 py-0.5 rounded-md text-white font-semibold flex items-center gap-2"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={product.name} className="hover:bg-gray-100">
                      <td className="px-3 py-4 font-medium" colSpan="7">
                        <div className='flex flex-col items-center'>
                          {product.name}
                          <div className='flex space-x-3'>
                            <button
                              onClick={() => handleProductClick(product)}
                              className="bg-green-800 px-2 py-0.5 mt-5 rounded-md text-white font-semibold "
                            >
                              Add Product
                            </button>
                            <button
                              onClick={() => handleClickOpenUpdateProduct(product)}
                              className="bg-blue-800 px-2 py-0.5 mt-5 rounded-md text-white font-semibold"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleClickOpenDelete(product)}
                              className="bg-red-400 px-2 py-0.5 mt-5 rounded-md text-white font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>


            </table>

            {/* delete dialogue */}
            <Dialog
              open={openDelete}
              onClose={handleClickCloseDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {`Delete ${deleteProduct?.name} `}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {`Delete ${deleteProduct?.name} permanently from the database `}
                </DialogContentText>
              </DialogContent>
              <DialogActions className=' flex gap-2'>
                {deleteProductStatus === 'loading' ? (
                  <>
                    <button className=' rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5 cursor-not-allowed' >Cancel</button>
                    <button className=' rounded-md bg-red-50 hover:bg-red-300 px-2 py-0.5'>
                      <CircularProgress className='!h-5 !w-5' />
                    </button>
                  </>
                ) : (
                  <>
                    <button className=' rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5' onClick={handleClickCloseDelete}>Cancel</button>
                    <button onClick={handleDeleteProduct} className=' rounded-md bg-red-50 hover:bg-red-300 px-2 py-0.5'>
                      Delete
                    </button>
                  </>
                )
                }

              </DialogActions>
            </Dialog>

            {/* Updating the product dialogue */}

            <Dialog
              open={productUpdateOpen}
              onClose={handleClickCloseUpdateProduct}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {`Update ${updateSelectedProduct?.name} `}
              </DialogTitle>
              <DialogContent>
                <input className=' outline-none border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md' type='text' onChange={handleUpdateInputChange} value={updatedProductName} />
              </DialogContent>
              <DialogActions className=' flex gap-2'>
                {updateProductStatus === 'loading' ? (
                  <>
                    <button className=' rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5 cursor-not-allowed' >Cancel</button>
                    <button className='  rounded-md bg-blue-50 hover:bg-blue-300 px-2 py-0.5'>
                      <CircularProgress className='!w-5 !h-5' />
                    </button>
                  </>
                ) : (
                  <>
                    <button className=' rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5' onClick={handleClickCloseUpdateProduct}>Cancel</button>
                    <button onClick={handleUpdateProduct} className=' rounded-md bg-blue-50 hover:bg-blue-300 px-2 py-0.5'>
                      Update
                    </button>
                  </>
                )}

              </DialogActions>
            </Dialog>


            {/* Updating the product prod dialogue */}

            <Dialog
              open={openRecieveProduct}
              onClose={handleClickCloseRecievedProdcut}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {`Add amount of size ${recieveProductVariation?.size.size}
                 ${recieveProductVariation?.color?.name} ${recieveProductVariation?.material?.name} ${recieveProduct?.name} to add`}
              </DialogTitle>
              <DialogContent className=' '>
                <input
                  className=' w-full outline-none border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md'
                  type='text'
                  value={addnewQuantity}
                  onChange={handleInputQuantityAddChange}
                />
              </DialogContent>
              <DialogActions className=' flex gap-2'>
                <button className=' rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5' onClick={handleClickCloseRecievedProdcut}>Cancel</button>
                <button onClick={handleAddQuantity} className=' rounded-md bg-blue-50 hover:bg-blue-300 px-2 py-0.5'>
                  Update
                </button>
              </DialogActions>
            </Dialog>


            {/* Adding new Product dialogue */}

            <Dialog
              open={openAddProduct}
              onClose={handleOpenAddProduct}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Add a new product"}
              </DialogTitle>
              <DialogContent>
                <input
                  className='w-full outline-none border border-pink-600 px-2 py-0.5 text-sm font-bold rounded-md focus:shadow-md'
                  type='text'
                  required
                  value={newProductName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
                {productExists && (
                  <div className="text-red-500 text-sm">
                    This product already exists!
                  </div>
                )}
              </DialogContent>
              <DialogActions className='flex gap-2'>
                {addingProductStatus === 'loading' ? (
                  <>
                    <button
                      className=' cursor-not-allowed rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5'

                    >
                      Cancel
                    </button>
                    <button
                      // onClick={handleAddProduct}
                      className=' flex items-center rounded-md bg-blue-50 hover:bg-blue-300 px-2 py-0.5'
                    // disabled={productExists}
                    >
                      <CircularProgress color="secondary" className=' !h-5 !w-5' />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className='rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5'
                      onClick={handleOpenAddProduct}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProduct}
                      className='rounded-md bg-blue-50 hover:bg-blue-300 px-2 py-0.5'
                      disabled={productExists}
                    >
                      Add Product
                    </button>
                  </>
                )}

              </DialogActions>
            </Dialog>


            {/* Delete the product prod dialogue */}

            <Dialog
              open={openDeleteProd}
              onClose={handleCloseDeletProductProd}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {`Delete ${deleteProd?.material?.name} `}
              </DialogTitle>
              <DialogContent className=' '>
                <p>Delete {deleteProd?.material?.name} permanently</p>
              </DialogContent>
              <DialogActions className=' flex gap-2'>
                <button className=' rounded-md bg-green-50 hover:bg-green-300 px-2 py-0.5' onClick={handleCloseDeletProductProd}>Cancel</button>
                <button onClick={handleDeleteProductPro} className=' rounded-md bg-blue-50 hover:bg-blue-300 px-2 py-0.5'>
                  Delete
                </button>
              </DialogActions>
            </Dialog>

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

                {selectedProduct && (
                  <>
                    <div>
                      {/* <h2 className="text-xl font-bold my-4">{selectedProduct.product} Details</h2> */}
                      <h2 className="text-xl font-bold my-8"></h2>
                      <hr />

                      <div className='mt-2'>
                        <h4 className=' text-sm font-bold'>Add new product category to <span className=' font-bold text-orange-700'>{selectedProduct.name}</span></h4>

                        <form onSubmit={handleAddProductPro} className=' mt-2'>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Material</label>
                            <input
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'
                              value={material}
                              required
                              onChange={(e) => setMaterial(e.target.value)}
                            />
                          </div>

                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Color</label>
                            <input
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'
                              value={color}
                              required
                              onChange={(e) => setColor(e.target.value)}
                            />
                          </div>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Numerical Size</label>
                            <input
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='number'
                              min={0}
                              value={size}
                              onChange={(e) => setSize(e.target.value)}
                            />
                          </div>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Alphatetical size Size</label>
                            <input
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'
                              value={alphabeticalSize}
                              onChange={(e) => setAlphabeticalSize(e.target.value)}
                            />
                          </div>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Quantity</label>
                            <input
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'
                              required
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            />
                          </div>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Price</label>
                            <input
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'
                              required
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          </div>
                          <div className=' text-center'>
                            {addingNewProduct  ? (
                              <div className=' flex justify-center'>
                                <button className=' bg-yellow-800 text-white px-4 py-1 rounded-lg mt-3 cursor-not-allowed flex justify-center'><CircularProgress className=' !h-5 !w-5 !text-white' /></button>

                              </div>
                            ) : (
                              <>
                                <button className=' bg-yellow-800 text-white px-4 py-1 rounded-lg mt-3'>Add product</button>

                              </>
                            )}
                          </div>

                        </form>
                      </div>
                    </div>



                  </>
                )}




              </div>
            </div>

            {/* Right-Side Panel (Editing) */}
            <div
              className={`fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg z-50 overflow-auto transition-transform duration-300 ease-in-out ${isPanelOpenEdit ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
              <div className="p-6">
                <div className=''>
                  <button onClick={handleClosePanelEdit} className="absolute border rounded-lg right-10 text-gray-500 hover:text-gray-900 focus:outline-none">
                    <XMarkIcon className=' h-5 w-5 text-orange-600' />
                  </button>
                </div>

                {selectedProductEdit && (
                  <>
                    <div>
                      {/* <h2 className="text-xl font-bold my-4">{selectedProduct.product} Details</h2> */}
                      <h2 className="text-xl font-bold my-8"></h2>
                      <hr />

                      <div className='mt-2'>
                        <h4 className=' text-sm font-bold'>Edit <span className=' font-bold text-orange-700'>{selectedProductEdit.name}</span> category</h4>

                        <form onSubmit={handleUpdateProductPro} className=' mt-2'>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Material</label>
                            <input
                              value={editMaterial}
                              onChange={(e) => setEditMaterial(e.target.value)}
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text' />
                          </div>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Color </label>
                            <input
                              value={editColor}
                              onChange={(e) => setEditColor(e.target.value)}
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'
                            />
                          </div>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Size</label>
                            <input
                              value={editSize}
                              onChange={(e) => setEditSize(e.target.value)}
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'
                            />
                          </div>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Alphabetical Size</label>
                            <input
                              value={editAlphabeticalSize}
                              onChange={(e) => setEditAlphabeticalSize(e.target.value)}
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'
                            />
                          </div>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Quantity</label>
                            <input
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(e.target.value)}
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'
                            />
                          </div>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Price</label>
                            <input
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'

                            />
                          </div>
                          <div className=' text-center'>
                            {isEditingProduct ? (
                              <button className=' bg-yellow-800 text-white px-4 py-1 rounded-lg mt-3 lowercase'><CircularProgress className='!h-3 !w-3' /></button>
                            ) : (
                              <button className=' bg-yellow-800 text-white px-4 py-1 rounded-lg mt-3 lowercase'>Update product</button>
                            )}

                          </div>

                        </form>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right-Side Panel (Adding to cart) */}
            <div
              className={`fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg z-50 overflow-auto transition-transform duration-300 ease-in-out ${isPanelOpenCart ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
              <div className="p-6">
                <div className=''>
                  <button onClick={handleClosePanelCart} className="absolute border rounded-lg right-10 text-gray-500 hover:text-gray-900 focus:outline-none">
                    <XMarkIcon className=' h-5 w-5 text-orange-600' />
                  </button>
                </div>

                {selectedProductCart && (
                  <>
                    <div>
                      {/* <h2 className="text-xl font-bold my-4">{selectedProduct.product} Details</h2> */}
                      <h2 className="text-xl font-bold my-8"></h2>
                      <hr />
                      <div className='mt-2'>
                        <h4 className=' text-sm font-bold'>Add size <span className=' font-bold text-orange-700'>
                          {selectedVariationCart?.size.size} {selectedVariationCart?.color.name} {selectedVariationCart?.material.name} {selectedProductCart?.name}
                        </span> to order</h4>

                        <form onSubmit={handleCreateOrder} className=' mt-2'>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Customer Name</label>
                            <input
                              required
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                            />
                          </div>
                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Phone Number</label>
                            <input
                              required
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='text'
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                          </div>
                          <p className=' font-bold text-sm'>Delivery:</p>
                          {/* delivery option */}
                          <div className='flex justify-between my-2'>
                            {/* Fully Paid */}
                            <div
                              onClick={() => handleDeliverySelection('owner')}
                              className={`flex items-center gap-2 border px-2 py-1 cursor-pointer ${selectDelivery === 'owner' ? 'border-green-400' : 'border-gray-300'
                                }`}
                            >
                              <p>Same as above</p>
                              <input
                                type='radio'
                                checked={selectDelivery === 'owner'}
                                onChange={() => handleDeliverySelection('owner')}
                              />
                            </div>
                            {/* Partial Payment */}

                            <div
                              onClick={() => handleDeliverySelection('others')}
                              className={`flex items-center gap-2 border px-2 py-1 cursor-pointer ${selectDelivery === 'others' ? 'border-green-400' : 'border-gray-300'
                                }`}
                            >
                              <p>Another</p>
                              <input
                                type='radio'
                                checked={selectDelivery === 'others'}
                                onChange={() => handleDeliverySelection('others')}
                              />
                            </div>
                          </div>
                          {selectDelivery === 'others' && (
                            <div>
                              <div className=' flex flex-col mb-2'>
                                <label className=' font-light text-sm'>Deliver to</label>
                                <input
                                  className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                                  type='text'
                                  value={deliveryTo}
                                  onChange={(e) => setDeliveryTo(e.target.value)}
                                />
                              </div>
                              <div className=' flex flex-col mb-2'>
                                <label className=' font-light text-sm'>Delivery Phone Number</label>
                                <input
                                  className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                                  type='text'
                                  value={deliveryPhoneNumber}
                                  onChange={(e) => setDeliveryPhoneNumber(e.target.value)}
                                />
                              </div>
                            </div>

                          )}
                          {/* delivery option */}

                          <div className=' flex flex-col mb-2'>
                            <label className=' font-light text-sm'>Quantity</label>
                            <input
                              required
                              value={quantity}
                              onChange={handleQuantityChange}
                              min='0'
                              placeholder='Enter quantity'
                              className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                              type='number'
                            />
                          </div>
                          <div className='flex justify-between my-2'>
                            {/* Fully Paid */}
                            <div
                              onClick={() => handleSelection('fullyPaid')}
                              className={`flex items-center gap-2 border px-2 py-1 cursor-pointer ${selectedPayment === 'fullyPaid' ? 'border-green-400' : 'border-gray-300'
                                }`}
                            >
                              <p>Fully paid</p>
                              <input
                                type='radio'
                                checked={selectedPayment === 'fullyPaid'}
                                onChange={() => handleSelection('fullyPaid')}
                              />
                            </div>
                            {/* Partial Payment */}
                            <div
                              onClick={() => handleSelection('partialPayment')}
                              className={`flex items-center gap-2 border px-2 py-1 cursor-pointer ${selectedPayment === 'partialPayment' ? 'border-green-400' : 'border-gray-300'
                                }`}
                            >
                              <p>Partial Payment</p>
                              <input
                                type='radio'
                                checked={selectedPayment === 'partialPayment'}
                                onChange={() => handleSelection('partialPayment')}
                              />
                            </div>
                          </div>


                          {selectedPayment === 'partialPayment' && (
                            <div>
                              <div className='flex flex-col mb-2'>
                                <label className='font-light text-sm'>Deposit</label>
                                <input
                                  value={deposit}
                                  onChange={handleDepositChange}
                                  className='outline-none border border-gray-300 rounded-md px-2 py-1 font-semibold text-sm focus:border-pink-400 shadow'
                                  type='number' // Use number input to accept numeric values
                                  min='0'
                                  placeholder='Enter deposit amount'
                                />
                              </div>
                              <p className='font-light text-sm'>Balance: {balance >= 0 ? balance : 0}</p> {/* Ensure balance isn't negative */}
                            </div>
                          )}
                          <label
                          onClick={() => {
                            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
                            setDeliveryDate(today); // Set the delivery date to today
                            handleCompleteSale(selectedCompleteSale === 'complete' ? '' : 'complete');
                          }}
                            // onClick={() => handleCompleteSale(selectedCompleteSale === 'complete' ? '' : 'complete')}
                            className={`flex items-center gap-2 border px-2 py-1 cursor-pointer ${selectedCompleteSale === 'complete' ? 'border-green-400' : 'border-gray-300'
                              }`}
                          >
                            <p>Complete Sale</p>
                            <input
                              type='checkbox'
                              checked={selectedCompleteSale === 'complete'}
                              onChange={() => handleCompleteSale(selectedCompleteSale === 'complete' ? '' : 'complete')}
                            />
                          </label>

                          <div className='border border-green-400 flex items-center gap-2 px-2 mt-2'>
                            <p className=' text-sm'>To be delivered on:</p>
                            <input
                              required
                              className=' text-sm'
                              type='date'
                              value={deliveryDate}
                              onChange={handleDeliveryDateChange}
                            />
                          </div>


                          <div className=' text-center'>
                            <button className=' bg-yellow-800 text-white px-4 py-1 rounded-lg mt-3 lowercase'>Create order</button>
                          </div>


                        </form>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;