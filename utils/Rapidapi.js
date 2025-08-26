import axios from "axios";

// const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY; //import.meta.env for frontend
// const BASE_URL = "https://youtube138.p.rapidapi.com"
const BASE_URL = 'https://yt-api.p.rapidapi.com'


// const options = {
// 	headers: {
// 		'x-rapidapi-key': '5c18c0bfcemsh2e953c409c706f9p1cf8f4jsnc31670464c2d',
// 		'x-rapidapi-host': 'youtube-data8.p.rapidapi.com'
// 	}
// };

const options = {
	headers: {
		'x-rapidapi-key': 'f3abe7b876msh86f1b012baee54bp120947jsne50477e775b8',
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