import * as Yup from 'yup';
import { startOfDay, isBefore, parseISO } from 'date-fns';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }
    const { student_id, start_date } = req.body;

    const findStudent = await Student.findOne({
      where: { id: student_id },
    });
    if (!findStudent) {
      return res.status(401).json({ error: 'Student not found' });
    }
    const enrollmentDate = startOfDay(parseISO(start_date));
    if (isBefore(enrollmentDate, new Date())) {
      return res
        .status(400)
        .json({ error: 'Cannot create a meetup in past dates' });
    }
    const findPlan = await Enrollment.findByPk(req.query.id, {
      include: [
        {
          model: Plan,
          attributes: ['title', 'duration', 'month_price'],
        },
      ],
    });
    if (!findPlan) {
      return res.status(401).json({ error: 'Plan not found' });
    }
    const enrollment = await Enrollment.create({
      student_id,
      start_date,
      plan_id: req.params.id,
    });
    return res.json(enrollment);
  }
}

export default new EnrollmentController();
