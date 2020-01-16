import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class Card extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Card'

  // Define default properties here
  static instanceDefaults() {
    return {
      title: '',
      description: '',
      order: 0,
      archived: false,
      listId: '',
      boardId: '',
      members: [],
    };
  }
}

const servicePath = 'cards';
const servicePlugin = makeServicePlugin({
  Model: Card,
  service: feathersClient.service(servicePath),
  servicePath,
});

export default servicePlugin;
