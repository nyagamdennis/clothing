import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import Roles from "./pages/Roles";
import Expenses from "./pages/Expenses";
import Employees from "./pages/Employees";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchCart } from "./features/orders/cartSlice";
import Task from "./pages/Task";
import EmployeeDetails from "./pages/EmployeeDetails";
import SocialMedia from "./pages/SocialMedia";
import OnlineStore from "./pages/OnlineStore";
import Customers from "./pages/Customers";



const App = () => {

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])


  return (
    <div className=" h-screen">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="stock/*" element={<Stock />} />
        <Route path="orders/*" element={<Orders />} />
        <Route path="analytics/*" element={<Analytics />} />
        <Route path="roles/*" element={<Roles />} />
        <Route path="expenses/*" element={<Expenses />} />
        <Route path="employees/*" element={<Employees />} />
        <Route path="social/*" element={<SocialMedia />} />
        <Route path="task/:id" element={<Task />} />
        <Route path="employee/:employeeId/" element={<EmployeeDetails />} />
        <Route path="store/" element={<OnlineStore />} />
        <Route path="customers/" element={<Customers />} />
        
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
