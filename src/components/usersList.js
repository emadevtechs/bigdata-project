import React, { useState, useEffect, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery, gql, useLazyQuery } from '@apollo/client';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Paper, Typography, TextField, Button } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';
import { useHistory } from "react-router-dom";

var _ = require('lodash');

const GET_USERS = gql`
    query MyQuery {
        user {
            id
            username
        }
    }
`;

const GET_MY_MESSAGES = gql`
    query MyQuery($user_id: uuid, $friend_id: uuid) {
      messages(where: {user_id: {_eq: $user_id}, friend_id: {_eq: $friend_id}}) {
        message
        attime
        user {
          id,
          username
        }
        userByUserId {
          id,
          username
        }
      }
    }
`;

const GET_FRIEND_MESSAGES = gql`
    query FriendQuery($user_id: uuid, $friend_id: uuid) {
      messages(where: {user_id: {_eq: $user_id}, friend_id: {_eq: $friend_id}}) {
        message
        attime
        user {
          username
        }
        userByUserId {
          username
        }
      }
    }
`;

const INSERT_MESSAGES = gql`
  mutation InsertMesage($userid: uuid, $friendid: uuid, $message: String!) {
    insert_messages(objects: {friend_id: $friendid, message: $message, user_id: $userid}) {
      returning {
        id
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'baseline',
    backgroundColor: theme.palette.background.paper,
  },
  chat_div: {
    position: 'absolute',
    top: 65,
    right: 20,
    width: "50%",
    height: "50vh",
    padding: 10
  },
  paper_header: {
    padding: 20,
    backgroundColor: 'blue'
  },
  textField_style: {
    display: 'flex',
    justifyContent: 'center',
    padding: 10
  }
}));


const UsersList = (props) => {

  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    enablePopUp: false,
    friendId: null,
    userId: null,
    Messages: null,
    message: null
  })
  const inputDataRef = useRef(null);

  const { loading: queryLoading, error: queryError, data } = useQuery(GET_USERS);
  const [fetchMyMessage, { data: mymessages }] = useLazyQuery(GET_MY_MESSAGES, {pollInterval: 1000});
  const [fetchFriendMessage, { data: friendmessages }] = useLazyQuery(GET_FRIEND_MESSAGES, {pollInterval: 2000});
  const [addMessage, { data: insertedData }] = useMutation(INSERT_MESSAGES);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      setState({
        ...state, userId: userId
      })
    }else{
      alert("Login First")
      history.push('/login')
  }
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
      if(insertedData){
        console.log('insertedData', insertedData)
        if(insertedData.insert_messages && insertedData.insert_messages.returning && insertedData.insert_messages.returning[0] && insertedData.insert_messages.returning[0].id){
          setState({
            ...state, message: null
          });
          // refetchmyMsg({variables: { user_id: state.userId, friend_id: data }})
          // refetchFrdMsg({variables: { user_id: data, friend_id: state.userId }})
        }
      }
  },[insertedData]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mymessages && friendmessages) {
      let outcome = [...mymessages.messages, ...friendmessages.messages];
      let sortedArray = _.sortBy(outcome, function (data) {
        return new Date(data.attime);
      });
      setState({ ...state, Messages: sortedArray })
      console.log('mymessages && friendmessages', outcome, sortedArray)
    }
  }, [mymessages && friendmessages]) // eslint-disable-line react-hooks/exhaustive-deps

  // console.log('user list', state.Messages);

  if (queryLoading) return 'Loading...';
  if (queryError) return `Error! ${queryError.message}`;

  const onNameClick = (data) => {
    setState({ ...state, friendId: data, enablePopUp: true, Messages: null })
    fetchMyMessage({ variables: { user_id: state.userId, friend_id: data } })
    fetchFriendMessage({ variables: { user_id: data, friend_id: state.userId } })
  }

  const onSubmitMessage = () => {
    inputDataRef.current.value=null
    addMessage({
      variables: {
        userid: state.userId,
        friendid: state.friendId,
        message: state.message
      }
    })
  }

  return (
    <div className={classes.root}>
      {data && data.user && data.user.length > 0 && <List component="nav" aria-label="main mailbox folders">
        {data.user.map((item, i) => {
          return (
            <><ListItem button key={i} onClick={() => onNameClick(item.id)}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={item.username} />
            </ListItem>
              <Divider /></>)
        })}
      </List>}
      { state.enablePopUp && state.Messages && <div className={classes.chat_div}>
        <Paper elevation={3}>
          <div className={classes.paper_header}>
            <Typography align="center" variant="subtitle1" color="textPrimary">Messages</Typography>
            <div style={{position: 'absolute', top: 10, right: 15, cursor: 'pointer'}}>
              <CancelIcon  onClick={() => {setState({...state, enablePopUp: false, Messages: null})}}/>
            </div>
          </div>
          <List component="nav" aria-label="main mailbox folders" style={{height: '40vh', overflow: 'auto'}} >
            {state.Messages.map((item, i) => {
              return (
                <><ListItem key={i}>
                  <ListItemIcon>
                    {item.userByUserId.id === state.userId && <PersonIcon />}
                  </ListItemIcon>
                  <ListItemText primary={item.message} />
                </ListItem>
                  <Divider /></>)
            })}
          </List>
          <div className={classes.textField_style}>
            <TextField
                onChange={(event) => setState({...state, message:event.target.value})}
                id="message"
                innerRef={inputDataRef}
                label="Enter Message"
                variant="outlined"
            />
            <Button variant="contained" color="primary" onClick={() => onSubmitMessage()}>
                <SendIcon />
            </Button>
          </div>
        </Paper>
      </div>}
    </div>
  );
}

export default UsersList;
