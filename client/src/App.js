import React, { useState, useEffect } from "react";
import PostList from './components/PostsList';
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/posts")
      .then((res) => {
        console.log(res.data);
        setPosts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [updated]);

  const handleChange = (panel) => (event, newExpand) => {
    console.log(panel);
    setExpanded(newExpand ? panel : false);
  }

  return (
    <div className="App">
      {posts.map((post) => (
        <PostList key={post.id} {...post} expanded={expanded} handleChange={handleChange} setUpdated={setUpdated} updated={updated} />
      ))}
    </div>
  );
}

export default App;
