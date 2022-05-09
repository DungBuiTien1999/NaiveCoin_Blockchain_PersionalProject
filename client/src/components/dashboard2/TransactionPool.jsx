import React from 'react';

import { Box, Card, CardContent, CardHeader, Divider,Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

export const TransactionPool = (props) => {
  return (
    <Card {...props}>
      <CardHeader
        title="트랜잭션 풀"
      />
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
                    block_Index
                  </TableCell>
                  <TableCell>
                    type
                  </TableCell>
                  <TableCell>
                    result
                  </TableCell>
                  
                </TableRow>
            </TableHead>
            {/* <TableBody>
              {message && message.map(msg=>{
                return(
                <TableRow >
                  <TableCell sx={{color:"#333D4B",fontWeight:600}}>
                    {msg.blockIndex}
                  </TableCell>
                  <TableCell sx={{color:"#333D4B",fontWeight:700}}>
                    {msg.type}
                  </TableCell>
                  <TableCell style={result =="실패"? {color:"red"}:{color:"#28B83E"}} sx={{fontWeight:700}}>
                    {msg.result}
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody> */}
          </Table>
        </Box>
      </CardContent>
    </Card>
  )
};

export default TransactionPool;
