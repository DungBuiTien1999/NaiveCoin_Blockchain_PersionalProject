import {Box, Grid, Card, CardContent, CardHeader, Divider, Typography, TextField,Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Loding from '../Loding'
import axios from 'axios';

export const Transaction = (props) => {
  const [toAddress,setToAddress] = useState('')
  const [toAmount,setToAmount] = useState('')

  const handleToAddress = (e)=>{
    console.log(e.target.value)
    setToAddress(e.target.value)
  }
  const handleToAmount = (e)=>{
    setToAmount(e.target.value)
  }
  const sendToAddress = async()=>{
    console.log(toAddress)
      await axios.post("http://localhost:3001/sendTransaction",{address:toAddress,amount:toAmount})
      .then(res=> console.log(res.data))
      .catch(err=>console.error(err))
  }
  return (
    <Card {...props} sx={{backgroundColor:"#0B2840"}}>
      <CardHeader title="노드별 채굴양" sx={{color:"#fff"}}/>
      <Divider />
      <CardContent>
        <Grid sx={{display: 'flex',flexFlow:'column',alignItems:'center'}}>
            <Box>
              <Typography
                color="#fff"
                gutterBottom
                variant="h6" 
                fontWeight={600}
              >
                보낼 주소
              </Typography>
              <TextField id="outlined-basic" variant="outlined" size="small" label="보낼 주소 입력" style={{marginTop:3}} onChange={handleToAddress}/>
              <Typography
                color="#fff"
                gutterBottom
                variant="h6" 
                fontWeight={600}
              >
                보낼 금액
              </Typography>
              <TextField id="outlined-basic" variant="outlined" size="small" label="보낼 금액 입력" style={{marginTop:3}} onChange={handleToAmount}/>
              <Button  variant='contained' onClick={sendToAddress} style={{backgroundColor:"#fff",color:"#536D8B",width:20,marginTop:3, padding:5,border:"2px solid white"}}>전송하기</Button>

            </Box>
        </Grid>
        
      </CardContent>
    </Card>
  );
};
