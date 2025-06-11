const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const { ChatSession, User } = require('../src/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let token;
let userId;

beforeAll(async () => {
    // Desabilita verificação de FK
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Sincroniza o banco
    await sequelize.sync({ force: true });

    // Reabilita verificação de FK
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Cria usuário teste
    const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword'
    });
    userId = user.id;

    // Gera token JWT
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
    await sequelize.close();
});

describe('ChatSession API', () => {
    let chatId;

    test('Deve criar um novo chat', async () => {
        const res = await request(app)
            .post('/api/chat-sessions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Chat de Teste',
                messages: [{ from: 'bot', text: 'Olá!' }],
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Chat de Teste');
        chatId = res.body.id;
    });

    test('Deve listar chats do usuário', async () => {
        const res = await request(app)
            .get('/api/chat-sessions')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('Deve buscar chat por ID', async () => {
        const res = await request(app)
            .get(`/api/chat-sessions/${chatId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', chatId);
    });

    test('Deve atualizar chat', async () => {
        const res = await request(app)
            .patch(`/api/chat-sessions/${chatId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Chat Atualizado',
                messages: [{ from: 'user', text: 'Oi!' }],
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Chat Atualizado');
    });

    test('Deve deletar chat', async () => {
        const res = await request(app)
            .delete(`/api/chat-sessions/${chatId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deletado/i);
    });
});