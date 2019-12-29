import moongoose from 'mongoose';

const NotificationSchema = new moongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    student: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default moongoose.model('Notification', NotificationSchema);
