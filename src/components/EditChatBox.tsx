import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { useState } from "react"

export type EditChatData = {
  id: number,
  idx: number,
  prompt: string,
  handleClose: () => void,
  handleDelete: (id: number, idx: number) => Promise<void>,
  handleUpdate: (id: number, idx: number, newPrompt: string) => Promise<void>
}
export type EditChatBoxProp = {

  open: boolean,
  data: EditChatData,
}
export const EditChatBox = ({ open, data }: EditChatBoxProp) => {
  const { id, idx, prompt, handleClose, handleDelete, handleUpdate } = data;
  const [updatePrompt, setUpdatePrompt] = useState(prompt);
  const [isLoading, setIsLoading] = useState(false);

  const updatePromptHandler = async () => {
    try {
      setIsLoading(true);
      if (updatePrompt.trim().length === 0) return;
      await handleUpdate(id, idx, updatePrompt);

    } catch (error) {
      alert('something went wrong');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const deletePromptHandler = async () => {
    try {
      setIsLoading(true);
      await handleDelete(id, idx);

    } catch (error) {
      alert('something went wrong');
      console.log(error);
    } finally {
      setIsLoading(false);
    }

  }
  return <Dialog
    open={open}
    onClose={handleClose} fullWidth> <DialogTitle>Edit Prompt</DialogTitle>
    <DialogContent>
      <DialogContentText>

      </DialogContentText>
      <TextField
        label="Update Prompt"
        value={updatePrompt}
        onChange={(event => setUpdatePrompt(event.target.value))}
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} disabled={isLoading}>Cancel</Button>
      <Button color="secondary" onClick={updatePromptHandler} disabled={isLoading}>Update Prompt</Button>
      <Button color="error" onClick={deletePromptHandler} disabled={isLoading}>Delete Prompt</Button>
    </DialogActions></Dialog>
}
