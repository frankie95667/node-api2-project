import React, { useState, useEffect } from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Button,
  Input,
  IconButton
} from "@material-ui/core";
import axios from 'axios';
import { ExpandMore, CheckBox, Send } from "@material-ui/icons";

const PostList = (props) => {
  const [editing, setEditing] = useState(false);
  const [contents, setContents] = useState(props.contents);

  useEffect(() => {

  },[props.updated])

  const updateContent = (e) => {
    e.preventDefault();
    const postData = {
      contents
    }
    axios.put(`http://localhost:5000/api/posts/${props.id}`, postData)
    .then(res => {
      console.log(res.data);
      setEditing(false);
      props.setUpdated(!props.updated);
    })
    .catch(err => console.error(err));
  }

  const deletePost = (e) => {
    e.preventDefault();
    axios.delete(`http://localhost:5000/api/posts/${props.id}`)
    .then(res => {
      console.log(res.data);
      props.setUpdated(!props.updated);
    })
    .catch(err => console.error(err))
  }

  return (
    <ExpansionPanel
      expanded={props.expanded === props.id}
      onChange={props.handleChange(props.id)}
    >
      <ExpansionPanelSummary
        aria-controls={`${props.id}-content`}
        id={`${props.id}-header`}
        expandIcon={<ExpandMore />}
      >
        <Typography variant="h6">{props.title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        style={{ display: "flex", flexDirection: "column", textAlign: "left" }}
      >
        {!editing ? <Typography>{props.contents}</Typography> :
        <Input 
          value={contents} 
          onChange={(e) => setContents(e.target.value)}
          endAdornment={
            <IconButton onClick={updateContent}>
              <Send />
            </IconButton>
          } />
        }
        <div>
          <Button variant="contained" color="primary" onClick={() => {
            setContents(props.contents)
            setEditing(!editing)
            }}>
            Edit
          </Button>
          <Button onClick={deletePost} variant="contained" color="secondary">
            Delete
          </Button>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default PostList;
