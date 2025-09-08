import axios from "axios";

// const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY; //import.meta.env for frontend
const BASE_URL = 'https://yt-api.p.rapidapi.com'


const options = {
	headers: {
		'x-rapidapi-key': 'ceed0aaf89msh7e49be7749279c0p1fb4d7jsn15ce62530237',
		'x-rapidapi-host': 'yt-api.p.rapidapi.com'
	}
};

// console.log("Headers:", options);

export const FetchData=async(url)=>{
    try{
        // url=protocol + hostname + path
        let {data}=await axios.get(`${BASE_URL}/${url}`,options)//destructuring limits size 
        // console.log("Final URL:", `${BASE_URL}/${url}`);
        return data
    }catch(err){
        console.log("Error fetching api data",err);
        throw err
    }
}