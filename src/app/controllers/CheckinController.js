import {
  startOfDay,
  eachDayOfInterval,
  addDays,
  differenceInDays,
} from 'date-fns';
import Student from '../models/Student';

import Checkin from '../models/Checkin';

class Checkincontroller {
  async index(req, res) {
    const checkins = await Checkin.findAll({
      include: [
        {
          model: Student,
          where: { id: req.params.studentId },
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;

    const checkin = await Checkin.create({
      student_id: id,
    });
    const weekCheckins = addDays(new Date(checkin.created_at), 5);

    const checkinLimit = eachDayOfInterval({
      start: new Date(checkin.created_at),
      end: new Date(weekCheckins),
    });

    res.json({ message: 'Checkin ok' });
  }
}

export default new Checkincontroller();
