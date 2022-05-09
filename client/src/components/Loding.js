import ClipLoader from "react-spinners/ClipLoader";
import React from 'react'
import { Box, Typography } from '@mui/material';



const Loding = () => {
    return (
        <Box>
            <Typography
            color="#fff"
            gutterBottom
            variant="h4" 
            fontWeight={500}
          ></Typography>
            <ClipLoader color={color} size={150}/>
        </Box>
    )
}

export default Loding
