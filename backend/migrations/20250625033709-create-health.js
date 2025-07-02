'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. emotionalcareroutes: Trilhas + Diário de sentimentos e análise de humor
    await queryInterface.createTable('EmotionalCareRoutes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {                     // título da trilha
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {               // descrição geral da trilha
        type: Sequelize.TEXT,
        allowNull: true,
      },
      roadmap: {                   // roteiro detalhado das etapas (pode ser JSON em string)
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dailyEntry: {                // texto diário do usuário (diário de sentimentos)
        type: Sequelize.TEXT,
        allowNull: true,
      },
      moodAnalysis: {              // análise automática ou manual do humor (ex: feliz, triste)
        type: Sequelize.STRING,
        allowNull: true,
      },
      entryDate: {                 // data da entrada diária do diário emocional
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      favorite: {                  // marcador se o usuário favoritou essa trilha
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {                   // referência ao usuário
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // 2. healthcalendar: Calendário de eventos e lembretes de saúde
    await queryInterface.createTable('HealthCalendar', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      eventTitle: {               // título do evento (consulta, exame etc)
        type: Sequelize.STRING,
        allowNull: false,
      },
      eventDescription: {         // descrição detalhada
        type: Sequelize.TEXT,
        allowNull: true,
      },
      eventDateTime: {            // data e hora do evento
        type: Sequelize.DATE,
        allowNull: false,
      },
      notificationSent: {         // se já enviou notificação
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // 3. emotionalcheckins: Check-in emocional / saúde mental diária
    await queryInterface.createTable('EmotionalCheckIns', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      checkInDate: {             // data do check-in
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      moodRating: {              // nota ou avaliação rápida do humor (ex: 1 a 10)
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      notes: {                   // anotações livres do usuário no check-in
        type: Sequelize.TEXT,
        allowNull: true,
      },
      alertFlag: {               // flag para alertas (ex: sintomas de crise)
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // 4. wellnesshabits: Hábitos de bem-estar e acompanhamento
    await queryInterface.createTable('WellnessHabits', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      habitName: {               // nome do hábito (ex: dormir 8h, exercício diário)
        type: Sequelize.STRING,
        allowNull: false,
      },
      habitDescription: {        // descrição detalhada do hábito
        type: Sequelize.TEXT,
        allowNull: true,
      },
      frequency: {               // frequência esperada (ex: diária, semanal)
        type: Sequelize.STRING,
        allowNull: false,
      },
      progress: {                // progresso em porcentagem
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
      },
      reminderTime: {            // horário para lembrete (ex: 07:00)
        type: Sequelize.TIME,
        allowNull: true,
      },
      isActive: {                // hábito ativo ou desativado
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // 5. healthdashboard: Dashboard com dados consolidados da saúde
    await queryInterface.createTable('HealthDashboard', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      moodOverview: {           // resumo do humor (pode ser JSON)
        type: Sequelize.TEXT,
        allowNull: true,
      },
      habitCompletionRate: {    // taxa de cumprimento dos hábitos (%)
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      upcomingEvents: {         // eventos futuros (JSON com datas e títulos)
        type: Sequelize.TEXT,
        allowNull: true,
      },
      personalizedInsights: {   // insights e recomendações da IA (JSON)
        type: Sequelize.TEXT,
        allowNull: true,
      },
      lastUpdated: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // 6. manualhealthrecords: Registro manual de dados físicos de saúde
    await queryInterface.createTable('ManualHealthRecords', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      recordDate: {             // data da medição
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      measurementType: {        // tipo de dado (ex: pressão arterial, peso)
        type: Sequelize.STRING,
        allowNull: false,
      },
      measurementValue: {       // valor medido (ex: 120/80, 70kg)
        type: Sequelize.STRING,
        allowNull: false,
      },
      notes: {                  // observações adicionais
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ManualHealthRecords');
    await queryInterface.dropTable('HealthDashboard');
    await queryInterface.dropTable('WellnessHabits');
    await queryInterface.dropTable('EmotionalCheckIns');
    await queryInterface.dropTable('HealthCalendar');
    await queryInterface.dropTable('EmotionalCareRoutes');
  }
};
