import Sequelize, { Model } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init(
      {
        created_at: Sequelize.DATE,
      },
      { sequelize }
    );
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: 'student_id',
    });
  }
}

export default Checkin;
