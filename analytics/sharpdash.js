import { SharpDashBoard } from 'sharpdashboard-sdk-node';
import User from '../models/User.js';
import Video from '../models/Video.js';

const getUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.log(error.message);
  }
};

const getVideos = async () => {
  try {
    const videos = await Video.find();
    return videos;
  } catch (error) {
    console.log(error.message);
  }
};

const dashboard = new SharpDashBoard('api_key_here');

dashboard.addModelHandler('users', getUsers);
dashboard.addModelHandler('videos', getVideos);

export default dashboard;
