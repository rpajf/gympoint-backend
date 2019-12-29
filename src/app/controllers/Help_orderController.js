import * as Yup from 'yup';

import Student from '../models/Student';
import Help_order from '../models/Help_order';

class Help_orderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: error.inner });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        error: 'Validation fails',
        messages: [{ errors: ['Student not found'] }],
      });
    }

    const { id } = req.params;
    const { question } = req.body;
    const help_orders = await Help_order.create({
      question,
      student_id: id,
    });
    return res.json(help_orders);
  }
}

export default new Help_orderController();
