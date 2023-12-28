import axios from "axios"
import domain_name from "../common/utility"

export const UserService = {

    activeUsers : async (username,password)=>{
        try {
        
            let result = await axios.get(domain_name+"/activeUsers")
            return result.data
            
        } catch (error) {
            console.log("error.response.data",error.response.data)
            return error.response.data
        }
    },

    login : async (username,password)=>{
        try {
            console.log(`${username} Logged In`)
            let result = await axios.post(domain_name+"/users/login",  {
                "user_id":username,
                "password":password
               
              })
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("error.response.data",error.response.data)
            return error.response.data
        }
    },
    logout : async (user_id)=>{
        try {
           
            let result = await axios.post(domain_name+"/users/logout",  {
                "user_id":user_id, 
              })
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("error.response.data",error.response.data)
            return error.response.data
        }
    },
    registerUser : async (formData)=>{
        try {
            let result = await axios.post(domain_name+"/users/register",formData)
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    },

    forgotPassword : async (filter = {})=>{
        try {
            let result = await axios.post(domain_name+"/users/forgotPassword",filter)
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    },
    resetPassword : async (filter = {})=>{
        try {
            let result = await axios.post(domain_name+"/users/validateOtp",filter)
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    },
    
    fetchUsers : async (query="")=>{
        try {
            let result = await axios.get(`${domain_name}/users?${query}`)
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    }

}

