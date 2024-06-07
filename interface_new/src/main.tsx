import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {DataProvider} from "./DataProvider.tsx";
import Auth from "./Pages/Auth.tsx";
import Layout from "./Layout.tsx";
import {BalanceList} from "./Pages/BalanceList.tsx";
import PoolsList from "./Pages/PoolsList.tsx";
import Stacking from "./Pages/Stacking.tsx";
import {path} from "./path.ts";
import Router from "./Pages/Router.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <DataProvider>
                <Routes>
                    <Route path={path.auth} Component={Auth}/>
                    <Route path={path.app} element={<Layout><App/></Layout>}/>
                    <Route path={path.poolsList} element={<Layout><PoolsList/></Layout>}/>
                    <Route path={path.balanceList} element={<Layout><BalanceList/></Layout>}/>
                    <Route path="*" element={<Layout><Auth/></Layout>}/>
                    <Route path={path.stacking} element={<Layout><Stacking/></Layout>}/>
                    <Route path={path.auth} Component={Auth}/>
                    <Route path={path.rooter} element={<Layout><Router/></Layout>}/>
                </Routes>
            </DataProvider>

        </BrowserRouter>
    </React.StrictMode>,
)
