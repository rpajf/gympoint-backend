/* eslint-disable no-unused-vars */
import * as Yup from 'yup';
import User from '../models/User';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      age: Yup.number()
        .required()
        .positive()
        .integer(),
      weight: Yup.number()
        .required()
        .positive(),
      height: Yup.number()
        .required()
        .positive(),
      createdOn: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validations fails' });
    }

    function formatWeight(weight) {
      return weight.toString(`${weight}`);
    }

    const { name, age, height, weight, email } = req.body;
    const user_id = req.decoded;
    const data = {
      name,
      age,
      height,
      weight,
      email,
      user_id,
    };
    const student = await Student.create(data);
    return res.json(student);
  }

  async update(req, res) {
    const student = await Student.findByPk(req.params.id);

    const { name, email, age, height, weight } = await student.update(req.body);

    return res.json(student);
  }

  async delete(req, res) {
    const deletedStudent = await Student.destroy({
      where: { id: req.params.id },
    });

    return res.json({ deletedStudent });
  }
}

export default new StudentController();
