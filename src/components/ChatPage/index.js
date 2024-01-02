import React,{useEffect, useState} from 'react'
import "./ChatPage.css"

import io from "socket.io-client"
import {UserService}  from '../../services/User'
import {GroupService}  from '../../services/Group'
import Button from '@mui/material/Button';
import { useId } from '../../other/IdContext';
import {useNavigate,useLocation} from 'react-router-dom';
import { MessageService } from '../../services/Messages';
import Toaster from '../../common/components/toaster';
import NotificationSound from '../../common/components/toaster/NotificationSound';
import StickerPicker from '../Stickers';
import PopupDialog from "../../common/popup/PopupDialog"
import PopupDialog2 from "../../common/popup2/PopupDialog2"
import EmojiPicker from '../EmojiPicker/index';
import config from "../../common/utility"
const moment = require("moment")



let socket ;
export default function ChatPage() {
    const [messages,setMessages] = useState([])
    const [chatMembers,setChatMembers] = useState([])
    const [messageInput,setMessageInput] = useState("")
    const [selectedUser, setSelectedUser] = useState({});
    const { receiverId, updateReceiverId, senderId, updateSenderId ,logout} = useId();
    const [idCounter, setIdCounter] = useState(0);
    const navigate = useNavigate();
    const [toasts, setToasts] = useState([]);
    const [openEmojiBox, setOpenEmojiBox] = useState(false);
    const [showStickerPicker, setShowStickerPicker] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [togglePopup, setTogglePopup] = useState(false);
    const [username,setUsername] = useState("")
    const [groupname,setGroupname] = useState("")
    const [groupMemberList,setGroupMemberList] = useState([])
    const [disableCreateGroupButton,setDisableCreateGroupButton] = useState(true)
    
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
      socket = io(config.domain_name);
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
        // let fetchGroupsResp = await MessageService.fetchGroups({user_id:senderId})
        console.log("fetchUserResp2",fetchUserResp2)
        // if(fetchUserResp.status === "success"){
        
        //   let usersList = fetchUserResp.result.length && fetchUserResp.result.filter((curr)=>{
        //     return curr.user_id !== senderId
        //    }).map((curr)=>{ return {name:curr.user_id,avatar:"avatar"}})
        //    setChatMembers(usersList)
        // }
        if(fetchUserResp2.status === "success"){
          let usersList = fetchUserResp2.result.length && fetchUserResp2.result.map((curr)=>{
            return {name:curr.name, type : curr.type, avatar:"avatar"}
          })
          usersList = usersList.length ? usersList : []
          setChatMembers(usersList)

        }
        
      }

      const setChatMememberList = (newMembers = [])=>{
        setChatMembers([...chatMembers,...newMembers])
      }

      const callMe = (messageId)=>{
        console.log("MessageId",messageId)
      }

      const handleUserSelect = async(user_id,type = "Individual") => {
        if(type === "Individual"){
        
          let user = {}  ; 
        let active_status = "false"
        let fetchUserResp = await UserService.activeUsers();
       
        if(fetchUserResp.status === "success"){
          active_status = fetchUserResp.result ? fetchUserResp.result[user_id] ? true : false : false
          user["user_id"] = user_id
          user["active_status"] = active_status
     
          if(!active_status){
            let fetchUsersResp2 = await UserService.fetchUsers(`user_id=${user_id}`)
            user = fetchUsersResp2.result ? fetchUsersResp2.result.length ? fetchUsersResp2.result[0] : {} : {}
         
          }
        }
        user["type"] = type

        setSelectedUser(user);
      }
      else{
        setSelectedUser({user_id,type:"Group"});
      }
        
      };
    
      const handleFetchMessages = async ()=>{
        let obj = selectedUser.type === "Individual" ? {sender: senderId,receiver : selectedUser.user_id} : {sender: selectedUser.user_id,receiver : selectedUser.user_id}
        let fetchMessagesResp =await MessageService.fetchMessages(obj)
       
        if(fetchMessagesResp.status === "success" && fetchMessagesResp.result.length ){
          setMessages([...fetchMessagesResp.result[0].messages])
        }     
      }

    useEffect(()=>{
      handleFetchMessages()
    },[selectedUser])
    const renderMessages = () => {
        return messages.map((message) => {
            if(message.sender === "system"){
                return (<div
                    key={message.messageId}
                    className={`message ${message.sender}`}
                    onClick={()=>{callMe(message.messageId)}}
                  > 
                    {message.message}
                    <div>{message.timestamp}</div>
                  </div>)
            }
            else{
                return (<div
                    key={message.messageId || ""}
                    className={`message ${message.sender === senderId ? 'Myself' : 'Other'}`}
                    onClick={()=>{message.messageId && callMe(message.messageId)}}
                  > 
                    <div className="italic" style = {{color: "black"}}><b>{message.sender}</b></div>
                    <div>
                       {message.message}
                    <sub  className="italic"  style = {{marginLeft: "10px"}}>{calculateTime(message.timestamp)} </sub>
                      </div>
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
              if(member.type === "Individual"){
                return (<div
                  key={"1"}
                    className={`chat-member-box`}
                    onClick={() => handleUserSelect(member.name,member.type)}
                    title={member.name}
                    > 
                    <div class="avatar">
                        <img src={`https://robohash.org/${member.name ||"avatar"}.png`} alt="User Avatar"/>
                    </div>
                    {member.name}
                  </div>)
              }
              else{
                return (<div
                  key={"1"}
                    className={`chat-member-box`}
                    onClick={() => handleUserSelect(member.name,member.type)}
                    title={member.name + " "+ member.type}
                    > 
                    <div class="avatar">
                        <img src="/images/group.jpg" alt="Group Avatar"/>                      
                    </div>
                    {member.name}
                  </div>)
              }
      
          
        });
      };

      const calculateTime =(time, type = "last_login")=>{
        let currentTime = moment();
        let lastSeenTime = moment(time)   //.subtract(5, 'minutes');
        let timeDiff = currentTime.diff(lastSeenTime, 'minutes');       
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
          setMessages([{sender:senderId,message:messageInput,timestamp : new Date()},...messages])
          socket.emit('privateMessage', {sender : senderId, receiver: selectedUser.user_id , message: messageInput ,timestamp : new Date()})
          MessageService.sendMessages({type : selectedUser.type || "Individua" , sender : senderId,receiver: selectedUser.user_id, message: messageInput,timestamp : new Date() })
          setMessageInput("")
        
      }
      }

      const addGroupMember = async()=>{
        if(username === ""){
          return alert("Please Enter User ID")
        }
        
        let fetchUsersResp = await UserService.fetchUsers(`user_id=${username}`)
        if(fetchUsersResp.status === "success" && fetchUsersResp.result.length){
          if(groupMemberList.includes(username)){
            alert("Username Already Added")
          }
          else{
            setGroupMemberList([...groupMemberList,username])
          } 
          setUsername("")
        }
        else{
          alert("Invalid username! Please try again.")
        }
    
      }

      const vaidateGroupName = async()=>{
        if(groupname === ""){
          return alert("Please Enter Group Name")
        }
        
      
        let vaidateGroupNameResp = await GroupService.validateGroupName({group_name : groupname})
        
        if(vaidateGroupNameResp.status === "success" && vaidateGroupNameResp.result.length === 0){
          setDisableCreateGroupButton(false)
          if(!groupMemberList.includes(senderId)){
            setGroupMemberList([...groupMemberList,senderId])
          }
        }
        else{
          alert("GroupName Already Taken")
        }
    
      }

      const groupChatContent = ()=>{
        return(<>
         Please Enter Group Name : 
            <input
            type="text"
            value={groupname}
            onKeyDown={(e)=> {handleKeyPress(e,"vaidateGroupName")}}
            onBlur={(e)=>{handleKeyPress({key : "Enter"},"vaidateGroupName")}}
            onChange={(e) => setGroupname(e.target.value)}
            required
            />
         Please Enter User Name To Add To Group: 
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e)=> {handleKeyPress(e,"AddGroupChatMember")}}
            required
            />
        {groupMemberList && groupMemberList.map((curr)=>{
          return <li>{curr}</li>
        })}
        </>)
      }
      
      const handleKeyPress = (e,action)=>{
        if(e.key === "Enter"){
          if(action === "AddGroupChatMember"){
            addGroupMember()
          }
          else if( action === "vaidateGroupName"){
            vaidateGroupName()
          }
          else{
            sendMessage()
          }
        }        
      }

      const toggleShowCreateGroup = ()=>{
        setShowCreateGroup(!showCreateGroup)
        setGroupMemberList([])
        setUsername("")
        setGroupname("")
        setDisableCreateGroupButton(true)
      }

      const createGroup = async ()=>{
        let obj = {"group_name":groupname, "group_members":groupMemberList, "group_admin":[senderId]}
        let createGroupResp = await GroupService.createGroup(obj)
        if(createGroupResp.status === "success"){
          console.log("Groups",createGroupResp.result)   
          let obj = {name:groupname, type : "Group", avatar:"avatar"}     
          setChatMembers([obj,...chatMembers])
        }
        setGroupMemberList([])
        setUsername("")
        setShowCreateGroup(false)
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
            <button className="button" onClick={()=>{toggleShowCreateGroup()}}>Create Group</button>
            {showCreateGroup && <PopupDialog2 dialogTitle={"Create Group"} dialogContent ={groupChatContent()}  dialogActions = {<>
      
          <button className={`${disableCreateGroupButton ? 'disabled':"button"}`} onClick={()=>{createGroup()}}>Create Group</button>
          <button className="button" onClick={()=>{toggleShowCreateGroup()}}>Close</button>
          </>} />  } 
             
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
                
                {selectedUser && selectedUser.type === "Individual" && <i class={`info-icon ${selectedUser.active_status === true ? "active" :"inactive"}`} >{selectedUser.active_status === true ? "Active": `last seen ${ calculateTime(selectedUser.last_login)}` }</i>}
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
