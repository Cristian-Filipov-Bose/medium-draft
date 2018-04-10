import { Map } from 'immutable';
import { ContentBlock } from 'draft-js';
import blockStyleFn from './blockStyleFn';
import { Block } from './constants';

const BASE_BLOCK_CLASS = 'md-block';

describe('blockStyleFn()', () => {
  it('should return block class for UNKNOWN', () => {
    const normalBlock = new ContentBlock({
      type: 'some-unknown-type',
    });
    expect(blockStyleFn(normalBlock)).to.equal(BASE_BLOCK_CLASS);
  });

  it('should return block class for UNSTYLED', () => {
    const normalBlock = new ContentBlock({
      type: Block.UNSTYLED,
    });
    expect(blockStyleFn(normalBlock)).to.equal(`${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph`);
  });

  it('should return block class for BLOCKQUOTE', () => {
    const normalBlock = new ContentBlock({
      type: Block.BLOCKQUOTE,
    });
    expect(blockStyleFn(normalBlock)).to.equal(
      `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-quote md-RichEditor-blockquote`);
  });

  it('should return block class for ATOMIC', () => {
    const normalBlock = new ContentBlock({
      type: Block.ATOMIC,
    });
    expect(blockStyleFn(normalBlock)).to.equal(
      `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-atomic`);
  });

  it('should return block class for IMAGE', () => {
    const normalBlock = new ContentBlock({
      type: Block.IMAGE,
    });
    expect(blockStyleFn(normalBlock)).to.equal(
      `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-image`);
  });

  it('should return block class for TODO', () => {
    const todoBlock = new ContentBlock({
      type: Block.TODO,
    });
    const todoBlockChecked = new ContentBlock({
      type: Block.TODO,
      data: Map({
        checked: true,
      }),
    });

    const baseTodoClass = `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph`;

    expect(blockStyleFn(todoBlock)).to.equal(
      `${baseTodoClass} ${BASE_BLOCK_CLASS}-todo ${BASE_BLOCK_CLASS}-todo-unchecked`);
    expect(blockStyleFn(todoBlockChecked)).to.equal(
      `${baseTodoClass} ${BASE_BLOCK_CLASS}-todo ${BASE_BLOCK_CLASS}-todo-checked`);
  });
});
