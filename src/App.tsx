import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useEffect } from 'react';
import './App.css';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch } from './app/hooks';
import { setUser } from './features/authSlice';
import PrivateRoute from './components/privateRoute';

function App() {
  const dispatch = useAppDispatch()
  const user = JSON.parse(localStorage.getItem("User") || "{}")
  useEffect(() => {
    dispatch(setUser(user))
  }, [])
  
  return (
    <div className="App">
      <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace/>} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
