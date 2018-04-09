import React from 'react';
import PropTypes from 'prop-types';
import { getVisibleSelectionRect } from 'draft-js';
import { getCurrentBlock } from '../model/index';
import { SelectionState } from 'draft-js';

const getRelativeParent = (element) => {
  if (!element) {
    return null;
  }

  const position = window.getComputedStyle(element).getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

export default class LinkEditComponent extends React.Component {

  static propTypes = {
    editorState: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    blockKey: PropTypes.string.isRequired,
    entityKey: PropTypes.string.isRequired,
    removeLink: PropTypes.func.isRequired,
    editLink: PropTypes.func.isRequired,
    setLink: PropTypes.func.isRequired,
    focus: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      position: {},
      urlInputValue: '',
      selection: null
    };
    this.renderedOnce = false;
  }

  componentDidMount() {
    console.log('componentDidMount');
    setTimeout(this.calculatePosition, 0);
  }

  componentDidUpdate() {
    setTimeout(this.calculatePosition, 0);
  }

  calculatePosition = () => {
    if (!this.toolbar) {
      return;
    }
    const relativeParent = getRelativeParent(this.toolbar.parentElement);
    const relativeRect = relativeParent ? relativeParent.getBoundingClientRect() : window.document.body.getBoundingClientRect();
    const selectionRect = getVisibleSelectionRect(window);
    if (!selectionRect) {
      return;
    }
    const position = {
      top: (selectionRect.top - relativeRect.top) + 35,
      left: (selectionRect.left - relativeRect.left) + (selectionRect.width / 2),
      transform: 'translate(-50%) scale(1)',
    };
    this.setState({ position, urlInputValue: this.props.url });
  };

  removeLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.removeLink(this.props.blockKey, this.props.entityKey);
  };

  onKeyDown = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.props.setLink(this.state.urlInputValue, this.props.blockKey, this.props.entityKey);
    } else if (e.which === 27) {
      this.props.focus();
    }
  }

  getSelection = () => {
    const { editorState } = this.props;
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(this.props.blockKey);
    block.findEntityRanges((character) => {
      const eKey = character.getEntity();
      return eKey === this.props.entityKey;
    }, (start, end) => {
      const selection = new SelectionState({
        anchorKey: this.props.blockKey,
        focusKey: this.props.blockKey,
        anchorOffset: start,
        focusOffset: end,
      });
      this.setState({ selection });
    });
  }  

  onChange = (e) => {
    this.setState({
      urlInputValue: e.target.value,
    });
  }

  render() {
    return (
      <div
        className="md-editor-inline-toolbar md-editor-inline-toolbar--isopen md-editor-inline-toolbar-edit-link"
        style={this.state.position}
        ref={(element) => {
          this.toolbar = element;
        }}
      >
        <div className="md-RichEditor-inline-controls md-RichEditor-show-link-input">
          <span
            className="md-RichEditor-styleButton md-RichEditor-linkButton hint--top md-editor-inline-toolbar-edit-button"
            onClick={ _ => window.open(this.state.urlInputValue) }
            aria-label="Open URL"
          >
            <i className="material-icons">&#xE89E;</i>
          </span>
          <input
              ref={node => { this.urlinput = node; }}
              type="text"
              className="md-RichEditor-link-url"
              onKeyDown={this.onKeyDown}
              onChange={this.onChange}
              placeholder="Press ENTER or ESC"
              value={this.state.urlInputValue}
          />
          <span
            className="md-RichEditor-styleButton md-RichEditor-linkButton hint--top md-editor-inline-toolbar-unlink-button"
            onClick={this.removeLink}
            aria-label="Remove URL"
          >
            <i className="fa fa-unlink"></i>
          </span>
        </div>
      </div>
    );
  }
}
