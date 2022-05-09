import React ,{useState} from 'react';
import ReplayIcon from '@mui/icons-material/Replay';
import axios from 'axios'
import { Box, Card, CardContent, CardHeader, Divider,Table,
  Grid,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { set } from 'nprogress';

export const TransactionPool = (props) => {

  const [pool, setPool] = useState()

  const getTransactionPool = async()=>{
    await axios.get("http://localhost:3001/transactionPool")
    .then(res => {
      setPool(res.data)
      console.log(res.data[0].txOuts[0].amount)
    })
    .catch(console.error)
  }
  return (
    <Card {...props}>
       <Grid sx={{display:"flex"}}>
          <CardHeader
            title="트랜잭션 풀"
          />
          <Button type='submit' onClick={getTransactionPool} sx={{margin:0,padding:0}}>
            <ReplayIcon sx={{width:35,color:"#333D4B"}}/>
          </Button>

       </Grid>
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Table>
            <TableHead>
                <TableRow>
                  <TableCell>
                    Tx Ins {}
                  </TableCell>
                  <TableCell>
                    Tx Ins {}
                  </TableCell>
                  <TableCell>
                    Tx Outs {"(주소 => 금액)"}
                  </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {pool && pool.map(tx=>(
                <TableRow>
                    {tx.txIns.map(txIn => (
                      <>
                        <TableCell>
                            <>
                            <span>{txIn.txOutIndex }</span><br />
                            </>
                        </TableCell>
                        <TableCell> 
                            <>
                            <span>{txIn.txOutId.slice(0,8) + "...." }</span><br />
                            </>
                          
                        </TableCell>

                      </>
                    ))}
                  <TableCell  ll sx={{color:"#333D4B",fontWeight:600}}>            
                    {tx.txOuts.map(txOut => (
                      <>
                      <span>{txOut.address.slice(0,9) + ".... => " +  txOut.amount}</span><br />
                      </>
                    ))}
                  </TableCell>
                </TableRow>
              )
              )}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  )
};

export default TransactionPool;
