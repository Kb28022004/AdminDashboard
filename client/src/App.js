// import { Button } from 'react-bootstrap';
import SignIn from "./components/SignIn";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Student from "./pages/Student";
import Payment from "./pages/Payment";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Reports from "./pages/Reports";
import Setting from "./pages/Setting";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./components/auth/ResetPassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOtp from "./components/auth/VerifyOtp";
import UpdatePassword from "./components/auth/UpdatePassword";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route element={<Dashboard />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Home />} />

            <Route path="/home" element={<Home />} />
            <Route path="/course" element={<Courses />} />
            <Route path="/students" element={<Student />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/report" element={<Reports />} />
            <Route path="/settings" element={<Setting />} />
          </Route>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/otp/verify" element={<VerifyOtp />} />
          <Route path="/password/update" element={<UpdatePassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
