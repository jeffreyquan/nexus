import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class List extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'List'

  // Define default properties here
  static instanceDefaults() {
    return {
      name: '',
      boardId: '',
      order: '',
      archived: false,
    };
  }
}

const servicePath = 'lists';
const servicePlugin = makeServicePlugin({
  Model: List,
  service: feathersClient.service(servicePath),
  servicePath,
});

export default servicePlugin;
