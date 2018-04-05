import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

import { Block } from './constants';

/*
Mapping that returns containers for the various block types.
*/
const RenderMap = Map({
  [Block.TODO]: {
    element: 'div',
  },
  [Block.IMAGE]: {
    element: 'figure',
  },
  [Block.BREAK]: {
    element: 'div',
  },
  [Block.NOTE]: {
    element: 'aside',
  },
  [Block.WARNING]: {
    element: 'aside',
  },
  [Block.ASIDE]: {
    element: 'aside',
  },
  [Block.RENDERCODE]: {
    element: 'figure',
  },
}).merge(DefaultDraftBlockRenderMap);


export default RenderMap;
