import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class User extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'User'

  // Define default properties here
  static instanceDefaults() {
    return {
      name: '',
      email: '',
      password: '',
    };
  }
}

const servicePath = 'users';
const servicePlugin = makeServicePlugin({
  Model: User,
  service: feathersClient.service(servicePath),
  servicePath,
});

export default servicePlugin;
