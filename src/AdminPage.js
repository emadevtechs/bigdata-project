import React, { useState, useEffect } from 'react';
import './App.css';
// import { useMutation, useQuery, gql } from '@apollo/client';
import { fade, makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, useLocation
} from "react-router-dom";
import { useHistory } from "react-router-dom";
import Login from './components/login';
import Register from './components/register';
import UsersList from './components/usersList';
import HomePage from './components/homePage';
import MyProfile from './components/myProfile';
import AdminPage from './components/admin';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  link_style: {
    textDecoration: 'none',
    color: 'white'
  },
  link_style1: {
    textDecoration: 'none',
    color: 'black'
  },
  footer_div: {
    backgroundImage: "url(https://www.shopsite.com/templates/cookbook/theme-images/congruence-stripes-blue.jpg)",// eslint-disable-line react-hooks/exhaustive-deps
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: '30vh',
    position: "absolute",
    bottom: 0
  }
}));


const AdminMainPage = () => {

  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const[isAdmin, setAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userID, setuserId] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    const adminDetails = localStorage.getItem('admin_details');
    console.log('adminDtails', JSON.parse(adminDetails))
    if (adminDetails && JSON.parse(adminDetails) && JSON.parse(adminDetails).email) {
        setAdmin(true)
    } else {
      alert("Login First")
      history.push('/login')
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if(location.pathname){
      if(location.pathname === '/admin'){
        setAdmin(true);
      }
    }
  },[location.pathname])
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link to="/my-profile" className={classes.link_style1}><MenuItem>Profile</MenuItem></Link>
      {userID !== null && <MenuItem onClick={() => onLogoutClick()}>Logout</MenuItem> }
    </Menu>
  );

  const onLogoutClick = () => {
    localStorage.removeItem("admin_details")
    window.location.reload();
  }

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link to="/admin/users-list" className={classes.link_style1}>
          <IconButton aria-label="show 4 new mails" color="inherit">
            <Typography variant="body2" noWrap>
              Users List
                </Typography>
          </IconButton>
        </Link>
      </MenuItem>
      {!isAdmin ?
      <><MenuItem>
        <Link to="/login" className={classes.link_style1}>
          <IconButton aria-label="show 4 new mails" color="inherit">
            <Typography variant="body2" noWrap>
              Login
                </Typography>
          </IconButton>
        </Link>
      </MenuItem>
      </> :
      <MenuItem onClick={() => onLogoutClick()}>
      <IconButton aria-label="show 4 new mails" color="inherit">
        <Typography variant="body2" noWrap>
          Logout
            </Typography>
      </IconButton>
  </MenuItem>}
    </Menu>
  );


  return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Link to="/admin" className={classes.link_style}>
              <Typography className={classes.title} variant="h6" noWrap>
                BigData-Analysis
              </Typography>
            </Link>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Link to="/admin/users-list" className={classes.link_style}>
                <IconButton aria-label="show 4 new mails" color="inherit">
                  <Typography variant="body2" noWrap>
                    User Details
                </Typography>
                </IconButton>
              </Link>
              <Link to="/admin/register" className={classes.link_style}>
                <IconButton aria-label="show 4 new mails" color="inherit">
                  <Typography variant="body2" noWrap>
                    Create User
                </Typography>
                </IconButton>
              </Link>
              {!isAdmin &&
              <><Link to="/login" className={classes.link_style}>
                <IconButton aria-label="show 4 new mails" color="inherit">
                  <Typography variant="body2" noWrap>
                    Login
                </Typography>
                </IconButton>
              </Link>
               </>}
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/admin/register">
            <Register />
          </Route>
          <Route path="/admin/users-list">
            <UsersList />
          </Route>
          <Route path="/admin">
            <AdminPage />
          </Route>
        </Switch>
      </div>
  );
}

export default AdminMainPage;
