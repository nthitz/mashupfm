var React = require('react')

export default function VoteButtons(props) {
  return (
    <div>
      <div className="circle upvote-icon" id="upvote">
      </div>
      <div className="grab circle grab-icon" id="grab">
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
      <div className="circle downvote-icon" id="downvote">
      </div>
    </div>
  )

}

