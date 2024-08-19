import { OpenInFull, Refresh, Close, CloseFullscreen, Assistant, Person, Send } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, Divider, Grid, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatApi } from "../api/ChatApi";
import { ApiClientContext } from "../providers/ApiClientProvider";
import { AuthContext } from "../providers/AuthProvider";
import { ChatBox, ChatData, Sender } from "./ChatBox";
import { EditChatBox, EditChatBoxProp, EditChatData } from "./EditChatBox";
import { ScreenItem } from "./ScreenItem";


export const ChatComponent = () => {
  const apiClient = useContext(ApiClientContext);
  const { state, action } = useContext(AuthContext);
  const chatApi = new ChatApi(apiClient);
  const accessToken = state.token;



  const [sessionId, setSessionId] = useState<number>(NaN);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [disablePrompt, setDisablePrompt] = useState<boolean>(false);
  const [editData, setEditData] = useState<EditChatData>({} as EditChatData);
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  const [chats, setChats] = useState<Array<ChatData>>([]);
  useEffect(() => {
    createNewSession();
  }, []);




  const removeAuth = () => {
    localStorage.clear();
    action({ isAuth: false, token: undefined });
  }

  if (typeof accessToken !== 'string') {
    removeAuth();
    return <></>;
  }


  const handleClose = () => {
    setOpenEdit(false);
  }



  const handleDelete = async (id: number, idx: number) => {
    try {
      const result = await chatApi.deleteChat(id, { sessionId, accessToken });
      if (result.isOk()) {
        setChats(chats.filter((chatData) => chatData.id !== id));
        setOpenEdit(false);

        return;
      }
      if (result.unwrapErr().status === 404) {
        setChats(chats.filter((chatData) => chatData.id !== id));
        setOpenEdit(false);
        return;
      }
      alert('Something went wrong!');
      console.log(result);
    } catch (error) {
      alert('Something went wrong');
      console.log(error);
    }
  }

  const handleUpdate = async (id: number, idx: number, prompt: string) => {
    try {
      const result = await chatApi.updateChat(id, { sessionId, accessToken, prompt });
      if (result.isOk()) {
        chats[idx].message = prompt;
        chats[idx + 1].message = result.unwrap().response;
        setChats(chats);
        setOpenEdit(false);
        return;
      }
      alert('Something went wrong!');
      console.log(result);
    } catch (error) {
      alert('Something went wrong');
      console.log(error);
    }

  }

  const handleClickOnEditButton = (idx: number, id: number, prompt: string) => {
    return () => {

      setEditData({
        id,
        idx,
        prompt,
        handleClose,
        handleDelete,
        handleUpdate,
      });
      setOpenEdit(true);


    }
  }


  const toggleFullScreen = () => {
    setFullscreen(!fullscreen);
  };


  const createNewSession = async () => {
    setIsLoading(true);
    try {
      if (!state.token) {
        removeAuth();
        return;
      }
      const result = await chatApi.createChatSession({ accessToken: state.token });
      if (result.isOk()) {
        setSessionId(result.unwrap());
        return;
      }

      const clientErr = result.unwrapErr();
      if (clientErr.status === 401) {
        removeAuth();
      } else {
        alert('Something went wrong!');
        console.log(clientErr);
      }
    } catch (error) {
      alert('Something went wrong');
      console.log(error);
    } finally {
      setIsLoading(false);
      setChats([{
        id: 0,
        message: 'Hi, How can i help you?',
        sender: Sender.ROBOT,
      }])
    }
  };



  if (isLoading) return <CircularProgress />;

  const sendPrompt = async () => {
    setDisablePrompt(true);
    if (prompt.trim().length === 0) {
      setDisablePrompt(false);
      return;
    }
    if (!state.token) {
      removeAuth();
      return;
    }
    try {

      const result = await chatApi.createChat({
        prompt,
        accessToken: state.token,
        sessionId,
      });

      if (result.isOk()) {
        const chatData = result.unwrap();
        chats.push({
          id: chatData.id,
          message: chatData.prompt,
          sender: Sender.USER,
        });
        chats.push({
          id: chatData.id,
          message: chatData.response,
          sender: Sender.ROBOT,
        });
        setChats(chats);
      } else {
        if (result.unwrapErr().status === 401) {
          removeAuth();
          return;
        }
        alert('Something went wrong');
        console.log(result);
      }

    } catch (error) {
      alert('something went wrong!');
      console.log(error);
    } finally {
      setDisablePrompt(false);
      setPrompt('');
    }
  }


  return (
    <ScreenItem fullscreen={fullscreen}>
      {openEdit && <EditChatBox
        data={editData}
        open={openEdit}
      />}

      <Stack >

        {/**Top Control Bar**/}
        <Grid
          container
          justifyContent="space-evenly"
          alignItems="flex-start">
          <Grid item xs={1}>
            <IconButton onClick={toggleFullScreen}>{fullscreen ? <CloseFullscreen /> : <OpenInFull />}</IconButton>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={createNewSession}><Refresh /></IconButton>
          </Grid>

          <Grid item xs={9}>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={removeAuth}><Close /></IconButton>
          </Grid>
        </Grid>
        {/**Top Control Bar**/}
        <Box display={'flex'} flexDirection='column' alignItems={'center'} padding={1} >
          <Avatar style={{ background: '#bdaff5' }}>
            <Assistant />
          </Avatar>
          <Typography component={'h1'} variant='h5' style={{ fontWeight: 700 }}>
            Hi👋 I'm A Robot
          </Typography>
          <Typography component={'h2'} variant='caption' style={{ fontWeight: 700, color: '#8c93a5' }}>
            I am a chat bot that is built with gpt as backend.
          </Typography>
        </Box>

        {/** ScrollView for chats**/}
        <Box height={fullscreen ? '75vh' : 600} maxHeight={fullscreen ? '75vh' : 600} sx={{ overflow: 'auto' }} display="flex" flexDirection={'column'} alignItems='center'>
          {chats.map((chatData, idx) => {
            return <ChatBox chatData={chatData} key={idx} editMethodCallBack={handleClickOnEditButton(idx, chatData.id, chatData.message)} />
          })}
        </Box>
        {/**Send Messages**/}
        <Divider />
        <Grid container sx={{ my: 2 }} columnGap={3}>
          <Grid item xs={1}> <Avatar sx={{ width: 52, height: 52, background: '#bdaff5' }}><Person /></Avatar> </Grid>
          <Grid item xs={10}>
            <TextField
              id="prompt-input-box"
              multiline
              label='Prompt'
              value={prompt}
              variant="standard"
              InputProps={{ endAdornment: < InputAdornment position="end" > {disablePrompt ? <CircularProgress /> : <IconButton disabled={disablePrompt} onClick={sendPrompt}><Send /></IconButton>} </InputAdornment>, disableUnderline: true }}
              fullWidth
              onChange={(event) => setPrompt(event.target.value)}
              disabled={disablePrompt}
            />
          </Grid>
        </Grid>

      </Stack>
    </ScreenItem >
  );
}
