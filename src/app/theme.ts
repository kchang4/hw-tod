'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#7986cb',
        },
        secondary: {
            main: '#3949ab',
        }
    },
    typography: {
        fontFamily: 'var(--font-roboto)',
    },
    cssVariables: true,

})

export default theme;