import React from 'react'

export default class PlaylistList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    return (
      <div id='playlists'>
      <div id='playlist-topbar'>
        <div className='grab-icon' id='add-playlist'>
          Add New Playlist
        </div>
        <div id='playlist-name'>
          Friday Earbleeds
        </div>
        <div className='add-song-icon' id='add-song'>
          <input id='add-song-input' placeholder='paste song url here' type='text' />
        </div>
      </div>
      <div id='playlist-sidebar'>
        <ul>
          <li>
            <span style={{right: 'auto'}}>Slams</span>
            <span>
              215
            </span>
          </li>
          <li className='selected'>
            <span style={{right: 'auto'}}>Friday Earbleeds</span>
            <span>
              49
            </span>
          </li>
          <li className='queued'>
            <span style={{right: 'auto'}}>Bruneaux</span>
            <span>
              32
            </span>
          </li>
        </ul>
      </div>
      <div id='playlist'>
        <ul>
          <li className='song loading'>
            <div className='title'>
              Owner of a Funky Heart (wallpind sux remix)
            </div>
            <div className='artist'>
              ChipStack
            </div>
            <div className='bottom'>
              <div className='preview'>
                preview
              </div>
              <div className='dj-container'>
                Queued by
                <span className='dj'>
                  wallpind
                </span>
              </div>
            </div>
            <div className='hover-controls'>
              <div className='loader'></div>
            </div>
          </li>
          <li className='song'>
            <div className='title'>
              Owner of a Funky Heart (wallpind sux remix)
            </div>
            <div className='artist'>
              ChipStack
            </div>
            <div className='bottom'>
              <div className='preview'>
                preview
              </div>
              <div className='dj-container'>
                Queued by
                <span className='dj'>
                  wallpind
                </span>
              </div>
            </div>
            <div className='hover-controls'>
              <a className='download circle'>
                d
              </a>
              <div className='grab circle'>
                c
                <ul className='playlist-dropdown'>
                  <li className='added'>
                    Slams
                  </li>
                  <li className='added'>
                    Extra slammy slams
                  </li>
                  <li>
                    Friday earbleeds
                  </li>
                  <li>
                    Bruneaux
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className='song'>
            <div className='title'>
              Owner of a Funky Heart (wallpind sux remix)
            </div>
            <div className='artist'>
              ChipStack
            </div>
            <div className='bottom'>
              <div className='preview'>
                preview
              </div>
              <div className='dj-container'>
                Queued by
                <span className='dj'>
                  wallpind
                </span>
              </div>
            </div>
            <div className='hover-controls'>
              <a className='download circle'>
                d
              </a>
              <div className='grab circle'>
                c
                <ul className='playlist-dropdown'>
                  <li className='added'>
                    Slams
                  </li>
                  <li className='added'>
                    Extra slammy slams
                  </li>
                  <li>
                    Friday earbleeds
                  </li>
                  <li>
                    Bruneaux
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className='song'>
            <div className='title'>
              Owner of a Funky Heart (wallpind sux remix)
            </div>
            <div className='artist'>
              ChipStack
            </div>
            <div className='bottom'>
              <div className='preview'>
                preview
              </div>
              <div className='dj-container'>
                Queued by
                <span className='dj'>
                  wallpind
                </span>
              </div>
            </div>
            <div className='hover-controls'>
              <a className='download circle'>
                d
              </a>
              <div className='grab circle'>
                c
                <ul className='playlist-dropdown'>
                  <li className='added'>
                    Slams
                  </li>
                  <li className='added'>
                    Extra slammy slams
                  </li>
                  <li>
                    Friday earbleeds
                  </li>
                  <li>
                    Bruneaux
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className='song'>
            <div className='title'>
              Owner of a Funky Heart (wallpind sux remix)
            </div>
            <div className='artist'>
              ChipStack
            </div>
            <div className='bottom'>
              <div className='preview'>
                preview
              </div>
              <div className='dj-container'>
                Queued by
                <span className='dj'>
                  wallpind
                </span>
              </div>
            </div>
            <div className='hover-controls'>
              <a className='download circle'>
                d
              </a>
              <div className='grab circle'>
                c
                <ul className='playlist-dropdown'>
                  <li className='added'>
                    Slams
                  </li>
                  <li className='added'>
                    Extra slammy slams
                  </li>
                  <li>
                    Friday earbleeds
                  </li>
                  <li>
                    Bruneaux
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className='song'>
            <div className='title'>
              Owner of a Funky Heart (wallpind sux remix)
            </div>
            <div className='artist'>
              ChipStack
            </div>
            <div className='bottom'>
              <div className='preview'>
                preview
              </div>
              <div className='dj-container'>
                Queued by
                <span className='dj'>
                  wallpind
                </span>
              </div>
            </div>
            <div className='hover-controls'>
              <a className='download circle'>
                d
              </a>
              <div className='grab circle'>
                c
                <ul className='playlist-dropdown'>
                  <li className='added'>
                    Slams
                  </li>
                  <li className='added'>
                    Extra slammy slams
                  </li>
                  <li>
                    Friday earbleeds
                  </li>
                  <li>
                    Bruneaux
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className='song'>
            <div className='title'>
              Owner of a Funky Heart (wallpind sux remix)
            </div>
            <div className='artist'>
              ChipStack
            </div>
            <div className='bottom'>
              <div className='preview'>
                preview
              </div>
              <div className='dj-container'>
                Queued by
                <span className='dj'>
                  wallpind
                </span>
              </div>
            </div>
            <div className='hover-controls'>
              <a className='download circle'>
                d
              </a>
              <div className='grab circle'>
                c
                <ul className='playlist-dropdown'>
                  <li className='added'>
                    Slams
                  </li>
                  <li className='added'>
                    Extra slammy slams
                  </li>
                  <li>
                    Friday earbleeds
                  </li>
                  <li>
                    Bruneaux
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className='song'>
            <div className='title'>
              Owner of a Funky Heart (wallpind sux remix)
            </div>
            <div className='artist'>
              ChipStack
            </div>
            <div className='bottom'>
              <div className='preview'>
                preview
              </div>
              <div className='dj-container'>
                Queued by
                <span className='dj'>
                  wallpind
                </span>
              </div>
            </div>
            <div className='hover-controls'>
              <a className='download circle'>
                d
              </a>
              <div className='grab circle'>
                c
                <ul className='playlist-dropdown'>
                  <li className='added'>
                    Slams
                  </li>
                  <li className='added'>
                    Extra slammy slams
                  </li>
                  <li>
                    Friday earbleeds
                  </li>
                  <li>
                    Bruneaux
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className='song'>
            <div className='title'>
              Owner of a Funky Heart (wallpind sux remix)
            </div>
            <div className='artist'>
              ChipStack
            </div>
            <div className='bottom'>
              <div className='preview'>
                preview
              </div>
              <div className='dj-container'>
                Queued by
                <span className='dj'>
                  wallpind
                </span>
              </div>
            </div>
            <div className='hover-controls'>
              <a className='download circle'>
                d
              </a>
              <div className='grab circle'>
                c
                <ul className='playlist-dropdown'>
                  <li className='added'>
                    Slams
                  </li>
                  <li className='added'>
                    Extra slammy slams
                  </li>
                  <li>
                    Friday earbleeds
                  </li>
                  <li>
                    Bruneaux
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className='song'>
            <div className='title'>
              Owner of a Funky Heart (wallpind sux remix)
            </div>
            <div className='artist'>
              ChipStack
            </div>
            <div className='bottom'>
              <div className='preview'>
                preview
              </div>
              <div className='dj-container'>
                Queued by
                <span className='dj'>
                  wallpind
                </span>
              </div>
            </div>
            <div className='hover-controls'>
              <a className='download circle'>
                d
              </a>
              <div className='grab circle'>
                c
                <ul className='playlist-dropdown'>
                  <li className='added'>
                    Slams
                  </li>
                  <li className='added'>
                    Extra slammy slams
                  </li>
                  <li>
                    Friday earbleeds
                  </li>
                  <li>
                    Bruneaux
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className='song'>
            <div className='title'>
              Owner of a Funky Heart (wallpind sux remix)
            </div>
            <div className='artist'>
              ChipStack
            </div>
            <div className='bottom'>
              <div className='preview'>
                preview
              </div>
              <div className='dj-container'>
                Queued by
                <span className='dj'>
                  wallpind
                </span>
              </div>
            </div>
            <div className='hover-controls'>
              <a className='download circle'>
                d
              </a>
              <div className='grab circle'>
                c
                <ul className='playlist-dropdown'>
                  <li className='added'>
                    Slams
                  </li>
                  <li className='added'>
                    Extra slammy slams
                  </li>
                  <li>
                    Friday earbleeds
                  </li>
                  <li>
                    Bruneaux
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    )
  }

}
