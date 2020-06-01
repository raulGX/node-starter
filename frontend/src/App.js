import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
  useHistory,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./Login";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/playlist">
            <Playlist />
          </Route>
          <Route path="/">
            <LoginPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Playlist() {
  let history = useHistory();
  var [key, email] = document.cookie.split("=");
  if (!email) {
    history.push("/");
  }
  email = decodeURIComponent(email);

  // to modify songs use setSongs(['prodigy', 'icky thumb'])
  var [songs, setSongs] = useState([]);
  useEffect(() => {
    axios.get("/music").then((response) => {
      setSongs(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Playlist for {email}</h1>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Song Name</TableCell>
              <TableCell>Date added</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songs.map((song) => (
              <TableRow key={song.name}>
                <TableCell component="th" scope="row">
                  {song.name}
                </TableCell>
                <TableCell>{song.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
