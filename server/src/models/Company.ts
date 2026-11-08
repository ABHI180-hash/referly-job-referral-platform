import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  logo: string;
  industry: string;
  description: string;
  website: string;
  location: string;
  employeeCount: string;
  openPositions: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
      index: true,
    },
    logo: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
    },
    industry: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      default: 'Bengaluru, India',
    },
    employeeCount: {
      type: String,
      default: '1,000+ employees',
    },
    openPositions: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

CompanySchema.index({ name: 'text', description: 'text', industry: 'text' });

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
