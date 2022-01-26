import {Box, Card, CardContent, Grid, Typography } from '@mui/material';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import axios from 'axios';
import { useState,useEffect } from 'react';


export const BlockCount = (props) => {
  const [allBlocks,setAllBlocks] = useState(0)

  useEffect(() => {
    const getAllBlocks = async()=>{
        await axios.get('http://localhost:3001/blocks').then(res=>{
            console.log(res.data)  
            console.log(res.data.length)  
            setAllBlocks(res.data.length)
            setMyBlock(res.data)
        }).catch(err=>{console.error(err)})

      }

    getAllBlocks()
  }, [props.blocks])
 
  return (
  <Card
    sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={1}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
            <RequestQuoteIcon sx={{color:"#fff", height: 50,width: 50}}/>
        </Grid>
        <Grid item>
          <Typography
            color="#fff"
            gutterBottom
            variant="h5" 
            fontWeight={500}
          >
            Block
            <Box style={{fontSize:28,marginLeft:20,marginTop:10}}><b>{allBlocks}</b></Box>
          <Typography
            color="#fff"
            variant="h5"
          >
          </Typography>
          </Typography>
          <Typography
            color="#fff"
            variant="h5"
          >
          </Typography>
        </Grid>
        <Grid item>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
        }
  
