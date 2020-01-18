import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class Activity extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Activity'

  // Define default properties here
  static instanceDefaults() {
    return {
      text: '',
      userId: null,
      boardId: '',
    };
  }

  static setupInstance(data, { models }) {
    if (data.user) {
      // eslint-disable-next-line no-param-reassign
      data.user = new models.api.User(data.user);
    }
    return data;
  }
}

const servicePath = 'activities';
const servicePlugin = makeServicePlugin({
  Model: Activity,
  service: feathersClient.service(servicePath),
  servicePath,
});

export default servicePlugin;
