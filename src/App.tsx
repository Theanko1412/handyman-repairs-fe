import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"

import Home from './components/Home'
import Category from './components/Category'
import Handyman from './components/Handyman'
import Service from './components/Service';
import CategoryService from './components/CategoryService';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Account from './components/Account';
import HandymanView from './components/HandymanView';

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/category" element={<Category />} />
              <Route path="/category/:categoryId" element={<CategoryService />} />
              <Route path="/handyman" element={<Handyman />} />
              <Route path="/handyman/:handymanId" element={<HandymanView />} />
              <Route path="/service" element={<Service />} />
              <Route path="/account" element={<Account />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      </ThemeProvider>
  );
}

export default App
