import * as Yup from 'yup';
import { startOfDay, isBefore, parseISO, addMonths, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';
import Notification from '../schemas/Notification';

class EnrollmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const enrollments = await Enrollment.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      order: ['start_date'],
      limit: 5,
      offset: 5 * page - 5,
      include: [
        {
          model: Student,
          attributes: ['name'],
        },
      ],
    });
    return res.json({
      enrollments,
      page,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }
    const { student_id, start_date } = req.body;
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }
    const enrollmentDate = startOfDay(parseISO(start_date));
    if (isBefore(enrollmentDate, new Date())) {
      return res
        .status(400)
        .json({ error: 'Cannot create a meetup in past dates' });
    }

    const plan = await Plan.findByPk(req.params.planId);

    if (!plan) {
      return res.status(400).json({ error: 'Cant find plan' });
    }
    const price = plan.month_price * plan.duration;

    const end_date = addMonths(parseISO(start_date), plan.duration);

    const enrollment = await Enrollment.create({
      student_id,
      start_date,
      plan_id: req.params.planId,
      price,
      end_date,
    });
    const formattedDate = format(
      enrollmentDate,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: ` ${student.name}, sua matrícula foi criada no ${formattedDate}..`,
      student: student_id,
    });
    return res.json({ enrollment });
  }

  async update(req, res) {
    const { plan_id, start_date } = req.body;
    const { id } = req.params;

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(401).json({ error: 'Plan was not fount' });
    }
    const price = plan.month_price * plan.duration;

    const end_date = addMonths(parseISO(start_date), plan.duration);

    const enr = await Enrollment.findOne({
      where: { id },
    });
    await enr.update({
      plan_id,
      price,
      end_date,
      start_date,
    });

    return res.json({ message: 'atualizou' });
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(401).json({ error: 'Enrollment was not found' });
    }
    enrollment.canceled_at = new Date();
    await enrollment.save();
    await enrollment.destroy();

    return res.send('Matrícula deletada');
  }
}

export default new EnrollmentController();
