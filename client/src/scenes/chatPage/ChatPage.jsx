import React from "react";
import dayjs from 'dayjs';
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Paper,
  ListItemButton,
  Box,
} from "@mui/material";

import Navbar from "scenes/navbar";

import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import { useTheme } from "@emotion/react";
import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";
import ChatBox from "components/ChatBox";
import EmptyChatBox from "components/EmptyChatBox";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "80vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
});

const Chat = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.auth?.token);
  const friends = useSelector((state) => state.auth?.user.friends);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isChatSelected, setIsChatSelected] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [extraFilteredFriends, setExtraFilteredFriends] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { _id, picturePath, firstName, lastName } = useSelector(
    (state) => state.auth?.user
  );
  const ENDPOINT = "http://localhost:3001";
  let socket= io(ENDPOINT);
  const classes = useStyles();
  //  useEffect(() => {
   
  //  }, [allMessages]);  

  const getFriends = async () => {
    const response = await fetch(`http://localhost:3001/users/${_id}/friends`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  const getAllChats = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/chat/get-all-chats/${_id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setChats(data.data);
    } catch (error) {
      console.log(error);
    }
  };


   useEffect(() => {
     getFriends();
     getAllChats();
     socket.emit("join_room", _id);
     socket.on("connected", () => setSocketConnected(true));


     socket.on("msg_received", (messageData) => {

      const formattedTime = dayjs(messageData.updatedAt).format('HH:mm - DD MMMM, YYYY'); // Format the time as 'HH:mm'

      const formattedMessage = {
        ...messageData,
        formattedTime,
        sender: messageData.sender._id
      };


     //  setAllMessages(allMessages.push(messageData));
    //  setAllMessages(newMessages);
     setAllMessages((prevMessages) => {
       const newMessages = []


       let itWasAMessageUpdate = false

       prevMessages.forEach(message => {
         if(message._id === formattedMessage._id) {
           newMessages.push(formattedMessage)
           itWasAMessageUpdate = true
         }else {
           newMessages.push(message)
         }
       })

       if(!itWasAMessageUpdate) {
         newMessages.push(formattedMessage)
       }


       return newMessages
     });


     // setAllMessages([...allMessages, messageData]);
   });

   }, []);

   useEffect(() => {

    if(searchQuery !== "") {

      setFilteredChats([])
      setExtraFilteredFriends([])
      const filterChats = chats.filter((chat) => {
        const participant = chat.participants.find(
          (participant) =>
            participant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            participant.lastName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return participant !== undefined;
      });
  
      setFilteredChats(filterChats)
  
  
      
      const filterFriends = filteredFriends.filter(
        (friend) =>
          friend.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          friend.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      setExtraFilteredFriends(filterFriends)
    }else {
      setFilteredChats(chats)
      setExtraFilteredFriends(filteredFriends)
    }


   }, [searchQuery])


   useEffect(() => {

    setFilteredFriends([])

    friends.forEach(friend => {
      const findIndex = chats.findIndex(chat => ((chat.participants[0]._id === friend._id) || (chat.participants[1]._id === friend._id)));

      if(findIndex === -1) {
        setFilteredFriends(prevFriends => [...prevFriends, friend])
      }
      
    })
    
    if(searchQuery === "") {
      setFilteredChats(chats)
      setExtraFilteredFriends(filteredFriends)
    }




   }, [friends, chats])


  const createNewChat = async (friendId) => {
    try {
      const chatData = {
        sender: _id,
        receiver: friendId,
      }
      const response = await fetch(
        `http://localhost:3001/chat/create-chat`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chatData),
        }
      );
      const data = await response.json();
      setChats(data.chats);
    } catch (error) {
      console.log(error);
    }
  };

  
  const getAllMessages = async (chatId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/chat/get-all-messages/${chatId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      const formattedMessages = data.data.messages.map((message) => {
        const formattedTime = dayjs(message.updatedAt).format('HH:mm - DD MMMM, YYYY'); // Format the time as 'HH:mm'
      
        return {
          ...message,
          formattedTime,
        };
      });

      setAllMessages(formattedMessages);
    } catch (error) {
      console.log(error);
    }
  };

 

  function getSender(chat) {
    const users = chat.participants;

    let senderName =
      users[0]._id === _id
        ? users[1]?.firstName + " " + users[1]?.lastName
        : users[0]?.firstName + " " + users[0]?.lastName;

    return senderName;
  }

  function getSenderProfile(chat) {
    const users = chat.participants;

    return users[0]._id === _id ? users[1]?.picturePath : users[0]?.picturePath;
  }

  return (
    <Box>

    <Navbar />

    <div style={{ padding: "20px" }}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        component={Paper}
        className={classes.chatSection}
        style={{ padding: "20px", height: "90vh" }}
      >
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <ListItem key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt={firstName}
                  src={`http://localhost:3001/assets/${picturePath}`}
                />
              </ListItemIcon>
              <ListItemText primary={`${firstName} ${lastName}`}></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}            
            />
          </Grid>
          <Divider />

          {filteredChats.length > 0 ? (
            <Typography
              color={palette.neutral.dark}
              variant="h5"
              marginTop={3}
              fontWeight="500"
              sx={{ mb: "1.5rem" }}
            >
              Chats
            </Typography>
            ) : 'No Chats Found'
          }
          
          <List>
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <React.Fragment key={chat._id}>
                  <List>
                    <ListItem
                      onClick={() => {
                        setIsChatSelected(true);
                        setSelectedChat(chat);
                        getAllMessages(chat._id);
                      }}
                      disablePadding
                      sx={{
                        // backgroundColor: `${colors.backgroundcolor.main}`,
                        // backgroundColor: `#2e2e2e`,
                        // borderColor: `${bordercolor}`,
                        borderRadius: "5px",
                        // border: `1px solid ${colors.bordercolor}`,
                        width: "90%",
                        margin: "0 auto",
                      }}
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <Avatar
                            alt="Profile Pic"
                            src={`http://localhost:3001/assets/${getSenderProfile(chat)}`}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            fontSize: 16,
                            fontWeight: "light",
                            letterSpacing: 0,
                            color: "#000000DE",
                          }}
                          primary={getSender(chat)}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </React.Fragment>
              ))
            ) : (
              <></>
            )}
          </List>

            <Divider/>



            {extraFilteredFriends.length > 0 ? (
              <Typography
              color={palette.neutral.dark}
              variant="h5"
              fontWeight="500"
              marginTop={3}
              sx={{ mb: "1.5rem" }}
            >
              Add Friends To Chat
            </Typography>
            ) : 'No More Friends Found To Add'
          }
            <List>

                {extraFilteredFriends.map((friend) => (

                  <React.Fragment key={friend._id}>
                  <List>
                    <ListItem
                      onClick={() => {
                        createNewChat(friend._id)
                      }}
                      disablePadding
                      sx={{
                        // backgroundColor: `${colors.backgroundcolor.main}`,
                        // backgroundColor: `#2e2e2e`,
                        // borderColor: `${bordercolor}`,
                        borderRadius: "5px",
                        // border: `1px solid ${colors.bordercolor}`,
                        width: "90%",
                        margin: "0 auto",
                      }}
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <Avatar
                            alt="Profile Pic"
                            src={`http://localhost:3001/assets/${friend.picturePath}`}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            fontSize: 16,
                            fontWeight: "light",
                            letterSpacing: 0,
                            color: "#000000DE",
                          }}
                          primary={`${friend.firstName} ${friend.lastName}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                  </React.Fragment>


                ))}
            </List>
            


        </Grid>
        {isChatSelected ? (
          <ChatBox
            classes={classes}
            allMessages={allMessages}
            setAllMessages={setAllMessages}
            selectedChat={selectedChat}
            _id={_id}
          ></ChatBox>
        ) : (
          <Grid item xs={9}  display="flex" alignItems="center" justifyContent="center">
            <EmptyChatBox></EmptyChatBox>
          </Grid>
        )}
      </Grid>
    </div>
    </Box>
  );
};

export default Chat;
