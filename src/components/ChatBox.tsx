import { Assistant, Edit, Person } from "@mui/icons-material";
import { Grid, Avatar, Paper, Typography, IconButton } from "@mui/material";
import { RefObject, useState } from "react";

export enum Sender {
  USER,
  ROBOT
}

export type ChatData = {
  id: number,
  message: string;
  sender: Sender
}

export type ChatBoxProp = {
  chatData: ChatData,
  editMethodCallBack: () => void
}
export const ChatBox = ({ chatData, editMethodCallBack }: ChatBoxProp) => {
  const [hovering, setHovering] = useState(false);

  const isRobot = chatData.sender === Sender.ROBOT;
  const icon = isRobot ? <Assistant /> : <Person />;
  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{ padding: 0, margin: 0, width: '100%' }}>
      <Grid container spacing={2} direction={isRobot ? 'row' : 'row-reverse'} sx={{ my: 1 }}  >
        <Grid item >
          <Avatar style={{ background: '#bdaff5' }}>
            {icon}
          </Avatar>
        </Grid>
        <Grid item sx={{ width: 300 }}><Paper sx={{ backgroundColor: isRobot ? '#f8fbfb' : '#bdaff5', p: 2 }} >


          <Typography>{chatData.message.trim()}</Typography>

        </Paper></Grid>
        {
          (!isRobot && hovering) && <Grid item display={'flex'} direction='column' alignItems={'center'}>
            <Avatar sx={{ mt: 1 }}> <IconButton onClick={editMethodCallBack}> <Edit /></IconButton></Avatar>
          </Grid>
        }
      </Grid>
    </div>

  );
};
