import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7657e8",
      dark: "#5b3fd1",
      light: "#9a7df5"
    },
    background: {
      default: "#f7f8fc",
      paper: "#ffffff"
    },
    text: {
      primary: "#171a2b",
      secondary: "#6f7487"
    },
    success: {
      main: "#1fa45b"
    }
  },
  typography: {
    fontFamily:
      '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    },
    MuiTextField: {
      defaultProps: {
        size: "small"
      }
    }
  }
});

export default theme;