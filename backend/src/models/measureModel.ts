import { Schema, model } from 'mongoose';

const measureSchema = new Schema({
  measure_uuid: { type: String, required: true },
  customer_code: { type: String, required: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, required: true, enum: ['WATER', 'GAS'] },
  has_confirmed: { type: Boolean, default: false },
  image_url: { type: String, required: true },
});

export const Measure = model('Measure', measureSchema);
