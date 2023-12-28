import axios from "axios"

export const GroupService = {

    fetchGroups : async ()=>{
        try {
            let result = await axios.get("http://localhost:8001/groups")
            console.log(result)
            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    }

}

