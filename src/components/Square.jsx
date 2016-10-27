import React, {PropTypes} from 'react'

const Square = ({value, onClick}) => {
  return (
    <button className="square" onClick={() => onClick()}>
      {value}
    </button>
  )
}

Square.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Square
