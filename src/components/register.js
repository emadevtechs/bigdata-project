import React, {useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { gql, useMutation } from '@apollo/client';
import { Grid, Paper, Slide, TextField, Typography, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton,  Dialog, DialogTitle} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useHistory } from "react-router-dom";
import emailjs, {init} from 'emailjs-com';

const INSERT_USER = gql`
    mutation InsertUser($email: String!, $username: String!, $password: String!) {
        insert_user(objects: {email: $email, password: $password, username: $username}) {
            returning {
                id
            }
        }
    }
  `;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    paper: {
        display: "flex",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '60vh',
        width:  "70%",
    },
    control: {
      padding: theme.spacing(2),
    },
    form_root: {
        '& > *': {
          margin: theme.spacing(1),
          width: '25ch',
        },
        display: 'flex',
        flexDirection: 'column',
      },
  }));

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Register = () => {

    const history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const[state, setState] = useState({
        email: null,
        username: null,
        adminEmail: null,
        adminPass: null,
        password: null,
        showPassword: false,
        confirm_password: null,
        showCPassword: false
    })
    const [addUser, { loading, data }] = useMutation(INSERT_USER);

    useEffect(() => {
        init("user_1wM9XuNeFkNmteLSh1Moz");
      },[])
    useEffect(() => {
        if(data){
            if(data.insert_user && data.insert_user.returning[0] && data.insert_user.returning[0].id){
                console.log(data,'daa')
                history.push('/login')
            }else{
                alert('Something went wrong')
            }
        }
    },[data]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <p>Loading ...</p>;

  const onLoginSubmit = () => {
      if(state.adminEmail === 'bigdataadmin@gmail.com' && state.adminPass === 'admin@123'){
      if(state.password){
          addUser({ variables: {
              email: state.email,
              username: state.username,
              password: state.password
          } })
          emailjs.send("service_9hbeklz","template_cnnt8kc",{
            from_name: "bigdataadmin@gmail.com",
            to_name: state.email,
            message: JSON.stringify({email: state.email, password: state.password}),
            }).then(res => {
              alert('Email successfully sent!')
              history.push('/')
            })
            // Handle errors here however you like, or use a React error boundary
            .catch(err => console.error('Oh well, you failed. Here some thoughts on the error that occured:', err))
      }else{
          alert('password not present')
      }
    }else{
        alert('Admin Credential failed')
    }
  }

  const onHandleChange = (item, data) => {
    setState({...state, [item]: data.target.value})
  }

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setOpen(false);
  };

    return(
        <Grid container className={classes.root}>
            <Paper elevation={3} className={classes.paper}>
                <div style={{padding: 10}}>
                    <Typography align="left" variant="h6" style={{fontWeight: 'bold'}}>Enter User Details</Typography>
                </div>
                <form className={classes.form_root} noValidate autoComplete="off">
                    <Typography align="left" variant="body2">Email</Typography>
                    <TextField
                        onChange={(event) => onHandleChange('email', event)}
                        id="email"
                        label="Email"
                        variant="outlined"
                    />
                    <Typography align="left" variant="body2">Username</Typography>
                    <TextField
                        onChange={(event) => onHandleChange('username', event)}
                        id="username"
                        label="Username"
                        variant="outlined"
                    />
                    <Typography align="left" variant="body2">Password</Typography>
                    <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={state.showPassword ? 'text' : 'password'}
                            value={state.password}
                            onChange={(event) => onHandleChange('password', event)}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {state.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                            labelWidth={70}
                        />
                        </FormControl>
                    <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                        Create User
                    </Button>
                </form>
            </Paper>
            <Dialog 
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="simple-dialog-title">Verify Admin Details</DialogTitle>
                <form className={classes.form_root} noValidate autoComplete="off">
                    <Typography align="left" variant="body2">Email</Typography>
                    <TextField
                        onChange={(event) => onHandleChange('adminEmail', event)}
                        id="email"
                        label="Email"
                        variant="outlined"
                    />
                    <Typography align="left" variant="body2">Password</Typography>
                    <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={state.showPassword ? 'text' : 'password'}
                            value={state.adminPass}
                            onChange={(event) => onHandleChange('adminPass', event)}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {state.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                            labelWidth={70}
                        />
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={() => onLoginSubmit()}>
                        Create User
                    </Button>
                    </form>
            </Dialog>
        </Grid>
    )
}

export default Register;