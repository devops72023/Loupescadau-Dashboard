import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../App';
import DonutCard from './DonutChart';
import GlobalCountChart from './GlobalCountChart'
import { Card } from '@tremor/react'
import CatChart from './CatChart'
import RevenueChart from './RevenueChart';

export default function Dashboard(props){
    const { setPageName, setActiveItem, navState } = useContext(AppContext);
    
    useEffect(()=>{
        setPageName("Dashboard")
        setActiveItem("dashboard");
    })
    return (
        <div className={`app-container${navState ? ' app-shrink' : ''}`}>
            <div className="w-full h-auto flex flex-col gap-8 @container/dashboard">
                <div className="w-full flex gap-8 px-2 flex-col @[1130px]/dashboard:flex-row">
                    <RevenueChart />
                    <GlobalCountChart />
                </div>   
                <div className="w-full flex gap-8 px-2 flex-col @[1130px]/dashboard:flex-row">
                    <DonutCard />
                    <CatChart />
                </div> 
            </div>
        </div>
    )
}