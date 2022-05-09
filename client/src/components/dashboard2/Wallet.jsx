import { useState,useEffect } from 'react';
import axios from 'axios'
import { Avatar, Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
export const Wallet = (props) => {
  const [isWallet,setIsWallet] = useState(false)
  const [address, setAddress] = useState('')
  const [balance,setBalance] = useState(0)



  useEffect(() => {
    console.log("유즈이펙트1")
    if (isWallet) {
      const getMyWallet = async()=>{
        await axios.get('http://localhost:3002/myWallet')
        .then(res => {
          setAddress(res.data.address)
          setBalance(res.data.balance)
        })
      }
      getMyWallet()
    }
  }, [isWallet])
  useEffect(() => {
    console.log("유즈이펙트2")
    if (isWallet) {
      const getMyWallet = async()=>{
        await axios.get('http://localhost:3002/myWallet')
        .then(res => {
          setAddress(res.data.address)
          setBalance(res.data.balance)
        })
      }
      getMyWallet()
    }
  }, [props.blocks])


  //==================


  const connectWallet = async() =>{
      await axios.post('http://localhost:3002/connectWallet')
      .then(res=> {
          console.log(res.data)
          if (res.data) {
              alert("지갑 생성 완료")
              setIsWallet(true)
          } else{
              alert("지갑 연결 시 오류 발생")
          }
      })
  }


  return (
    <Card
      sx={{ height: '100%' }}
      {...props}
    >
      <CardContent>
        { isWallet ?
          <Grid
            container
            spacing={4}
            sx={{ justifyContent: 'flex-start',paddingBottom:0 }}
          >
            <Grid item>
                <AccountBalanceWalletOutlinedIcon sx={{color:"#fff",height: 50,width: 50}} />
            </Grid>
            <Grid item sx={{width:270}}>
              <Typography
                color="#fff"
                gutterBottom
                variant="h5" 
                fontWeight={500}
                marginBottom={0}
              >
                Address
              </Typography>
              <Box sx={{color:"#fff",fontWeight:300,fontSize:12 ,wordBreak:"break-all"}}>
              {address}
              </Box>
              <Box> 보유 금액 : {balance}</Box>
            </Grid>
          </Grid> 
        :
            <Box>
              <h2>지갑 연결</h2>
                  <Button onClick={connectWallet}>지갑 연결</Button>
            </Box>
        }
      </CardContent>
    </Card>
);}
