import axios from "axios"
import domain_name from "../common/utility"

export const MessageService = {

    sendMessages : async (messageObj)=>{
        try {
            let result = await axios.post(`${domain_name}/messages/sendMessages`,messageObj)
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    },

    fetchMessages : async (filter={})=>{
        try {
            console.log(filter)
            let result = await axios.post(`${domain_name}/messages/fetchMessages`,filter)
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    },
    fetchOldChatUser : async (filter={})=>{
        try {
            console.log(filter)
            let result = await axios.post(`${domain_name}/messages/fetchOldChatUser`,filter)
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    }

    

}

