let users = [];

const addUser = ({ id, username, roomId }) => {
  // clean the data

  username = username.trim().toLowerCase();
  roomId = roomId.trim().toLowerCase();

  // valdate the data

  if (!username || !roomId)
    return { error: " username and roomId is required " };

  // chck for existuser

  const existingUser = users.find((user) => {
    return user.roomId == roomId && user.username == username;
  });

  if (existingUser) {
    return {
      error: "there is existing room or username ",
    };
  }

  // store user
  const user = { id, username, roomId };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  users = users.filter((user) => {
    return user.id !== id;
  });
};

const getUser = (id) => {
  return users.find((user) => {
    if (user.id === id) {
      return user;
    }
  });
};

const getUserInRoom = (roomId) => {
  return users.filter((user) => {
    return user.roomId === roomId;
  });
};

module.exports = {
  getUser,
  addUser,
  removeUser,
  getUserInRoom,
  users,
};
