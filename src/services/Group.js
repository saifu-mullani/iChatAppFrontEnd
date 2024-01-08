import axios from "axios"
import config from "../common/utility"

export const GroupService = {

    fetchGroups : async ()=>{
        try {
            let result = await axios.get(`${config.domain_name}/groups`)
            console.log(result)
            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    },
    createGroup : async (obj)=>{
        try {
            let result = await axios.post(`${config.domain_name}/groups/createGroup`,obj)
            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    },
    validateGroupName : async (filter = {})=>{
        try {
            let result = await axios.post(`${config.domain_name}/groups/validateGroupName`,filter)
            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    }

}

