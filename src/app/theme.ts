'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#634947',
        },
        secondary: {
            main: '#496347',
        }
    },
    typography: {
        fontFamily: 'var(--font-roboto)',
    },
    cssVariables: true,

})

export default theme;