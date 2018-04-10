import PropTypes from 'prop-types';
import React from 'react';
import { RichUtils } from 'draft-js';
import { getCurrentBlock } from '../model/index';
import { Entity, HYPERLINK } from '../util/constants';
import StyleButton from './stylebutton';

export default class FormatToolbar extends React.Component {

  static propTypes = {
    editorEnabled: PropTypes.bool,
    editorState: PropTypes.object,
    toggleBlockType: PropTypes.func,
    toggleInlineStyle: PropTypes.func,
    blockButtons: PropTypes.arrayOf(PropTypes.object),
    inlineButtons: PropTypes.arrayOf(PropTypes.object),
    handleLinkInput: PropTypes.func,
    focus: PropTypes.func,
  };

  static defaultProps = {
    blockButtons: BLOCK_BUTTONS,
    inlineButtons: INLINE_BUTTONS,
  };

  handleLinkInput = (e, direct = false) => {
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

  render() {
    const { editorState, editorEnabled, blockButtons, inlineButtons } = this.props;
    const blockType = RichUtils.getCurrentBlockType(editorState);
    const currentStyle = editorState.getCurrentInlineStyle();
    let hasHyperLink = false;
    let hyperlinkLabel = '#';
    let hyperlinkDescription = 'Add a link';
    for (let cnt = 0; cnt < inlineButtons.length; cnt++) {
      if (inlineButtons[cnt].style === HYPERLINK) {
        hasHyperLink = true;
        if (inlineButtons[cnt].label) {
          hyperlinkLabel = inlineButtons[cnt].label;
        }
        if (inlineButtons[cnt].description) {
          hyperlinkDescription = inlineButtons[cnt].description;
        }
        break;
      }
    }
    return (
      <div
        className={`md-editor-toolbar${(editorEnabled ? ' md-editor-toolbar--isopen' : '')}`}
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
        {this.props.inlineButtons.length > 0 ? (
          <div className="md-RichEditor-controls md-RichEditor-controls-inline">
            {inlineButtons.map(type => {
              const iconLabel = {};
              iconLabel.label = type.label;
              return (
                <StyleButton
                  {...iconLabel}
                  className="hint--bottom"
                  key={type.style}
                  active={currentStyle.has(type.style)}
                  onToggle={this.props.toggleInlineStyle}
                  style={type.style}
                  description={type.description}
                />
              );
            })}
          </div>
        ) : null}
        <div className="md-RichEditor-controls">
          {hasHyperLink && (
            <span
              className="md-RichEditor-styleButton md-RichEditor-linkButton hint--bottom"
              onClick={this.props.handleLinkInput}
              aria-label={hyperlinkDescription}
            >
              {hyperlinkLabel}
            </span>
          )}
        </div>
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
  {
    label: <i className="material-icons">lightbulb_outline</i>,
    style: 'note',
    description: 'Note',
  },
  {
    label: <i className="material-icons">priority_high</i>,
    style: 'warning',
    description: 'Warning',
  },
];

export const INLINE_BUTTONS = [
  {
    label: <i className="material-icons">format_bold</i>,
    style: 'BOLD',
    icon: 'bold',
    description: 'Bold ⌘B',
  },
  {
    label: <i className="material-icons">format_italic</i>,
    style: 'ITALIC',
    icon: 'italic',
    description: 'Italic ⌘I',
  },
  {
    label: <i className="material-icons">format_underlined</i>,
    style: 'UNDERLINE',
    icon: 'underline',
    description: 'Underline ⌘U',
  },
  {
    label: <i className="material-icons">format_color_fill</i>,
    style: 'HIGHLIGHT',
    description: 'Highlight ⌘=',
  },
  {
    label: <i className="material-icons">format_strikethrough</i>,
    style: 'STRIKETHROUGH',
    description: 'Strike ⌘-',
  },
  {
    label: <i className="material-icons">code</i>,
    style: 'CODE',
    description: 'Code ⌘K',
  },
  {
    label: <i className="material-icons">insert_link</i>,
    style: HYPERLINK,
    icon: 'link',
    description: 'Link ⇧⌘K',
  },
];
