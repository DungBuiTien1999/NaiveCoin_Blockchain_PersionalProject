import { Avatar, Box, Card, CardContent, Grid, Typography, Button, TextField } from "@mui/material";
import ConnectWithoutContactOutlinedIcon from "@mui/icons-material/ConnectWithoutContactOutlined";
import { useState, useEffect } from "react";
import axios from "axios";

export const Network = (props) => {
  const [nodeChech, setNodeCheck] = useState(0);
  const [inputPort, setInputPort] = useState();
  const [connectPort, setConnectPort] = useState([]);

  const addNode = async () => {
    await axios.post("http://localhost:3002/addPeer", { port: inputPort }).then((res) => {
      alert(res.data.msg);
      console.log(res.data);
      console.log(connectPort);
      setConnectPort([...connectPort, res.data.port]);
    });
  };

  const handlePort = (e) => {
    setInputPort(e.target.value);
  };

  useEffect(() => {
    const onNode = async () => {
      await axios
        .get("http://localhost:3001/chenkOn")
        .then((res) => {
          if (res.data == true) {
            setNodeCheck(nodeChech + 1);
          }
        })
        .catch(() => {
          console.log(" 서버가 열려있지 않습니다.");
        });

      await axios
        .get("http://localhost:3002/chenkOn")
        .then((res) => {
          if (res.data == true) {
            setNodeCheck(nodeChech + 1);
          }
        })
        .catch(() => {
          console.log(" 서버가 열려있지 않습니다.");
        });

      await axios
        .get("http://localhost:3003/chenkOn")
        .then((res) => {
          if (res.data == true) {
            setNodeCheck(nodeChech + 1);
          }
        })
        .catch(() => {
          console.log(" 서버가 열려있지 않습니다.");
        });
    };
    onNode();
  }, []);

  return (
    <Card {...props}>
      <CardContent>
        <Grid container sx={{ justifyContent: "space-around" }}>
          <Typography color="#fff" gutterBottom variant="h6" fontWeight={600}>
            Node
            <Box>
              <TextField
                id="outlined-basic"
                variant="outlined"
                size="small"
                label="port 입력"
                style={{ width: 75, marginRight: 5, marginTop: 3 }}
                onChange={handlePort}
              />
              <Button
                variant="contained"
                onClick={addNode}
                style={{
                  backgroundColor: "#fff",
                  color: "#536D8B",
                  width: 20,
                  marginTop: 3,
                  padding: 5,
                  border: "2px solid white",
                }}
              >
                <ConnectWithoutContactOutlinedIcon />
              </Button>
            </Box>
          </Typography>
          <Typography color="#fff" gutterBottom variant="h6" fontWeight={600}>
            Network Node
            <Box>
              {connectPort &&
                connectPort.map((port) => {
                  return <div style={{ color: "#fff", fontWeight: 400, fontSize: 16 }}>{port}</div>;
                })}
            </Box>
          </Typography>
        </Grid>
      </CardContent>
    </Card>
  );
};
