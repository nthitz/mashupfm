var React = require('react')

export default function VoteButtons(props) {
  return (
    <div>
      <div className="circle" id="upvote">
        b
      </div>
      <div className="grab circle" id="grab">
        c
        <ul className="playlist-dropdown">
          <li className="added">
            Slams
          </li>
          <li className="added">
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
      <div className="circle" id="downvote">
        a
      </div>
    </div>
  )

}

