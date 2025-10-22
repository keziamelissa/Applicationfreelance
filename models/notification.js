export default (mongoose) => {
  const { Schema, model, Types } = mongoose;
  const notificationSchema = new Schema({
    idUsers: { type: Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    satuts: { type: Boolean, default: false },
    dateDeCreation: { type: Date, default: Date.now },
  }, { collection: 'notifications' });

  return model('Notification', notificationSchema);
};
