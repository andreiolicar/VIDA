const { Op } = require('sequelize');
const { FriendRequest, Friend, User } = require('../models');

async function searchUsers(userId, q) {
  if (!q || q.trim() === '') throw new Error('Parâmetro de busca inválido');

  return User.findAll({
    where: {
      id: { [Op.ne]: userId },
      [Op.or]: [
        { name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
      ],
    },
    attributes: ['id', 'name', 'email'],
    limit: 20,
  });
}

async function sendFriendRequest(requesterUserId, receiverUserId) {
  if (!receiverUserId) throw new Error('ID do usuário receptor é obrigatório');
  if (requesterUserId === receiverUserId) throw new Error('Não pode enviar solicitação para si mesmo');

  const existingRequest = await FriendRequest.findOne({
    where: { requesterUserId, receiverUserId, status: 'pending' },
  });
  if (existingRequest) throw new Error('Solicitação já enviada');

  const [userId1, userId2] = [requesterUserId, receiverUserId].sort((a, b) => a - b);
  const existingFriend = await Friend.findOne({ where: { userId1, userId2 } });
  if (existingFriend) throw new Error('Usuários já são amigos');

  return FriendRequest.create({ requesterUserId, receiverUserId });
}

async function acceptRequest(userId, requestId) {
  const request = await FriendRequest.findOne({
    where: { id: requestId, receiverUserId: userId, status: 'pending' },
  });
  if (!request) throw new Error('Solicitação não encontrada');

  request.status = 'accepted';
  await request.save();

  const [userId1, userId2] = [request.requesterUserId, request.receiverUserId].sort((a, b) => a - b);
  await Friend.create({ userId1, userId2 });
}

async function rejectRequest(userId, requestId) {
  const request = await FriendRequest.findOne({
    where: { id: requestId, receiverUserId: userId, status: 'pending' },
  });
  if (!request) throw new Error('Solicitação não encontrada');

  request.status = 'rejected';
  await request.save();
}

async function listFriends(userId) {
  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ userId1: userId }, { userId2: userId }],
    },
  });

  const friendIds = friends.map(f => (f.userId1 === userId ? f.userId2 : f.userId1));
  return User.findAll({
    where: { id: friendIds },
    attributes: ['id', 'name', 'email'],
  });
}

async function listReceivedRequests(userId) {
  return FriendRequest.findAll({
    where: { receiverUserId: userId, status: 'pending' },
    include: [{ model: User, as: 'requester', attributes: ['id', 'name', 'email'] }],
  });
}

module.exports = {
  searchUsers,
  sendFriendRequest,
  acceptRequest,
  rejectRequest,
  listFriends,
  listReceivedRequests,
};
