import PropTypes from 'prop-types';
// import './toolbar.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import BlockToolbar from './blocktoolbar';
import InlineToolbar from './inlinetoolbar';

import { getSelection, getSelectionRect } from '../util/index';
import { getCurrentBlock } from '../model/index';
import { Entity, HYPERLINK } from '../util/constants';
import ImageButton from './sides/image';
import StyleButton from './stylebutton';

export default class Toolbar extends React.Component {

  static propTypes = {
    editorEnabled: PropTypes.bool,
    editorState: PropTypes.object,
    toggleBlockType: PropTypes.func,
    toggleInlineStyle: PropTypes.func,
    inlineButtons: PropTypes.arrayOf(PropTypes.object),
    blockButtons: PropTypes.arrayOf(PropTypes.object),
    editorNode: PropTypes.object,
    setLink: PropTypes.func,
    focus: PropTypes.func,
  };

  static defaultProps = {
    blockButtons: BLOCK_BUTTONS,
    inlineButtons: INLINE_BUTTONS,
    actionButtons: ACTION_BUTTONS,
  };

  constructor(props) {
    super(props);
    this.state = {
      showURLInput: false,
      urlInputValue: '',
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleLinkInput = this.handleLinkInput.bind(this);
    this.hideLinkInput = this.hideLinkInput.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    if (!newProps.editorEnabled) {
      return;
    }
    const selectionState = editorState.getSelection();
    if (selectionState.isCollapsed()) {
      if (this.state.showURLInput) {
        this.setState({
          showURLInput: false,
          urlInputValue: '',
        });
      }
      return;
    }
  }

  onKeyDown(e) {
    if (e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.props.setLink(this.state.urlInputValue);
      this.hideLinkInput();
    } else if (e.which === 27) {
      this.hideLinkInput();
    }
  }

  onChange(e) {
    this.setState({
      urlInputValue: e.target.value,
    });
  }

  handleLinkInput(e, direct = false) {
    if (direct !== true) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      this.props.focus();
      return;
    }
    const currentBlock = getCurrentBlock(editorState);
    let selectedEntity = '';
    let linkFound = false;
    currentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      selectedEntity = entityKey;
      return entityKey !== null && editorState.getCurrentContent().getEntity(entityKey).getType() === Entity.LINK;
    }, (start, end) => {
      let selStart = selection.getAnchorOffset();
      let selEnd = selection.getFocusOffset();
      if (selection.getIsBackward()) {
        selStart = selection.getFocusOffset();
        selEnd = selection.getAnchorOffset();
      }
      if (start === selStart && end === selEnd) {
        linkFound = true;
        const { url } = editorState.getCurrentContent().getEntity(selectedEntity).getData();
        this.setState({
          showURLInput: true,
          urlInputValue: url,
        }, () => {
          setTimeout(() => {
            this.urlinput.focus();
            this.urlinput.select();
          }, 0);
        });
      }
    });
    if (!linkFound) {
      this.setState({
        showURLInput: true,
      }, () => {
        setTimeout(() => {
          this.urlinput.focus();
        }, 0);
      });
    }
  }

  hideLinkInput(e = null) {
    if (e !== null) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({
      showURLInput: false,
      urlInputValue: '',
    }, this.props.focus
    );
  }

  render() {
    const { editorState, editorEnabled, inlineButtons, actionButtons } = this.props;
    const { showURLInput, urlInputValue } = this.state;
    let isOpen = editorEnabled;
    let hasHyperLink = false;
    let hyperlinkLabel = '#';
    let hyperlinkDescription = 'Add a link';
    for (let cnt = 0; cnt < actionButtons.length; cnt++) {
      if (actionButtons[cnt].style === HYPERLINK) {
        hasHyperLink = true;
        if (actionButtons[cnt].label) {
          hyperlinkLabel = actionButtons[cnt].label;
        }
        if (actionButtons[cnt].description) {
          hyperlinkDescription = actionButtons[cnt].description;
        }
        break;
      }
    }
    return (
      <div
        className={`md-editor-toolbar${(isOpen ? ' md-editor-toolbar--isopen' : '')}`}
      >
        {this.props.blockButtons.length > 0 ? (
          <BlockToolbar
            editorState={editorState}
            onToggle={this.props.toggleBlockType}
            buttons={this.props.blockButtons}
          />
        ) : null}
        {this.props.inlineButtons.length > 0 ? (
          <InlineToolbar
            editorState={editorState}
            onToggle={this.props.toggleInlineStyle}
            buttons={this.props.inlineButtons}
          />
        ) : null}
        <div className="md-RichEditor-controls">
          {hasHyperLink && (
              <span
                className="md-RichEditor-styleButton md-RichEditor-linkButton hint--top"
                onClick={this.handleLinkInput}
                aria-label={hyperlinkDescription}
              >
                {hyperlinkLabel}
              </span>
          )}
          {actionButtons.map(type => {
            const iconLabel = {};
            iconLabel.label = type.label;
            return (
              <StyleButton
                {...iconLabel}
                key={type.style}
                style={type.style}
                description={type.description}
              />
            );
          })}
        </div>
        {showURLInput && (
          <div
            className={`md-editor-toolbar${(isOpen ? ' md-editor-toolbar--isopen' : '')} md-editor-toolbar--linkinput`}
          >
            <div
              className="md-RichEditor-controls md-RichEditor-show-link-input"
              style={{ display: 'block' }}
            >
              <span className="md-url-input-close" onClick={this.hideLinkInput}>&times;</span>
              <input
                ref={node => { this.urlinput = node; }}
                type="text"
                className="md-url-input"
                onKeyDown={this.onKeyDown}
                onChange={this.onChange}
                placeholder="Press ENTER or ESC"
                value={urlInputValue}
              />
            </div>
          </div>
        )}
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

export const INLINE_BUTTONS = [
  {
    label: <i className="material-icons">format_bold</i>,
    style: 'BOLD',
    icon: 'bold',
    description: 'Bold',
  },
  {
    label: <i className="material-icons">format_italic</i>,
    style: 'ITALIC',
    icon: 'italic',
    description: 'Italic',
  },
  {
    label: <i className="material-icons">format_underlined</i>,
    style: 'UNDERLINE',
    icon: 'underline',
    description: 'Underline',
  },
  {
    label: <i className="material-icons">format_color_fill</i>,
    style: 'HIGHLIGHT',
    description: 'Highlight selection',
  },
  {
    label: <i className="material-icons">format_strikethrough</i>,
    style: 'STRIKETHROUGH',
    description: 'Strike selection',
  },
  {
    label: <i className="material-icons">code</i>,
    style: 'CODE',
    description: 'Code',
  },
];

export const ACTION_BUTTONS = [
  {
    label: <i className="material-icons">insert_link</i>,
    style: HYPERLINK,
    icon: 'link',
    description: 'Add a link',
  },
  {
    label: <i className="material-icons">insert_photo</i>,
    style: 'image',
    description: 'Insert a photo',
  },
];
