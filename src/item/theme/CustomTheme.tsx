import { createTheme, ThemeProvider } from '@mui/material/styles';


// Create a green theme
const CustomTheme = createTheme({
    palette: {
      primary: {
        main: '#004d40', // Dark Green
      },
      secondary: {
        main: '#a5d6a7', // Light Green
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            transition: '0.3s',
            '&:hover': {
              boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            margin: '10px',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            marginBottom: '10px',
          },
        },
      },
    },
  });

export default CustomTheme;