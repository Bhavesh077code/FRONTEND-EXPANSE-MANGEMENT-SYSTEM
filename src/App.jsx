
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import Register from './pages/Register';
import OtpVerify from './pages/OtpVerify';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import ProtectedRouter from "./Router/protectedRouter";
import Dashboard from './pages/Dashboard';
import Header from './pages/Header';


const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/register", element: <Register /> },
  { path: "/verify", element: <OtpVerify /> },
   { path: "/hello", element: <ProtectedRouter><Header /></ProtectedRouter> },

  {
    path: "/add-expense", element:
      <ProtectedRouter>
        <AddExpense />
      </ProtectedRouter>
  },
  { path: "/edit/:id", element: <ProtectedRouter><EditExpense /></ProtectedRouter> },
  {
    path: "/dashboard", element:
      <ProtectedRouter>
        <Dashboard />
      </ProtectedRouter>
  },




]);

const App = () => {
  return <RouterProvider router={router} />
}

export default App