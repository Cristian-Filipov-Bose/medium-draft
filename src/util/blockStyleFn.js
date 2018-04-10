import { Block } from './constants';

/*
Get custom classnames for each of the different block types supported.
*/

const BASE_BLOCK_CLASS = 'md-block';

export default (block) => {
  switch (block.getType()) {
    case Block.BLOCKQUOTE:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-quote md-RichEditor-blockquote`;
    case Block.UNSTYLED:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph`;
    case Block.ATOMIC:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-atomic`;
    case Block.NOTE:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-note`;
    case Block.WARNING:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-warning`;
    case Block.ASIDE:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-aside`;
    case Block.IMAGE:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-image`;
    case Block.RENDERCODE:
      return `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-render-code`;
    case Block.TODO: {
      const data = block.getData();
      const checkedClass = data.get('checked') === true ?
        `${BASE_BLOCK_CLASS}-todo-checked` : `${BASE_BLOCK_CLASS}-todo-unchecked`;
      let finalClass = `${BASE_BLOCK_CLASS} ${BASE_BLOCK_CLASS}-paragraph `;
      finalClass += `${BASE_BLOCK_CLASS}-todo ${checkedClass}`;
      return finalClass;
    }
    default: return BASE_BLOCK_CLASS;
  }
};
