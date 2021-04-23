const express = require('express');
const app = express();
const path = require('path');
const mongoUtil = require('./mongoUtil');

const port = process.env.PORT || 3000;

mongoUtil.connect((err) => {
  try {
    if (err) throw new Error(err)
    console.log('db connected')
    const server = app.listen(port, () => {
      console.log('connected at ' + port)
    });

    app.set('view-engine', 'ejs');
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    const staticUrl = path.join(__dirname, 'dist');
    const assetUrl = path.join(__dirname, 'assets');

    app.use(express.static(staticUrl));
    app.use(express.static(assetUrl));
    app.get('/', (req, res) => {
      const filePath = path.join(__dirname, 'static', 'landing', 'index.html');
      res.sendFile(filePath);
    })
    
    const routes = require('./routes');
    app.use(routes);
    app.use((error, req, res, next) => {
      console.log(error)
      const status = error.status || 500
      res.status(status).json({ error: error.message })
    })

    /****** Socket ******/

    /***  clubState ****/
    /* id {
          members: [],
          ellapsedSeconds: 0,
        }
    */

    const options = {}
    const intialState = {
      clubs: {}
    }

    const [getState, updateState] = require('./appState')(intialState)
    const io = require('socket.io')(server, options)
    const db = mongoUtil.getDb();
    const { ObjectID, ObjectId } = require('mongodb');
    const User = db.collection('user');
    const Club = db.collection('club');
    const Video = db.collection('video');
    const Playlist = db.collection('playlist');
    const { playlistRequest } = require('./controller').dbUtil

    io.on('connection', (socket) => {
      socket.on('setUpNs', clubId => {
        clubNs = io.of(`/${clubId}`);

        clubNs.on('connection', socket => {
          socket.on('setUpClub', async userId => {
            const query = { _id: new ObjectID(userId)};
            const user = await User.findOne(query);
            const prevState = getState()
            
            let club; 
            const existingClub = prevState.clubs[user.clubId]
            if (!existingClub) {
              club = {
                members: [user._id],
                ellapsedSeconds: 0
              };
            } else {
              const userActive = existingClub.members.some(
                memberId => memberId.toString() === user._id.toString()
              )
    
              if (userActive) {
                return clubNs.emit('updateClubState', existingClub)
              }
    
              club = {
                ...existingClub,
                members: [...existingClub.members, user._id]
              };
            }
    
            const newState = {
              ...prevState,
              clubs: {
                ...prevState.clubs,
                [user.clubId]: club
              }
            }
    
            updateState(newState);
            const updatedClub = getState().clubs[user.clubId]
            clubNs.emit('updateClubState', updatedClub)
          })
    
          socket.on('updateSeconds', data => {
            const prevState = getState()
            if (prevState.clubs[data.clubId]) {
              const club = {
                members: prevState.clubs[data.clubId].members,
                ellapsedSeconds: data.seconds
              }
    
              const newState = {
                ...prevState,
                clubs: {
                  ...prevState.clubs,
                  [data.clubId]: club
                }
              }
    
              updateState(newState);
            }
          })
    
          socket.on('playNext', async clubId => {
            const club = await Club.findOne({ _id: new ObjectID(clubId) });
            const playlist = await Playlist.findOne({ clubId: new ObjectID(clubId) });
            
            if (playlist.upNext.length < 1) return
            /* 
            Move played video to club's listening history,
            remove the video id for the next video from the
            queue and find the and add it to the currently playing
            field.
            */
            const played = playlist.currentlyPlaying;
            const newVideoId = playlist.upNext.shift()
            const newVideo = await Video.findOne({ _id: new ObjectID(newVideoId) });
         
            const updatePlaylistPromise = Playlist.updateOne(
              { _id: new ObjectId(playlist._id) },
              {
                $set: { currentlyPlaying: newVideo },
                $pop: { upNext: -1 }
              }
            )
    
            const updateClubPromise =  Club.updateOne(
              { _id: new ObjectId(club._id) },
              {
                $push: { listeningHistory: played },
              }
            )
    
            const [
              playlistRes, clubRes
            ] = await Promise.all([
              updatePlaylistPromise,
              updateClubPromise
            ])
    
            const prevState = getState()
            const newClub = {
              members: prevState.clubs[club._id].members,
              ellapsedSeconds: 0
            }
    
            const newState = {
              ...prevState,
              clubs: {
                ...prevState.clubs,
                [club._id]: newClub
              }
            }
    
            updateState(newState);
            const data = await playlistRequest(Playlist, club._id)
    
            const updatedPlaylist ={ 
              playlist: data[0].videoList,
              currentlyPlaying: data[0].currentlyPlaying,
              seconds: getState().clubs[club._id].ellapsedSeconds
            }
    
            clubNs.emit('updatePlaylist', updatedPlaylist)
          })
        })
      })
    })
  } catch (error) {
    console.log(error);
  } 
})





