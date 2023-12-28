import axios from "axios"

export const UserService = {

    activeUsers : async (username,password)=>{
        try {
            let result = await axios.get("http://localhost:8001/activeUsers")
            return result.data
            
        } catch (error) {
            console.log("error.response.data",error.response.data)
            return error.response.data
        }
    },

    login : async (username,password)=>{
        try {
            console.log(`${username} Logged In`)
            let result = await axios.post("http://localhost:8001/users/login",  {
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
           
            let result = await axios.post("http://localhost:8001/users/logout",  {
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
            let result = await axios.post("http://localhost:8001/users/register",formData)
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    },

    forgotPassword : async (filter = {})=>{
        try {
            let result = await axios.post("http://localhost:8001/users/forgotPassword",filter)
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    },
    resetPassword : async (filter = {})=>{
        try {
            let result = await axios.post("http://localhost:8001/users/validateOtp",filter)
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    },
    
    fetchUsers : async (query="")=>{
        try {
            let result = await axios.get(`http://localhost:8001/users?${query}`)
            console.log(result)

            return result.data
            
        } catch (error) {
            console.log("Error",error.response.data)
            return error.response.data
        }
    }

}

