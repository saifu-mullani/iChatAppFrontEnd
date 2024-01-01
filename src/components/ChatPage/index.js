import React,{useEffect, useState} from 'react'
import "./ChatPage.css"

import io from "socket.io-client"
import {UserService}  from '../../services/User'
import { useId } from '../../other/IdContext';
import {useNavigate,useLocation} from 'react-router-dom';
import { MessageService } from '../../services/Messages';
import Toaster from '../../common/components/toaster';
import NotificationSound from '../../common/components/toaster/NotificationSound';
import StickerPicker from '../Stickers';
import PopupDialog from "../../common/popup/PopupDialog"
import PopupDialog2 from "../../common/popup2/PopupDialog2"
import EmojiPicker from '../EmojiPicker/index';
import domain_name from "../../common/utility"
const moment = require("moment")



let socket ;
export default function ChatPage() {
    const [messages,setMessages] = useState([])
    const [chatMembers,setChatMembers] = useState([{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"},{name:"A",avatar:"avatar"}])
    const [messageInput,setMessageInput] = useState("")
    const [selectedUser, setSelectedUser] = useState({});
    const { receiverId, updateReceiverId, senderId, updateSenderId ,logout} = useId();
    const [idCounter, setIdCounter] = useState(0);
    const navigate = useNavigate();
    const [toasts, setToasts] = useState([]);
    const [openEmojiBox, setOpenEmojiBox] = useState(false);
    const [showStickerPicker, setShowStickerPicker] = useState(false);
    const [togglePopup, setTogglePopup] = useState(false);
    const handleStickerSelect = (sticker) => {
      // setMessage((prevMessage) => prevMessage + ` ${sticker}`);
    };
    const [selectedEmoji, setSelectedEmoji] = useState(null);

    const handleEmojiSelect = (emoji) => {
      console.log("emoji,messageInput",emoji,messageInput)
      setMessageInput(messageInput + " " +emoji)
      // setSelectedEmoji(emoji);
    };

    const showToast = (message) => {
      setToasts([{ message }, ...toasts]);
     
    };

    const playNotificationSound = () => {
      console.log("playNotificationSound")
      const audioElement = document.getElementById('notificationSound');
      if (audioElement) {
        audioElement.play();
      }
    };

    const clearToasts = ()=>{
      console.log("clearToasts")
      setToasts([]);

    }

    useEffect(()=>{
      socket = io(domain_name);
      let a = receiverId
      let b =  senderId  
      // setReceiver(a)
      // setUserName( b)
      console.log(a,b)
      socket.emit('userJoined', {receiver: a ,  sender:b ,  type : "Private"})
      return () => {
        // Clean up the socket connection when the component is unmounted
        socket.disconnect();
      };
    },[])

    useEffect(()=>{
        
     

      socket.on("privateMessage",(message)=>{
        console.log("message",message)
        setMessages([{id:idCounter ,  ...message},...messages,])  
        setIdCounter(i => i+1)
        playNotificationSound()
        showToast(`${message.sender} : ${message.message.length > 10 ? message.message.substring(0,10)+"..." : message.message}`)
      })

      socket.on("userLeft",(data)=>{    
          setMessages([...messages,{id:idCounter ,...data}])
          setIdCounter(i => i+1)

      })
      
      socket.on("userJoined",(data)=>{   
          setMessages([...messages,{id:idCounter ,...data}])
          setIdCounter(i => i+1)
      })
      

  },[messages])

    const fetchUsers = async()=>{
        // let fetchUserResp = await UserService.fetchUsers()
        let fetchUserResp2 = await MessageService.fetchOldChatUser({user_id:senderId})
        console.log("fetchUserResp2",fetchUserResp2)
        // if(fetchUserResp.status === "success"){
        
        //   let usersList = fetchUserResp.result.length && fetchUserResp.result.filter((curr)=>{
        //     return curr.user_id !== senderId
        //    }).map((curr)=>{ return {name:curr.user_id,avatar:"avatar"}})
        //    setChatMembers(usersList)
        // }
        if(fetchUserResp2.status === "success"){
          let usersList = fetchUserResp2.result.length && fetchUserResp2.result.map((curr)=>{
            return {name:curr,avatar:"avatar"}
          })
          usersList = usersList.length ? usersList : []
          setChatMembers(usersList)

        }
        
      }

      const setChatMememberList = (newMembers = [])=>{
        setChatMembers([...chatMembers,...newMembers])
      }

      const handleUserSelect = async(user_id) => {
        console.log("handleUserSelect")
        let user = {}  ; 
        let active_status = "false"
        let fetchUserResp = await UserService.activeUsers();
       
        console.log("fetchUserResp,fetchUsersResp2",fetchUserResp,user_id)
        if(fetchUserResp.status === "success"){
          active_status = fetchUserResp.result ? fetchUserResp.result[user_id] ? true : false : false
          user["user_id"] = user_id
          user["active_status"] = active_status
          if(!active_status){
            let fetchUsersResp2 = await UserService.fetchUsers(`user_id=${user_id}`)
            user = fetchUsersResp2.result ? fetchUsersResp2.result.length ? fetchUsersResp2.result[0] : {} : {}
            console.log(user)
          }
          
        }
        setSelectedUser(user);

      };

      const handleFetchMessages = async ()=>{
        console.log("selectedUser",selectedUser)
        let fetchMessagesResp =await MessageService.fetchMessages({sender: senderId,receiver : selectedUser.user_id})
      
        if(fetchMessagesResp.status === "success" && fetchMessagesResp.result.length ){
          setMessages([...fetchMessagesResp.result[0].messages])
        }
        else  if(fetchMessagesResp.status === "success" && fetchMessagesResp.result.length  === 0 ){   
          setMessages([])
        }
      }

    useEffect(()=>{
      handleFetchMessages()
    },[selectedUser])
    const renderMessages = () => {
        return messages.map((message) => {
          console.log("message",message)
            if(message.sender === "system"){
                return (<div
                    key={"1"}
                    className={`message ${message.sender}`}
                  > 
                    {message.message}
                    <div>{message.timestamp}</div>
                  </div>)
            }
            else{
                return (<div
                    key={"2"}
                    className={`message ${message.sender === senderId ? 'Myself' : 'Other'}`}
                  > 
                    {message.message}
                    <div  className="italic">{calculateTime(message.timestamp)}</div>
                  </div>)
            }
         
            });
      };

      const logOutUser = async()=>{
        console.log("LogOut");
          logout()
          setTimeout(() => {
            navigate('/login');
          }, 1000);
      }
    
      const renderChatMembers = () => {
        return chatMembers.map((member) => {
                return (<div
                    key={"1"}
                    className={`chat-member-box`}
                    onClick={() => handleUserSelect(member.name)}
                    title={member.name}
                  > 
                    <div class="avatar">
                        <img src={`https://robohash.org/${member.name ||"avatar"}.png`} alt="User Avatar"/>
                    </div>
                    {member.name}
                  </div>)
      
          
        });
      };

      const calculateTime =(time, type = "last_login")=>{
        let currentTime = moment();
        let lastSeenTime = moment(time)   //.subtract(5, 'minutes');
        let timeDiff = currentTime.diff(lastSeenTime, 'minutes');
        console.log("timeDiff",timeDiff)
        if(timeDiff === 0){
          return `now`
        }
        if(timeDiff <=59){
          return `${timeDiff} minutes ago`
        }
        else if((59 < timeDiff ) && (timeDiff<= 119)){
          return `1 hour ago`
        }
        else if(moment(time).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY")){
          return `${moment(time).format("HH:MM")}`
        }
        else{
          return `${moment(time).format("DD-MMM-YYYY HH:MM")}`
        }

        
      }

      const toggleEmojiBox = ()=>{
        setOpenEmojiBox(!openEmojiBox)
      }

      const sendMessage=()=>{

        if(messageInput.trim()){
          console.log("a")
          setMessages([{sender:senderId,message:messageInput,timestamp : new Date()},...messages])
          console.log("b")
          socket.emit('privateMessage', {sender : senderId, receiver: selectedUser.user_id , message: messageInput ,timestamp : new Date()})
          console.log("c")
          MessageService.sendMessages({sender : senderId,receiver: selectedUser.user_id, message: messageInput,timestamp : new Date() })
          console.log("d")
          setMessageInput("")
        
      }


      
      }
      const handleKeyPress = (e)=>{
     
        if(e.key === "Enter"){
            sendMessage()
        }
      }

      useEffect(()=>{
        console.log("useeffect fetcusers")
        fetchUsers()
      },[senderId])

  return (


    <div className='chat-page'>
        <div className='chat-members'>
            <div>
            <p>User Id : {senderId}</p>
            <button className="button" onClick={()=>{logOutUser()}}>Log Out</button>
            {<PopupDialog handleUserSelect={handleUserSelect} currentUser={senderId} setChatMememberList={setChatMememberList}/>}
   
      
            </div>
           
            {renderChatMembers()}
        </div>
      
        <div className='chat-container'>
            {
                Object.keys(selectedUser).length ? 
            <>
            <div className='chat-header'>
            <div class="user-info-container">
                <div class="avatar large">
                    <img src={`https://robohash.org/${selectedUser.user_id ||"avatar"}.png`} alt="User Avatar"/>
                </div>
                <div class="username">{selectedUser.user_id ||  "UserName"}</div>

                <i class={`info-icon ${selectedUser.active_status === true ? "active" :"inactive"}`} >{selectedUser.active_status === true ? "Active": `last seen ${ calculateTime(selectedUser.last_login)}` }</i>
                </div>
            </div>

            <div className='chat-middle'>
            {renderMessages()}
            </div>
            <div className="chat-footer">
            
                 <button style={{
                  width: "30px",height:"30px",marginTop : "3px"
                }} onClick={toggleEmojiBox}>🎉</button>
                 {/* {openEmojiBox && <EmojiPicker onSelect={handleEmojiSelect} /> }  */}
                 {openEmojiBox && <PopupDialog2 dialogTitle={"Select Emoji"} dialogContent ={<EmojiPicker onSelect={handleEmojiSelect} />} /> } 
                {/* {selectedEmoji && <p>Selected Emoji: {selectedEmoji}</p>} */}
                
                
                <input className="message-container" type="text" value={messageInput}  name="text" id="text"   autoComplete="off" onChange={(e)=>setMessageInput(e.target.value)} onKeyDown={(e)=>{handleKeyPress(e)}}/>
               
                <button className='message-send' onClick={()=>{sendMessage()}} >Send</button>
                <Toaster toasts={toasts} position="bottom-right" autoDismissTime={3000} clearToasts={clearToasts} />
                {/* {showStickerPicker && <StickerPicker onSelect={handleStickerSelect} />} */}
            </div>
         
            </>: <><div class="select-chat-message" id="selectChatMessage">Please select a chat</div></>
            }
        </div>

        <div>
      <NotificationSound />
    </div>
       
        {/* <button onClick={() => showToast('Hello, this is a toast!')}>Show Toast</button> */}
    </div>
  )
}
