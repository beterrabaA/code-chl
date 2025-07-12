import { Mongo } from 'meteor/mongo';

export const People = new Mongo.Collection('people');

People.allow({
  updateAsync() {
    return true;
  },
});