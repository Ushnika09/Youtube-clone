import React, { createContext, useContext, useEffect, useState } from 'react'
import { FetchData } from '../../utils/Rapidapi'

export const DataContext=createContext()//

export default function DataProvider({children}){
    const [loading,setLoading]=useState(true)
    const [data,setData]=useState([])
    const [val,setVal]=useState("New")

    useEffect(()=>{
        FetchAllData(val)
    },[val])

    const FetchAllData=(query)=>{
        FetchData(`search/?q=${query}`).then((res)=>{
            setData(res)
            setLoading(false)
        })
    }

    return(
        <DataContext.Provider value={{loading,data,val,setVal}}>
            {children}
        </DataContext.Provider>
    )
}


export const useData=()=>useContext(DataContext)
