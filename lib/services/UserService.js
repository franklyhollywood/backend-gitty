// const User = require('../models/User');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/user');

module.exports = class UserService {
  static async create(code) {
    const token = await exchangeCodeForToken(code);
    const { login, avatar_url, email } = await getGithubProfile(token);

    let user = await UserService.findByUsername(login);

    if (!user) {
      user = await UserService.insert({
        username: login,
        avatar: avatar_url,
        email,
      });
    }

    return user;
  }
};
