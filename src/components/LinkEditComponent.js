import React from 'react';
import PropTypes from 'prop-types';
import { getVisibleSelectionRect } from 'draft-js';

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
    isCursorLink: PropTypes.bool.isRequired,
    editorState: PropTypes.object.isRequired,
    url: PropTypes.string,
    blockKey: PropTypes.string,
    entityKey: PropTypes.string,
    removeLink: PropTypes.func.isRequired,
    editLink: PropTypes.func.isRequired,
    setLink: PropTypes.func.isRequired,
    insertLink: PropTypes.func.isRequired,
    focus: PropTypes.func,
    toolbar: PropTypes.object,
  };

  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.toolbar) {
      return null;
    }
    const relativeParent = getRelativeParent(nextProps.toolbar.parentElement);
    const relativeRect = relativeParent ? relativeParent.getBoundingClientRect() : window.document.body.getBoundingClientRect();
    const selectionRect = getVisibleSelectionRect(window);
    if (!selectionRect) {
      return null;
    }
    const position = {
      top: (selectionRect.top - relativeRect.top) + 25,
      left: (selectionRect.left - relativeRect.left) + (selectionRect.width / 2),
      transform: 'translate(-100%) scale(1)',
    };
    const url = nextProps.url || '';
    return { position, urlInputValue: url };
  }

  constructor(props) {
    super(props);

    this.state = {
      position: {},
      urlInputValue: '',
      showInput: false,
    };
  }

  onKeyDown = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      if (this.state.showInput) {
        this.props.insertLink(this.state.urlInputValue);
      } else {
        this.props.setLink(this.state.urlInputValue, this.props.blockKey, this.props.entityKey);
      }
      this.setState({ showInput: false });
    } else if (e.which === 27) {
      this.props.focus();
      this.setState({ showInput: false });
    }
  }

  onChange = (e) => {
    this.setState({
      urlInputValue: e.target.value,
    });
  }

  removeLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.removeLink(this.props.blockKey, this.props.entityKey);
  };

  handleLinkInput = (e, direct = false) => {
    if (direct !== true) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({
      showInput: true,
    }, () => {
      setTimeout(() => {
        this.urlinput.focus();
        this.urlinput.select();
      }, 0);
    });
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
      top: (selectionRect.top - relativeRect.top) + 25,
      left: (selectionRect.left - relativeRect.left) + (selectionRect.width / 2),
      transform: 'translate(-50%) scale(1)',
    };
    const url = this.props.url || '';
    console.log('this.props.url', url);
    if (this.state.urlInputValue !== url) {
      this.setState({ position, urlInputValue: url });
    }
  };

  render() {
    const show = this.props.isCursorLink || this.state.showInput;
    if (!show) {
      return null;
    }
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
            onClick={() => window.open(this.state.urlInputValue)}
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
            <i className="fa fa-unlink" />
          </span>
        </div>
      </div>
    );
  }
}
