// in src/components/AdminApp.jsx
"use client"; // only needed if you choose App Router
import {
  Admin,
  Resource,
} from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import NodeList from "./NodeList/NodeList";
import NodeCreate from "./NodeCreate";
import { theme } from "./theme";
import { Auth0Client } from '@auth0/auth0-spa-js';
import { Auth0AuthProvider } from "ra-auth-auth0";
// import { Auth0AuthProvider } from "./Auth0AuthProvider";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { logger } from "../api/node/logger";
import { useEffect, useState } from "react";
import Login from "./Login";
import { useRouter } from "next/navigation";
import axios from "axios";

const auth0 = new Auth0Client({
  domain: "dev-fhno5ut8s4ytjvlb.jp.auth0.com",
  clientId: "TuUwXQtuslv3DUKgLbEGqfQ4q8JW7bhc",
  cacheLocation: 'localstorage',
})


const auth0AuthProvider = Auth0AuthProvider(auth0, {
  loginRedirectUri: `${window.location.origin}/admin/auth-callback`,
});

const AdminApp = () => {
  const dataProvider = simpleRestProvider(`${window.location.origin}/api`);

  return (
    <BrowserRouter>
      <Routes>

      <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/*" index element={
          <Admin
            dataProvider={dataProvider}
            basename="/admin"
            // requireAuth
            theme={theme}
            >
            <Resource
              name="node"
              list={NodeList}
              create={NodeCreate}
              recordRepresentation="name"
            />
          </Admin>
        } />
        
      </Routes>

    </BrowserRouter>
  )
}

export default AdminApp;
