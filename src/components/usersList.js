import React, { useState, useEffect, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery, gql, useLazyQuery } from '@apollo/client';
import { List, ListItem, ListItemIcon, ListItemText, Divider} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
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

  if (queryLoading) return 'Loading...';
  if (queryError) return `Error! ${queryError.message}`;

  const onNameClick = (data) => {
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
    </div>
  );
}

export default UsersList;
