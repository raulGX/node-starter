import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./Login";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

function App() {
  var [key, email] = document.cookie.split("=");
  const onLogout = () => {
    document.cookie = "";
    window.location.href = "/";
  };
  return (
    <Paper>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography align="right" variant="h6"></Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <MenuList id="simple-menu" keepMounted open>
              <MenuItem>{}</MenuItem>
              <MenuItem>My account</MenuItem>
              <MenuItem onClick={onLogout}>
                <a>Logout</a>
              </MenuItem>
            </MenuList>
          </Grid>
          <Grid item xs={9}>
            <Switch>
              <Route path="/playlist">
                <Playlist />
              </Route>
              <Route path="/">
                <LoginPage />
              </Route>
            </Switch>
          </Grid>
        </Grid>
      </Router>
    </Paper>
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
  var [newSongValue, setNewSongValue] = useState("");
  var [newGenre, setNewGenre] = useState("");
  var [searchField, setSearchField] = useState("");
  useEffect(() => {
    axios.get("/music").then((response) => {
      setSongs(response.data);
    });
  }, []);

  const onAddSong = (e) => {
    e.preventDefault();
    axios
      .post("/music", { name: newSongValue, date: new Date(), genre: newGenre })
      .then((d) => {
        axios.get("/music").then((response) => {
          setSongs(response.data);
          setNewSongValue("");
          setNewGenre("");
        });
      });
  };

  const filteredSongs = songs.filter((s) => {
    if (s.name.toLowerCase().includes(searchField.toLowerCase())) {
      return true;
    }
    if (s.genre && s.genre.toLowerCase().includes(searchField.toLowerCase())) {
      return true;
    }
  });

  const classes = useStyles();

  return (
    <div>
      <h1>Playlist for {email}</h1>
      <TextField
        label="Search song"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Song Name</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Date added</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSongs.map((song) => (
              <TableRow key={song.name}>
                <TableCell component="th" scope="row">
                  {song.name}
                </TableCell>
                <TableCell>{song.genre}</TableCell>
                <TableCell>{song.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <form onSubmit={onAddSong}>
        <p>Add a new song:</p>
        <TextField
          label="Name"
          value={newSongValue}
          onChange={(e) => setNewSongValue(e.target.value)}
        />
        <RadioGroup
          aria-label="genre"
          name="genre"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
        >
          <FormControlLabel value="pop" control={<Radio />} label="Pop" />
          <FormControlLabel value="rock" control={<Radio />} label="Rock" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <Button color="primary" variant="contained" type="submit">
          Add Song
        </Button>
      </form>
    </div>
  );
}

export default App;
