/* global PIXI */
import resources from './resources';

const resourceIndex = resources.map(res => ({
  key: res.split('.')[0],
  fileName: res,
}));
export default (name) => {
  const fileName = resourceIndex.find(res => res.key === name).fileName;
  return PIXI.loader.resources[`/static/img/${fileName}`].texture;
};
