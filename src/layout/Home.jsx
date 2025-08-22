import React, { useContext, useEffect } from 'react'
import Videocard from '../Components/Videocard'
import { useData } from '../context/DataContext'
import ModeContext from '../context/ModeContext'

function Home() {
    const {data,loading}=useData()
    const {mode}=useContext(ModeContext)
    console.log(data);

    useEffect(()=>{
        setTimeout(()=>{

        },3000)
    },[loading])
  return (
    <div className='transition-all duration-300'>
        {!loading ? (
            <div  
            className={`grid pl-10 pt-[4.2rem] lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-x-2 gap-y-7   ${mode ? "bg-black": "bg-white"}`}>
        {
            data.filter((item)=>item.type=="video").map((item,ind)=>{
                return(                
                    <Videocard key={ind} video={item.video}/>
                )
            })
        }
    </div>
        ):(
            <div className='h-screen flex justify-center items-center'>
                <h1 className='text-2xl font-semibold text-green-700'>Loading videos</h1>
            </div>
        )}
    </div>
  )
}

export default Home