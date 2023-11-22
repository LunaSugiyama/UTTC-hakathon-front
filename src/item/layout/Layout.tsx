import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, styled, Drawer, List, ListItem, ListItemText, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logout from '../../components/user/Logout';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Curriculum } from '../../interfaces/Curriculum';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import SchoolIcon from '@mui/icons-material/School'; 
import HomeIcon from '@mui/icons-material/Home'; 
import Fab from '@mui/material/Fab';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import { ThemeProvider } from '@emotion/react';
import CustomTheme from '../../item/theme/CustomTheme';

const drawerWidth = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#004d40', // Green
}));

interface LayoutProps {
  children: React.ReactNode;
}

const drawerListStyle = {
  paddingTop: '64px' // Adjust this value based on your AppBar's height
};

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
}));

const MainContent = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })< { open: boolean } >(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    marginLeft: drawerWidth,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [curriculumData, setCurriculumData] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = Cookies.get('token'); // Get your token here
    axios
      .get('https://uttc-hakathon-front.vercel.app/curriculums/showall', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCurriculumData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching curriculum data: ', error);
      });
  }, []);

  const handleCurriculumClick = (curriculumId: number) => {
    // Replace with your navigation logic
    navigate(`/curriculum/${curriculumId}`);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCurriculumEdit = () => {
    // Replace with your navigation logic
    navigate('/curriculums/edit');
  };
  
  const handleHomeClick = () => {
    // Replace with your navigation logic
    navigate('/item');
  }

  const handleProfileClick = () => {
    // Replace with your navigation logic
    navigate('/user');
  };

  return (
    < ThemeProvider theme={CustomTheme}>
    <>
      <StyledAppBar position="fixed">
      <StyledToolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <div style={{display: 'flex', alignItems: 'center'}}>
          <Logout />
          <IconButton 
            edge="end" 
            color="inherit" 
            aria-label="profile" 
            onClick={handleProfileClick}
          >
            <ProfileIcon />
          </IconButton>
          </div>
        </StyledToolbar>
      </StyledAppBar>
      <StyledDrawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        <div style={drawerListStyle}>
          <div style={{ padding: '16px', fontSize: '20px', fontWeight: 'bold' }}>
            Curriculums
          </div>
          <Divider />
          <List>
            {curriculumData.map((curriculum: Curriculum) => (
              <ListItem button key={curriculum.id} onClick={() => handleCurriculumClick(curriculum.id)}>
                <ListItemIcon>
                  <SchoolIcon /> {/* Replace with desired icon */}
                </ListItemIcon>
                <ListItemText primary={curriculum.name} />
              </ListItem>
            ))}
          </List>
        </div>
        <Button style={{color:'#004d40'}} onClick={handleCurriculumEdit}>Edit</Button>
      </StyledDrawer>
      <MainContent open={drawerOpen}>
        <Toolbar /> {/* Spacer */}
        {children}
        <Fab 
          color="primary" 
          aria-label="home" 
          style={{ position: 'fixed', right: 20, bottom: 20 }} 
          onClick={handleHomeClick}
        >
          <HomeIcon />
        </Fab>
      </MainContent>
    </>
    </ThemeProvider>
  );
};


export default Layout;
