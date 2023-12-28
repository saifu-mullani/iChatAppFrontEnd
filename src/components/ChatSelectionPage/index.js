// ChatSelectionPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {UserService}  from '../../services/User'
import {GroupService}  from '../../services/Group'
import {useNavigate,useLocation} from 'react-router-dom';
import { useId } from '../../other/IdContext';
// import './ChatSelectionPage.css'; // Import the CSS file

const ChatSelectionPage = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [groupList, setGroupList] = useState(null);
  const navigate = useNavigate();
  const { receiverId, updateReceiverId, senderId, updateSenderId ,logout} = useId();

  const handleUserSelect = (user_id) => {
    setSelectedUser(user_id);
    updateReceiverId(user_id)
    setTimeout(() => {
      navigate('/chatApp',{state: {"type":"Private"}});;
    }, 1000);
  };

  const  handleGroupSelect = (group_name) => {
    setSelectedGroup(group_name);
    updateReceiverId(group_name)
    setTimeout(() => {
      navigate('/chatApp',{state:{"type":"Group"}});;
    }, 1000);
  };

 

  const fetchUsers = async()=>{
    console.log("fetchUsers")
    let fetchUserResp = await UserService.fetchUsers()
    if(fetchUserResp.status === "success"){
      console.log("Users",fetchUserResp.result)
      let usersList = fetchUserResp.result.length && fetchUserResp.result.filter((curr)=>{
        return curr.user_id !== senderId
       }).map((curr)=>{ return curr.user_id})
      setUsersList(usersList)
    }
    console.log("fetchUserResp",fetchUserResp)
  }

  const fetchGroups = async()=>{
    console.log("fetchGroups")
    let fetchGroupsResp = await GroupService.fetchGroups()
    if(fetchGroupsResp.status === "success"){
      console.log("Groups",fetchGroupsResp.result)
      let groupsList = fetchGroupsResp.result.length && fetchGroupsResp.result.map((curr)=>{
        return curr.group_name
       })
       console.log("groupsList123",groupsList)
       setGroupList(groupsList)
    }
    
  }

  const logOutUser = async()=>{
    console.log("LogOut");

    let logOutResp = await UserService.logout(senderId)
    if(logOutResp.status === "success"){
      logout()
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }

  }
 


  useEffect(()=>{
    fetchUsers()
    fetchGroups()
  },[])

  return (
    <div className="container">
      <h2 style={{float: "right"}} ><button className="button" onClick={logOutUser}>Log Out</button></h2>
      <h2>Chat Selection Page</h2>

      <div className="user-buttons">
        <p>Select a user to chat with:</p>
        <ol>

          {usersList && usersList.map((curr)=>{
            return <li ><button  onClick={() => handleUserSelect(curr)}>{curr}</button></li>
          })}
        </ol>
      </div>

      {selectedUser && (
        <div className="selected-user">
          <p>Selected User: {selectedUser}</p>
          <Link to={`/chat/${selectedUser}`} className="start-chat-link">
            Start Chat
          </Link>
        </div>
      )}

      <div>
        <p>Or, start a group chat:</p>
        <ol>
        {groupList && groupList.map((curr)=>{
            return <li><button onClick={() => handleGroupSelect(curr)}>{curr}</button></li>
          })}
        </ol>
      </div>
    </div>
  );
};

export default ChatSelectionPage;

