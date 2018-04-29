import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import ReactCountdownClock from 'react-countdown-clock';

const spotifyApi = new SpotifyWebApi();

class App extends Component {
    constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      token: '',
      refrest_token: '',
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: ''},
      currentCount: 5,
      clockHidden: true,
      songInfoHidden: true,
      answer: ''
    }
    this.getNowPlaying = this.getNowPlaying.bind(this);
    this.getHashParams = this.getHashParams.bind(this);
    this.toggleClock = this.toggleClock.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getNowPlaying(){
  spotifyApi.getMyCurrentPlaybackState()
    .then((response) => {
      console.log(response)
      this.setState({
        nowPlaying: {
            name: response.item.name,
            albumArt: response.item.album.images[0].url
          }
      });
    })
  }

  getHashParams(){
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  toggleClock(){
    this.setState({
      clockHidden: !this.state.clockHidden
    });
  }

  toggleInfo(){
    this.toggleClock();
    this.setState({
      songInfoHidden: !this.state.songInfoHidden,
    });
  }

  buttonClick(e){
    this.getNowPlaying();

    if(this.state.songInfoHidden){
      this.toggleClock();
    } else {
      this.toggleInfo();
      this.setState({
        answer: ''
      });
    }
  }

  handleChange(event){
    this.setState({
      answer: event.target.value
    });
  }

  handleSubmit(event){
    event.preventDefault();
    this.toggleInfo();
  }

  render() {
    return (
      <div className="App">
        <div className="MainHeader">
        {!this.state.loggedIn &&
          <div>
            <h1>Login to Spotify to use Name That Tune</h1>
          </div>}

          {this.state.loggedIn &&
            <div>
              <h1>Name That Tune</h1>
            </div>}

          <a href="">Request Access From Spotify</a>

        </div>

          <div className="Body">
            <hr />

                <ReactCountdownClock
                  seconds={30}
                  color='#5CC8FF'
                  alpha={0.9}
                  size={720}
                  onComplete={() => this.toggleInfo()}
                />

              <div>
                <h1 className="Header">How Did You Do?</h1>
                <div className="NowPlaying">Now Playing: { this.state.nowPlaying.name }</div>
              </div>

            <br />


              <div>
                <img src={this.state.nowPlaying.albumArt} style={{ height: 650 }}/>
              </div>


              <form onSubmit={this.handleSubmit}>
                <label>
                  <input type="text" value={this.state.answer} placeholder="Enter Your Answer Here" onChange={this.handleChange} />
                </label>
                <input type="submit" value="Check Answer" />
              </form>

            <br />


              <div>
                <h1>Your Answer:<br /></h1>
                <div className="Answer">{this.state.answer}</div>
              </div>

            <br />


              <button className="NowPlayingButton" onClick={() => this.buttonClick()}>
                Check Now Playing
              </button>

          </div>
      </div>
    );
  }
}

export default App;
