import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { TextField, Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";
import emailjs, {init} from 'emailjs-com';

const INSERT_CONTACT = gql`
    mutation InsertContact($userid: uuid, $message: String!) {
        insert_contact(objects: {message: $message, user_id: $userid}) {
        returning {
            id
        }
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

const Contact = () => {

  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    userid: null,
    message: null
  })

  const [addContact, { data, error }] = useMutation(INSERT_CONTACT);

  console.log('log log', data, error);

  useEffect(() => {
    init("user_1wM9XuNeFkNmteLSh1Moz");
    sendFeedback("template_k5h9d0c", {message_html: "hai ema", from_name: 'emachalanema@gmail.com', reply_to: 'emachalanema@gmai.com'})
  },[])

  const sendFeedback = (templateId, variables) => {
    emailjs.send("service_9hbeklz","template_cnnt8kc",{
      from_name: "emachalanema@gmail.com",
      to_name: "emachalanema@gmail.com",
      message: JSON.stringify({username: 'ema', password: 'emachalan'}),
      }).then(res => {
        console.log('Email successfully sent!')
      })
      // Handle errors here however you like, or use a React error boundary
      .catch(err => console.error('Oh well, you failed. Here some thoughts on the error that occured:', err))
    }

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      setState({
        ...state, userid: userId
      })
    } else {
      alert("Login First")
      history.push('/login')
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data) {
      if (data.insert_contact && data.insert_contact.returning[0] && data.insert_contact.returning[0].id) {
        console.log(data, 'daa');
        setState({ ...state, message: null })
        alert("Insert Successfully")
      } else {
        alert('Something went wrong')
      }
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmitMessage = () => {
    addContact({
      variables: {
        userid: state.userid,
        message: state.message
      }
    })
  }

  return (
    <React.Fragment>
      <CssBaseline />
      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Contact
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" component="p">
          To take advantage of its success potential, ask for only the most important information, we can interact with you. Because you are important for us
        </Typography>
      </Container>
      <div className={classes.textField_style}>
        <TextField
          onChange={(event) => setState({ ...state, message: event.target.value })}
          id="message"
          label="Enter Message"
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={() => onSubmitMessage()}>
          Submit
            </Button>
      </div>
    </React.Fragment>
  );
}

export default Contact;