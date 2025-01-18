import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ForgotPassword, Home, Login, SignUp } from "./pages/components";
import { AuthProvider, useAuth } from "./context/authContext/Auth";
import { Navigate, Outlet } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col h-[100dvh]">
          <div className="flex-1">
            <Routes>
              <Route element={<LoggedInUserCannotGoRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/sign-up" element={<SignUp />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
              </Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

const ProtectedRoute = () => {
  const { userLoggedIn } = useAuth();

  // Redirect to login if the user is not logged in
  return userLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

const LoggedInUserCannotGoRoute = () => {
  const { userLoggedIn } = useAuth();

  // Redirect to home if the user is not logged in
  return !userLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default App;
