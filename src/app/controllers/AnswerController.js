import User from '../models/User';
import Help_order from '../models/Help_order';
import Student from '../models/Student';

class AnswerController {
  async store(req, res) {
    const { page = 1 } = req.query;
    const questions = await Help_order.findAll({
      where: { student_id: req.params.id },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['question', 'created_at'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: Student,
              attributes: ['name'],
            },
          ],
        },
      ],
    });
  }
}

export default new AnswerController();
