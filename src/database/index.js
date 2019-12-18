import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';

const models = [User, Student, Plan, Enrollment];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    /* conexão com a base, essa variável 
        vai ser passada nos models dentro do
        metodo init(sequelize)
    
    */
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
