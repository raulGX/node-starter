import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function App() {
  // to modify songs use setSongs(['prodigy', 'icky thumb'])
  var [songs, setSongs] = useState([]);
  useEffect(() => {
    axios.get("/music").then((response) => {
      setSongs(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Playlist</h1>
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
