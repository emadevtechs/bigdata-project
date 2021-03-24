import React, { useState, useEffect } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { TextField, Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";

const UPDATE_USER = gql`
mutation UpdateUser($id: uuid, $password: String!) {
  update_user(where: {id: {_eq: $id}}, _set: {password: $password}) {
    returning {
      id
    }
  }
} 
  `;

const SELECT_USER = gql`
query MyQuery($id: uuid) {
  user(where: {id: {_eq: $id}}) {
    id
    email
    username
  }
}
  `;

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
  textField_style: {
    display: 'flex',
    justifyContent: 'center',
    padding: 10
  }
}));

const MyProfile = () => {

  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    userid: null,
    message: null,
    userdetails: null,
    opendiv: false,
    password: null,
    confirm_pass: null,
  })

  const [updateUser, { data }] = useMutation(UPDATE_USER);
  const [getUser, { loading: getload, data: userdata }] = useLazyQuery(SELECT_USER);

  // console.log('log log', data, loading);


  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      getUser({
        variables: {
          id: userId
        }
      })
      setState({
        ...state, userid: userId
      })
    } else {
      alert("Login First")
      history.push('/login')
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if(userdata){
      if(userdata && userdata.user && userdata.user[0]){
        setState({...state, userdetails: userdata.user[0]})
      }
    }
  },[userdata]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data) {
      if (data.update_user && data.update_user.returning[0] && data.update_user.returning[0].id) {
        // console.log(data, 'daa');
        // setState({ ...state, message: null })
        alert("Updated Successfully and login again for validation")
        history.push('/login')
      } else {
        alert('Something went wrong')
      }
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmitMessage = () => {
    if(state.password === state.confirm_pass){
      updateUser({
        variables: {
          id: state.userid,
          password: state.password
        }
      })
    }else{
      alert('Password not match')
    }
  }

  if (getload) return <p>Loading ...</p>;


  return (
    <React.Fragment>
      <CssBaseline />
      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h5" align="center" color="textPrimary" gutterBottom>
          Welcome {state.userdetails && state.userdetails.username}
        </Typography>
      </Container>
      <div>
        <Typography variant='body1'>
          Email:
        </Typography>
        <Typography variant='body1'>
          {state.userdetails && state.userdetails.email}
        </Typography>
      </div>
      <Button style={{width: 100, marginTop: 20}} variant="contained" color="primary" onClick={() => setState({...state, opendiv: !state.opendiv})}>
          Change Password
        </Button>
      {state.opendiv && <div className={classes.textField_style}>
        <TextField
          onChange={(event) => setState({ ...state, password: event.target.value })}
          id="message"
          label="Enter New Password"
          variant="outlined"
        />
        <TextField
          onChange={(event) => setState({ ...state, confirm_pass: event.target.value })}
          id="message"
          label="Confirm New Password"
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={() => onSubmitMessage()}>
          Submit
        </Button>
      </div>}
      {/* End hero unit */}
    </React.Fragment>
  );
}

export default MyProfile;