import mongoose, { Schema, Document } from "mongoose";

export interface ILot extends Document {
  lotNumber: string;

  // Lot Creation Date
  startDate: string;

  // Barcode Scan Date
  scanDate?: string;

  quality: string;
  itemId?: string;

  number: string;
  percentage: number;
  quantity: number;

  barcode: string;

  // Production Details
  machineNo?: string;
  operatorName?: string;
  cutterMachineNo?: string;
  cutterName?: string;
  cutType?: string;
  remarks?: string;

  status: "Created" | "Completed";
}

const LotSchema = new Schema<ILot>(
  {
    lotNumber: {
      type: String,
      required: true,
      unique: true,
    },

    startDate: {
      type: String,
      required: true,
    },

    scanDate: {
      type: String,
    },

    quality: {
      type: String,
      required: true,
    },

    itemId: {
      type: String,
    },

    number: {
      type: String,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    barcode: {
      type: String,
      required: true,
      unique: true,
    },

    machineNo: {
      type: String,
    },

    operatorName: {
      type: String,
    },

    cutterMachineNo: {
      type: String,
    },

    cutterName: {
      type: String,
    },

    cutType: {
      type: String,
    },

    remarks: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Created", "Completed"],
      default: "Created",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILot>("Lot", LotSchema);