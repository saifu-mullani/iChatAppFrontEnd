import React, { useEffect, useState,useRef } from 'react'
import io from "socket.io-client"
import "./ChatApp.css"
import { useId } from '../../other/IdContext';
import {useNavigate,useLocation} from "react-router-dom";





let socket ;

export default function ChatApp() {
 
    const navigate  = useNavigate()
    const [messages,setMessages] = useState([])
    const [input,setInput] = useState("")
    const [userName,setUserName] = useState("")
    const [receiver,setReceiver] = useState("")
    const [idCounter, setIdCounter] = useState(6);
    const messagesEndRef = useRef(null);
    const { receiverId,  senderId } = useId();
    const location = useLocation();
    const {state} = location 
  

      useEffect(()=>{
        socket = io('http://localhost:8001');
        let a = receiverId
        let b =  senderId  
        setReceiver(a)
        setUserName( b)
        socket.emit('userJoined', {receiver: a ,  sender:b ,  type : state.type})
        return () => {
          // Clean up the socket connection when the component is unmounted
          socket.disconnect();
        };
      },[])

      useEffect(()=>{
        
        console.log("userId,receiverId,state",senderId, receiverId,state)

        socket.on("privateMessage",(message)=>{
          console.log("privateMessage",message)
          console.log("messages",messages)
          setMessages([...messages,{id:idCounter ,  ...message}])
          setIdCounter(i => i+1)
         
        })

        socket.on("userLeft",(data)=>{    
            console.log("userLeft")   
            setMessages([...messages,{id:idCounter ,...data}])
            setIdCounter(i => i+1)

        })
        
        socket.on("userJoined",(data)=>{   
            console.log("userJoined")
            setMessages([...messages,{id:idCounter ,...data}])
            setIdCounter(i => i+1)
    
        })
        
        scrollToBottom();
    },[messages])


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = ()=>{

        if(input.trim()){
            socket.emit('privateMessage', {to: receiver , message: input , type : state.type})
            setInput("")
            setMessages([...messages,{id:idCounter ,from:"Myself", message:input}])
        }
    }

    const handleKeyPress = (event) => {
      console.log("handleKeyPress",event)
        if (event.key === 'Enter') {
          // Handle sending the message here
          sendMessage();
        }
      };
    const renderMessages = () => {
        return messages.map((message) => {

            if(message.from === "system"){
                return (<div
                    key={idCounter}
                    className={`message ${message.from}`}
                  > 
                    {message.message}
                  </div>)
            }
            else{
                return (<div
                    key={idCounter}
                    className={`message ${message.from === 'Myself' ? 'Myself' : 'Other'}`}
                  > 

                    <div className='from'>from : {message.from}</div>
                    {message.message}
                  </div>)
            }
         
            });
      };

  return (
    <>
        <div>ChatApp {receiver}</div>
       
        <div>
    
            <div className="chat-box">
                 <div className="chat-container">{renderMessages()}</div>
                 <div ref={messagesEndRef} />
                {/* Add an input field and send button here for user input */}
               
            </div>
            <div  className="message-box">
                <div className="message-container">
                    <input type="text" className='message-container' value={input} onChange={(e)=> setInput(e.target.value)} onKeyDown={(e)=>{handleKeyPress(e)}} />
                </div>
                <button onClick={()=>{sendMessage()}}>Send</button>
            </div>
           

        </div>
    </>
  )
}
