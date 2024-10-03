"use client"
import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
      primary: {
        main: "#131946",
      },
      secondary: {
        main: "#FBF355",
      },
    },
    typography: {
      h1: {
        fontSize: '4rem',
        '@media (min-width:600px)': {
          fontSize: '6rem',
        },
        '@media (min-width:960px)': {
          fontSize: '7rem',
        },
      },
      h2: {
        fontSize: '2rem',
        '@media (min-width:600px)': {
          fontSize: '3rem',
        },
        '@media (min-width:960px)': {
          fontSize: '4rem',
        },
      },
      h3: {
        fontSize: '3rem',
        '@media (min-width:600px)': {
          fontSize: '4rem',
        },
        '@media (min-width:960px)': {
          fontSize: '5rem',
        },
      },
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });
  