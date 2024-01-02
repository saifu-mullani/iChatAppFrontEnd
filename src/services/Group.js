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
    },
    createGroup : async (obj)=>{
        try {
            let result = await axios.post("http://localhost:8001/groups/createGroup",obj)
            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    },
    validateGroupName : async (filter = {})=>{
        try {
            let result = await axios.post("http://localhost:8001/groups/validateGroupName",filter)
            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    }

}

