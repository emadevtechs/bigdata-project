import React, {useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { gql, useMutation } from '@apollo/client';
import { Grid, Paper, TextField, Typography, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton,  } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useHistory } from "react-router-dom";

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


const Register = () => {

    const history = useHistory();
    const classes = useStyles();
    const[state, setState] = useState({
        email: null,
        username: null,
        password: null,
        showPassword: false,
        confirm_password: null,
        showCPassword: false
    })
    const [addUser, { loading, data }] = useMutation(INSERT_USER);

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
      if(state.confirm_password === state.password){
          addUser({ variables: {
              email: state.email,
              username: state.username,
              password: state.password
          } })
      }else{
          alert('password not same')
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

    return(
        <Grid container className={classes.root}>
            <Paper elevation={3} className={classes.paper}>
                <div style={{padding: 10}}>
                    <Typography align="left" variant="h6" style={{fontWeight: 'bold'}}>Enter Your Details</Typography>
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
                        <Typography align="left" variant="body2">Confirm Password</Typography>
                        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={state.showCPassword ? 'text' : 'password'}
                            value={state.confirm_password}
                            onChange={(event) => onHandleChange('confirm_password', event)}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {state.showCPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                            labelWidth={70}
                        />
                        </FormControl>
                    <Button variant="contained" color="primary" onClick={() => onLoginSubmit()}>
                        Register
                    </Button>
                </form>
            </Paper>
        </Grid>
    )
}

export default Register;