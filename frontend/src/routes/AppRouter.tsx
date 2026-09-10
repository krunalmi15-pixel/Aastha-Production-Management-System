import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "@/components/layout/Layout";

import Dashboard from "@/pages/Dashboard";
import Lots from "@/pages/Lots";
import ItemMaster from "@/pages/ItemMaster";
import EmployeeMaster from "@/pages/EmployeeMaster";
import Machines from "@/pages/Machines";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {

  return (

    <Routes>


      {/* PUBLIC ROUTE */}

      <Route
        path="/login"
        element={<Login />}
      />



      {/* PROTECTED ROUTES */}

      <Route

        element={

          <ProtectedRoute>

            <Layout />

          </ProtectedRoute>

        }

      >


        <Route

          path="/"

          element={

            <Navigate

              to="/dashboard"

              replace

            />

          }

        />



        <Route

          path="/dashboard"

          element={<Dashboard />}

        />



        <Route

          path="/lots"

          element={<Lots />}

        />



        <Route

          path="/items"

          element={<ItemMaster />}

        />



        <Route

          path="/employees"

          element={<EmployeeMaster />}

        />



        <Route

          path="/machines"

          element={<Machines />}

        />



        <Route

          path="/reports"

          element={<Reports />}

        />



        <Route

          path="/settings"

          element={<Settings />}

        />


      </Route>


    </Routes>

  );

}


export default AppRoutes;