import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import http from "axios";
import config from "./Config.json";
import httpMethods from "./services/httpService";
import { Toast } from "bootstrap";

function App() {
  const [posts, setPosts] = useState([]);
  const { apiEndPoint } = config;

  async function getResults() {
    const results = await httpMethods(config);
    console.log("Bring on the data");
    setPosts(results.data);
  }

  useEffect(() => {
    getResults();
  }, []);

  const handleAdd = async () => {
    const obj = { title: "a title", body: "a body" };
    const results = await http.post(config, obj);
    setPosts([results.data, ...posts]);
    console.log("Added");
  };

  const handleUpdate = async (post) => {
    post.title = "UPDATED A TITLE";
    await http.put(apiEndPoint + "/" + post.id, post);

    const index = posts.indexOf(post);
    posts[index].title = post.title;

    setPosts(
      posts.map((p) => {
        return p;
      })
    );
    console.log("Update", post);
  };

  // const handleDelete = async (post) => {
  //   await axios.delete(apiEndPoint + "/" + post.id);
  //   setPosts(posts.filter((p) => p.id !== post.id));
  //   console.log("Delete", post);
  // };
  //  PESSIMISTIC APPROACH

  // OPTIMISTIC APPROACH
  const handleDelete = async (post) => {
    const originalPosts = posts;
    setPosts(post.filter((p) => p.id != post.id));

    try {
      await http.put(config + "/" + post.id);
    } catch (error) {
      if (error.response && error.response.status === 404)
        console.log("Something failed while deleting a post!");
      else {
        console.log("Logging the error", error);
        alert("An unexpected error occured");
      }
      setPosts(originalPosts);
    }
  };

  return (
    <Toast>
      <div className="App">
        <button className="btn btn-primary mt-2" onClick={handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleUpdate(post)}>
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(post)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Toast>
  );
}

export default App;
