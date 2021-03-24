import React, {useState, useEffect}from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { gql, useLazyQuery } from '@apollo/client';
import { Container, ListItem, List, Divider, ListItemText, Paper, ListItemAvatar, Avatar, Typography,  } from '@material-ui/core';

const SELECT_USER = gql`
query MyQuery($id: uuid) {
    user(where: {id: {_eq: $id}}) {
      id
      username
      email
    }
  }
  `;

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        width: "100%",
        flexDirection: 'column'
    },
    headerStyle: {
        backgroundImage: "url(https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350)", // eslint-disable-line prefer-template
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: "100%",
        height: '30vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerStyle3: {
        backgroundImage: "url(https://image.freepik.com/free-vector/file-transfer-map-background-hands-holds-phone-with-uploading-files-flat-design-transferring-documents-two-smartphones_168129-139.jpg)", // eslint-disable-line prefer-template
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        width: "100%",
        height: '30vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerStyle2: {
        backgroundImage: "url(https://www.modulebazaar.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/f/i/file_upload.jpg)", // eslint-disable-line prefer-template
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        width: "100%",
        height: '30vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    root: {
        width: '100%',
        // maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
      },
      paperCon: {
        marginTop: 10,
        display: 'flex',
        alignItems: 'center'
      },
      paperCon1: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '45vh',
        height: '40vh',
        marginRight: 15,
      },
      tabStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
        marginBottom: "10px",
      },
      textstyle: {
          padding: 10,
          textAlign: 'right'
      },
      textstyle1: {
        padding: 10,
        textAlign: 'left'
    },
    textstyle2: {
        padding: 10,
        textAlign: 'center'
    },
      large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
      },
}));

const HomePage = () => {

    const classes = useStyles();
    const [getUser, { loading, data, error }] = useLazyQuery(SELECT_USER);
    const[state,setState] = useState({
        userDetails: null,
        userId: null
    })

    console.log('getuser details', loading, data,error);

    useEffect(() => {
        if(data){
            if(data && data.user && data.user[0] && data.user[0].id){
                setState({...state, userDetails: data.user[0]})
            }
        }
    },[data]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            console.log('user id', userId);
          setState({...state, userId: userId});
            getUser({ variables: {
                id: userId
            } })
        } else {
            console.log('no id found');
        //   alert("Login First")
        //   history.push('/login')
        }
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classes.container}>
            <Container maxWidth="lg">
            <div className={classes.headerStyle}>
                <Typography style={{ color: 'white' }} align="left" variant="h5">{ state.userDetails ? "Hi " + state.userDetails.username : "BigData-Analysis" }</Typography>
            </div>
            <Paper elevation={3} className={classes.paperCon}>
                <div>
                    <Typography component="span"
                                    variant="body2"
                                    align="right"
                                    className={classes.textstyle}
                                    color="textPrimary">
                        Its Main Purpose is to share data and retrieve data from anywhere. So e can implement this project.Feel feee to work.It isn't good idea to always backup and transfer the whole file to and fro as it takes more space!!
                    </Typography>
                </div>
                <div className={classes.headerStyle3}>

                </div>
            </Paper>
            <Paper elevation={3} className={classes.paperCon}>
                <div className={classes.headerStyle2}>

                </div>
                <div>
                    <Typography component="span"
                                    variant="body2"
                                    align="left"
                                    className={classes.textstyle1}
                                    color="textPrimary">
                        Whenever we want to sync the same file in different clients or keep multiple version of the file to provide history of updates to the file. It isn't good idea to always backup and transfer the whole file to and fro as it takes more space!!
                    </Typography>
                </div>
            </Paper>
            <div className={classes.tabStyle}>
                <Paper elevation={3} className={classes.paperCon1}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.large} />
                    <Typography component="span"
                                    variant="body2"
                                    align="center"
                                    className={classes.textstyle2}
                                    color="textPrimary">
                        Use Cloudinary’s durable storage or your own storage bucket to backup and archive assets, complete with version control.
                    </Typography>
                </Paper>
                <Paper elevation={3} className={classes.paperCon1}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.large} />
                    <Typography component="span"
                                    variant="body2"
                                    align="center"
                                    className={classes.textstyle2}
                                    color="textPrimary">
                        Start small or get unlimited storage and automatically scale up or down, as needed.
                    </Typography>
                </Paper>
                <Paper elevation={3} className={classes.paperCon1}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.large} />
                    <Typography component="span"
                                    variant="body2"
                                    align="center"
                                    className={classes.textstyle2}
                                    color="textPrimary">
                        All assets that are stored on Cloudinary are always available and supported by our service level agreement (SLA).
                    </Typography>
                </Paper>
            </div>
            <List className={classes.root}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                        primary="Brunch this weekend?"
                        secondary={
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                >
                                    Ali Connors
              </Typography>
                                {" — it's easy way to upload your data"}
                            </React.Fragment>
                        }
                    />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                        primary="Summer BBQ"
                        secondary={
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                >
                                    to Scott, Alex, Jennifer
              </Typography>
                                {" — sync with your email and share and retrieve your data anyhere"}
                            </React.Fragment>
                        }
                    />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                        primary="Oui Oui"
                        secondary={
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                >
                                    Sandra Adams
              </Typography>
                                {' — communicate with you friends and share link'}
                            </React.Fragment>
                        }
                    />
                </ListItem>
            </List>
            </Container>
        </div>
    )
}

export default HomePage;