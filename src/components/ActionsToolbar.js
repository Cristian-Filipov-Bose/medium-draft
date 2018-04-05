import PropTypes from 'prop-types';
import React from 'react';

import StyleButton from './stylebutton';


const ActionsToolbar = (props) => {
  if (props.buttons.length < 1) {
    return null;
  }
  return (
    <div className="md-RichEditor-controls">
      {props.buttons.map(type => {
        const iconLabel = {};
        iconLabel.label = type.label;
        return (
          <StyleButton
            {...iconLabel}
            key={type.style}
            active={currentStyle.has(type.style)}
            onToggle={props.onToggle}
            style={type.style}
            description={type.description}
          />
        );
      })}
    </div>
  );
};

ActionToolbar.propTypes = {
  buttons: PropTypes.array,
  onToggle: PropTypes.func,
};

export default ActionToolbar;
