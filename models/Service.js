const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  pre: { type: [String], default: [] },
  post: { type: [String], default: [] },
  heading: { type: String, required: true },
  subHeading: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  shortHeading: { type: String},
  headingTemplate: { type: String, default: "" },
  subHeadingTemplate: { type: String, default: "" },
  descriptionTemplate: { type: String, default: "" },
  action: {
    label: { type: String, required: true },
    route: { type: String, default: "/contact-us" },
  },
  reviews: [
    {
      name: { type: String, required: true },
      review: { type: String, required: true },
      designation: { type: String, required: true },
      rating: { type: Number, default: 4 },
    },
  ],
  clients: [{
    name: { type: String, required: true },
    logo: {
      _id: String,
      url: String,
      name: String,
      alt: String
    },
    route: { type: String, required: false },
  }],
  promotion: {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  projectHeading: { type: String, required: false },
  projects: [
    {
      thumbnail: {
        _id: String,
        url: String,
        name: String,
        alt: String
      },
      title: { type: String, required: true },
      description: { type: String, required: true },
      slug: { type: String, required: true },
    },
  ],
  service: {
    heading: { type: String, required: true },
    description: { type: String, required: true },
    serviceList: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        route: { type: String, required: true },
      },
    ],
  },
  strategy: {
    heading: { type: String, required: false },
    description: { type: String, required: false },
    heroImage: {
      _id: String,
      url: String,
      name: String,
      alt: String
    },
    strategyList: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    feature: {
      heading: { type: String, required: false },
      description: { type: String, required: false },
      heroImage: {
        _id: String,
        url: String,
        name: String,
        alt: String
      },
      featureList: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
        },
      ],
    },
  },
  faqs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
