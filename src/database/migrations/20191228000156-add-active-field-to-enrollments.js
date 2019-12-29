module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('enrollments', 'active', {
      type: (Sequelize.BOOLEAN, ['start_date', 'end_date']),
      references: {
        model: 'enrollments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('enrollments', 'active');
  },
};
