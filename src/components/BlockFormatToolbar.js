import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import BlockToolbar from './blocktoolbar';
import { getSelection, getSelectionRect } from '../util/index';
import { getCurrentBlock } from '../model/index';
import { Entity, HYPERLINK } from '../util/constants';
import { RichUtils } from 'draft-js';
import ImageButton from './sides/image';
import StyleButton from './stylebutton';

export default class BlockFormatToolbar extends React.Component {

  static propTypes = {
    editorEnabled: PropTypes.bool,
    editorState: PropTypes.object,
    toggleBlockType: PropTypes.func,
    blockButtons: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    blockButtons: BLOCK_BUTTONS,
  };

  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    if (!newProps.editorEnabled) {
      return;
    }
  }

  render() {
    const { editorState, editorEnabled, blockButtons } = this.props;
    const blockType = RichUtils.getCurrentBlockType(editorState);
    return (
      <div
        className={`md-editor-block-toolbar${(editorEnabled ? ' md-editor-block-toolbar--isopen' : '')}`}
      >
        {this.props.blockButtons.length > 0 ? (
            <div className="md-RichEditor-controls md-RichEditor-controls-block">
                {blockButtons.map((type) => {
                    const iconLabel = {};
                    iconLabel.label = type.label;
                    return (
                        <StyleButton
                            {...iconLabel}
                            className="hint--bottom"
                            key={type.style}
                            active={type.style === blockType}
                            onToggle={this.props.toggleBlockType}
                            style={type.style}
                            description={type.description}
                        />
                    );
                })}
            </div>
        ) : null}
      </div>
    );
  }
}

export const BLOCK_BUTTONS = [
  {
    label: 'H1',
    style: 'header-one',
    icon: 'header',
    description: 'Heading 1',
  },
  {
    label: 'H2',
    style: 'header-two',
    icon: 'header',
    description: 'Heading 2',
  },
  {
    label: 'H3',
    style: 'header-three',
    icon: 'header',
    description: 'Heading 3',
  },
  {
    label: <i className="material-icons">format_quote</i>,
    style: 'blockquote',
    icon: 'quote-right',
    description: 'Blockquote',
  },
  {
    label: <i className="material-icons">format_list_bulleted</i>,
    style: 'unordered-list-item',
    icon: 'list-ul',
    description: 'Unordered List',
  },
  {
    label: <i className="material-icons">format_list_numbered</i>,
    style: 'ordered-list-item',
    icon: 'list-ol',
    description: 'Ordered List',
  },
  {
    label: <i className="material-icons">playlist_add_check</i>,
    style: 'todo',
    description: 'Todo List',
  },
  {
    label: <i className="material-icons">code</i>,
    style: 'code-block',
    description: 'Code block',
  },
];
