import renderMap from './rendermap';
import { Block } from './constants';

describe('rendermap', () => {
  it('returns div for TODO', () => {
    expect(renderMap.get(Block.TODO)).to.deep.equal({
      element: 'div',
    });
  });

  it('returns figure for IMAGE', () => {
    expect(renderMap.get(Block.IMAGE)).to.deep.equal({
      element: 'figure',
    });
  });
});
