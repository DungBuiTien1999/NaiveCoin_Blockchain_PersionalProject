import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { BlockCount } from '../components/dashboard2/BlockCount';
import { BlockList } from '../components/dashboard2/BlockList';
import { Log } from '../components/dashboard2/Log';
import { Wallet } from '../components/dashboard2/Wallet';
import { Network } from '../components/dashboard2/Network';
import { Mining } from '../components/dashboard2/Mining';
import { Transaction } from '../components/dashboard2/Transaction';
import { TransactionPool } from '../components/dashboard2/TransactionPool'
import { DashboardLayout } from '../components/dashboard-layout';
import {useState} from 'react'
const Node2 = () => {
  
  
  const [blockLength,setBlockLength] = useState(0)
  // const [block,setBlock] = useState()
  // const [miningResult,setMiningResult] = useState([])
  
  
  const handleBlockLength = (data)=>{
    console.log("데이통 : ",data.index)
    setBlockLength(data.index)
    // setBlock(data[0])
    // setMiningResult([data[1],...miningResult]) //메세진데 일단 보류
  }
  
  return (
     <DashboardLayout >
    <Head>
      <title>
        Dashboard | Material Kit
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
      >
      <Container maxWidth={false} >
        <Grid
          container
          spacing={3}
          
          >
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
            >
            <Mining style={{backgroundColor:"#7070E3"}} sx={{ height: '95%' }} onCreate={handleBlockLength}/>
            {/* onCreate={handleBlockLength} */}
          </Grid>

          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
            >
            <Wallet blocks={blockLength} sx={{ height: '95%' }} style={{backgroundColor:"#5A78F0"}}/>  
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
            >
            <BlockCount blocks={blockLength} sx={{ height: '95%' }} style={{backgroundColor:"#25B0E8"}}/>
            {/* blocks={blockLength} */}
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
            >
            <Network sx={{ height: '95%' }} style={{backgroundColor:"#536D8B"}}/>
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={6}
            xs={12}
            >
              {/* resultmsg={miningResult} 메세지 속성인데 일단 보류 */}
            <Log />

          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={3}
            xs={12}
            >
              {/* resultmsg={miningResult} 메세지 속성인데 일단 보류 */}
            <TransactionPool />

          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={3}
            xs={12}
            >
            <Transaction sx={{ height: '100%' }}/>
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
            >
            <BlockList blocks={blockLength}/>

          </Grid>
        </Grid>
      </Container>
    </Box>

    </DashboardLayout>
  )
}


export default Node2;
