import { SharpDashBoard } from 'sharpdashboard-sdk-node';
import User from '../models/User.js';
import Video from '../models/Video';

const getUsers = async () => {
  try {
    const users = await User.find();
    const filteredUsers = [];
    users.forEach(user =>
      filteredUsers.push({
        username: user.username,
        id: user._id,
        date: user.date,
      })
    );
    return filteredUsers;
  } catch (error) {
    console.log(error.message);
  }
};

const getVideos = async () => {
  try {
    const videos = await Video.find();
    const filteredVideos = [];
    videos.forEach(vid =>
      filteredVideos.push({
        title: vid.title,
        comments: vid.comments.length,
        id: vid._id,
      })
    );
    return filteredVideos;
  } catch (error) {
    console.log(error.message);
  }
};

const dashboard = new SharpDashBoard(
  'eb8ad2e1d066a0e0e152deacfdc47d9afcaf813d'
);

dashboard.addModelHandler('users', getUsers);
dashboard.addModelHandler('videos', getVideos);

export default dashboard;
