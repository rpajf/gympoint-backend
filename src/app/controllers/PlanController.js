import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      month_price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid data!' });

    const { title } = req.body;

    const invalidTitle = await Plan.findOne({ where: { title } });

    if (invalidTitle)
      return res.status(400).json({ error: 'This plan already exists!' });

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      where: { canceled_at: null },
    });
    return res.json(plans);
  }

  async update(req, res) {
    const plans = await Plan.findOne(req.params.id);

    const { title, duration, month_price } = await plans.update(req.body);

    return res.json({
      title,
      duration,
      month_price,
    });
  }
}

export default new PlanController();
