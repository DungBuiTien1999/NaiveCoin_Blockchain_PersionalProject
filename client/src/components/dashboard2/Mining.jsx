import { Card, CardContent, Grid, Typography, Button,Box,TextField } from '@mui/material';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import axios from 'axios';
import { useState } from 'react';

export const Mining = (props) =>{
  const [transaction,setTransaction] = useState('')
  
  const minning = async()=>{

    // props.onCreate(startTime)
    // props.onCreate(finishTime)
    
    await axios.post('http://localhost:3002/mineBlock',{data:transaction}).then(res=>{
      console.log("받은 데이터",res.data)
      props.onCreate(res.data)
    })
  }



  const handleTransaction = (e) =>{
    console.log(e.target.value)
    setTransaction(e.target.value)   
}
  return (
  <Card {...props}>
    <CardContent>
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
              <ConstructionOutlinedIcon sx={{color:"#fff",height: 50,width: 50}} />
          </Grid>
        <Grid item sx={{width:270}}>
          <Typography
            color="#fff"
            gutterBottom
            variant="h5" 
            fontWeight={500}
          >
            Mining
          </Typography>
          <Box>
            <TextField id="outlined-basic" variant="outlined" label="거래 내용 입력란" size="small" style={{width:120}} onChange={handleTransaction}/>
          <Button variant='outlined'  style={{backgroundColor:"#fff",color:"#7070E3",width:120, height:40,marginLeft:10,border:"2px solid white"}} onClick={minning}>
          <b style={{fontSize:16}}>
          start

          </b>
        </Button>
          </Box>
        </Grid>
        <Grid item>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
}