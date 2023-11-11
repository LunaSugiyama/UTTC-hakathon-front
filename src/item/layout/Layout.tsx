import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, styled, Drawer, List, ListItem, ListItemText, Theme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logout from '../../components/user/Logout';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Curriculum } from '../../interfaces/Curriculum';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import SchoolIcon from '@mui/icons-material/School'; // Example icon for curriculums


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
      .get('http://localhost:8000/curriculums/showall', {
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
  

  return (
    <>
      <StyledAppBar position="fixed">
      <StyledToolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Logout />
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
      </StyledDrawer>
      <MainContent open={drawerOpen}>
        <Toolbar /> {/* Spacer */}
        {children}
      </MainContent>
    </>
  );
};


export default Layout;
