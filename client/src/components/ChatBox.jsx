import { Send, Edit } from '@mui/icons-material';
import dayjs from 'dayjs';
import { Divider, Fab, Grid, List, ListItem, ListItemText, TextField, IconButton } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react'


import { useSelector } from "react-redux";

const ChatBox = ({ classes, allMessages,setAllMessages, selectedChat, _id }) => {
    const token = useSelector((state) => state.auth?.token);
    const chatboxRef = useRef(null);
    const [editMode, setEditMode] = useState(false)
    const [messageToEdit, setMessageToEdit] = useState({})

  const [newMessage, setNewMessage] = useState();

  useEffect(() => {
    console.log('rendered', allMessages)
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
}, [allMessages]);


  const editMessage = (message) => {
    setMessageToEdit(message)
    setEditMode(true)

    setNewMessage(message.message);


  }


  const sendEditMessageToAPI = async () => {

    console.log(selectedChat);
    let receiver;
    if(selectedChat.participants[0]._id === _id){
         receiver = selectedChat.participants[1]._id;
    }
    if(selectedChat.participants[1]._id === _id){
      receiver = selectedChat.participants[0]._id;
    }


    let messageData = {
      chat_id: selectedChat._id,
      message_id: messageToEdit._id,
      message_content: newMessage,
      receiver_id: receiver,
    };
    try {
      const response = await fetch(
        `http://localhost:3001/chat/update-message/${messageToEdit._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );
      const data = await response.json();
      console.log("fatched data is");
      console.log(data);
      console.log(data.chat.messages);
      setNewMessage("");

      const formattedMessages = data.chat.messages.map((message) => {
        const formattedTime = dayjs(message.updatedAt).format('HH:mm - DD MMMM, YYYY'); // Format the time as 'HH:mm'
      
        return {
          ...message,
          formattedTime,
        };
      });

      setAllMessages(formattedMessages);
   
      setTimeout(() => {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }, 2000);
    } catch (error) {
      console.log(error);
    }


  }


  const sendMessageToAPI = async () => {

    if(editMode) {
      sendEditMessageToAPI()
      return;
    }


    console.log(selectedChat);
    let receiver;
    if(selectedChat.participants[0]._id === _id){
         receiver = selectedChat.participants[1]._id;
    }
    if(selectedChat.participants[1]._id === _id){
      receiver = selectedChat.participants[0]._id;
    }


    let messageData = {
      chat_id: selectedChat._id,
      message_content: newMessage,
      receiver_id: receiver,
    };
    try {
      const response = await fetch(
        `http://localhost:3001/chat/send-message`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );
      const data = await response.json();
      console.log("fatched data is");
      console.log(data);
      console.log(data.chat.messages);
      setNewMessage("");

      const formattedMessages = data.chat.messages.map((message) => {
        const formattedTime = dayjs(message.updatedAt).format('HH:mm - DD MMMM, YYYY'); // Format the time as 'HH:mm'
      
        return {
          ...message,
          formattedTime,
        };
      });

      setAllMessages(formattedMessages);
   
      setTimeout(() => {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }, 2000);
    } catch (error) {
      console.log(error);
    }


  }

  
  async function sendMessage(e) {
    setNewMessage(e.target.value);
    console.log("clicked");
    if (e.key === "Enter" && newMessage) {
      console.log("enter");
      //  setSendMsgLoading(true);
      // setNewMessage("");
      //  socket.emit("stop typing", selectedChat._id);

      sendMessageToAPI()

    }
  }
  return (
    <Grid item xs={9}>
      <List className={classes.messageArea} ref={chatboxRef}>
        {allMessages.length > 0 ? (
          allMessages.map((message) => {
            return (
              <ListItem key={message._id}>
                <Grid 
                  container 
                  direction="column"
                  className={`message-container ${message.sender === _id ? 'sender' : 'receiver'}`}
                >
                  <Grid item xs={12}>
                    <ListItemText
                      primary={message.message}
                    />
                  </Grid>
                  <Grid item xs={12} container 
                    justifyContent={message.sender === _id ? 'flex-end' : 'flex-start'}
                    alignItems="center">
                    <ListItemText
                      align="right"
                      secondary={message.formattedTime}
                    />
                    {
                      (message.sender === _id) && (
                        <IconButton color="primary" aria-label="edit" onClick={() => editMessage(message)}>
                          <Edit />
                        </IconButton>
                      )
                    }
                  </Grid>
                </Grid>
              </ListItem>
            );
          })
        ) : (
          <></>
        )}
        {/* <ListItem key="1">
          <Grid container>
            <Grid item xs={12}>
              <ListItemText
                align="right"
                primary="Hey man, What's up ?"
              ></ListItemText>
            </Grid>
            <Grid item xs={12}>
              <ListItemText align="right" secondary="09:30"></ListItemText>
            </Grid>
          </Grid>
        </ListItem>
        <ListItem key="2">
          <Grid container>
            <Grid item xs={12}>
              <ListItemText
                align="left"
                primary="Hey, Iam Good! What about you ?"
              ></ListItemText>
            </Grid>
            <Grid item xs={12}>
              <ListItemText align="left" secondary="09:31"></ListItemText>
            </Grid>
          </Grid>
        </ListItem>
        <ListItem key="3">
          <Grid container>
            <Grid item xs={12}>
              <ListItemText
                align="right"
                primary="Cool. i am good, let's catch up!"
              ></ListItemText>
            </Grid>
            <Grid item xs={12}>
              <ListItemText align="right" secondary="10:30"></ListItemText>
            </Grid>
          </Grid>
        </ListItem> */}
      </List>
      <Divider />
      <Grid container style={{ padding: "20px" }}>
        <Grid item xs={11}>
          <TextField
            id="outlined-basic-email"
            label="Type Something"
            fullWidth
            onKeyDown={sendMessage}
            value={newMessage}
            onChange={(e)=>setNewMessage(e.target.value)}
          />
        </Grid>
        <Grid xs={1} align="right">
          <Fab color="primary" aria-label="add" onClick={sendMessageToAPI}>
            <Send />
          </Fab>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatBox