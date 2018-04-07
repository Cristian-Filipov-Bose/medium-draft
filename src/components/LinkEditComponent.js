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
    editorState: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    blockKey: PropTypes.string.isRequired,
    entityKey: PropTypes.string.isRequired,
    removeLink: PropTypes.func.isRequired,
    editLink: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      position: {},
    };
    this.renderedOnce = false;
  }

  componentDidMount() {
    setTimeout(this.calculatePosition, 0);
  }

  componentDidUpdate() {
    setTimeout(this.calculatePosition, 0);
  }

  shouldComponentUpdate(newProps) {
    if (this.renderedOnce) {
      const ret = (this.props.blockKey !== newProps.blockKey || this.props.entityKey !== newProps.entityKey);
      if (ret) {
        this.renderedOnce = false;
      }
      return ret;
    }
    this.renderedOnce = true;
    return true;
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
    this.setState({ position });
  };

  removeLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.removeLink(this.props.blockKey, this.props.entityKey);
  };

  editLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.editLink(this.props.blockKey, this.props.entityKey);
  };

  render() {
    let url = this.props.url;
    if (url.length > 30) {
      url = `${url.slice(0, 30)}...`;
    }
    return (
      <div
        className="md-editor-inline-toolbar md-editor-inline-toolbar--isopen md-editor-inline-toolbar-edit-link"
        style={this.state.position}
        ref={(element) => {
          this.toolbar = element;
        }}
      >
        <div className="md-RichEditor-inline-controls">
          <span className="md-RichEditor-link-url">
            <a href={this.props.url} title={this.props.url} target="_blank" rel="noopener noreferrer">{url}</a>
          </span>
          <span
            className="md-RichEditor-styleButton md-RichEditor-linkButton hint--top md-editor-inline-toolbar-edit-button"
            onClick={this.editLink}
            aria-label="Edit URL"
          >
            <i className="material-icons">mode_edit</i>
          </span>
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
