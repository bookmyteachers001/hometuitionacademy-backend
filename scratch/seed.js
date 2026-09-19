require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const Address = require('../models/Address');

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

if (!MONGODB_CONNECTION_STRING) {
    console.error("❌ MONGODB_CONNECTION_STRING is missing from .env!");
    process.exit(1);
}

const seedData = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_CONNECTION_STRING);
        console.log("✅ Connected to MongoDB.");

        // 1. Seed Locations (Predefined cities)
        const sampleLocations = [
            { pincode: 110001, city: "Delhi", district: "Delhi", state: "DELHI", country: "India" },
            { pincode: 400001, city: "Mumbai", district: "Mumbai", state: "MAHARASHTRA", country: "India" },
            { pincode: 834001, city: "Ranchi", district: "Ranchi", state: "JHARKHAND", country: "India" },
            { pincode: 560001, city: "Bangalore", district: "Bangalore", state: "KARNATAKA", country: "India" }
        ];

        console.log("Seeding sample locations...");
        for (const loc of sampleLocations) {
            await Address.findOneAndDelete({ city: loc.city });
            const addressDoc = new Address(loc);
            await addressDoc.save();
            console.log(`  Added location: ${loc.city}`);
        }

        // 2. Seed Service (Custom Software Development)
        const sampleService = {
            slug: "custom-software-development",
            pre: ["best", "top", "trusted", "leading", "affordable"],
            post: ["near", "company", "agency", "consultant"],
            heading: "Custom Software Development Services",
            subHeading: "Transform Ideas into High-Performance Software Solutions",
            description: "Partner with our custom software development company to build secure, scalable, and user-friendly applications that solve real business problems.",
            category: "custom-software",
            shortHeading: "Custom Software Development",
            headingTemplate: "{pre} {service} {post} {location}",
            subHeadingTemplate: "Transform Your Business with {service} {location}",
            descriptionTemplate: "We provide {pre} {service} services {post} {location}.",
            action: {
                label: "Discuss Your Project",
                route: "/contact-us",
            },
            reviews: [
                {
                    name: "Rohit Sharma",
                    review: "The software they developed for us has streamlined operations, reduced manual errors, and saved countless hours of work. Their ability to understand our business and translate it into a functional product was impressive.",
                    designation: "CTO, TechNova Solutions",
                    rating: 5
                },
                {
                    name: "Priya Desai",
                    review: "We came with just an idea, and they turned it into a fully functioning platform that our customers love. Their attention to user experience and backend stability is unmatched.",
                    designation: "CEO, Urban Fashions",
                    rating: 5
                }
            ],
            clients: [],
            promotion: {
                title: "Let’s Build Your Next Game-Changing Software",
                description: "Get a custom-built software solution designed specifically for your business goals. From idea validation to launch, we’ll work with you to ensure your product is secure, scalable, and future-ready."
            },
            projectHeading: "Our Standout Projects",
            projects: [
                {
                    title: "Goyal Gas Report Management System",
                    description: "A custom-built software platform for Goyal Gas to automate daily reporting, track distribution metrics, and ensure compliance with safety regulations.",
                    slug: "/projects/goyal-gas-report-management"
                },
                {
                    title: "Air India Meal Cart Management System",
                    description: "A streamlined inventory and logistics solution designed for Air India's in-flight catering operations.",
                    slug: "/projects/air-india-meal-cart-management"
                }
            ],
            service: {
                heading: "Our Custom Software Development Services",
                description: "We provide full-cycle development services, from discovery to deployment, ensuring your software meets both your current and future business needs.",
                serviceList: [
                    {
                        title: "Web Application Development",
                        description: "Build powerful, responsive, and secure web applications tailored to your workflows.",
                        route: "/services/web-application-development"
                    },
                    {
                        title: "Mobile App Development",
                        description: "We design and develop mobile apps for iOS and Android.",
                        route: "/services/mobile-app-development"
                    }
                ]
            },
            strategy: {
                heading: "Our Proven Development Process",
                description: "We follow a structured, collaborative approach to ensure your project is delivered on time, within budget, and beyond expectations.",
                strategyList: [
                    {
                        title: "1. Discovery & Planning",
                        description: "We deep dive into your requirements, workflows, and goals to create a clear development roadmap."
                    },
                    {
                        title: "2. Design & Prototyping",
                        description: "Our design team creates interactive prototypes and wireframes for early feedback before development starts."
                    }
                ],
                feature: {
                    heading: "Why Businesses Choose Us",
                    description: "Our strength lies in combining deep technical expertise with business-first thinking.",
                    featureList: [
                        {
                            title: "Business-Centric Approach",
                            description: "We focus on solving your unique challenges, not just writing code."
                        }
                    ]
                }
            },
            faqs: [
                {
                    question: "Can you integrate our new software with existing tools?",
                    answer: "Yes. We specialize in API integrations and can connect your new software with CRMs, ERPs, payment gateways, analytics tools, and more."
                },
                {
                    question: "How do you ensure software scalability?",
                    answer: "We use scalable architecture, cloud-based infrastructure, and modular coding practices to ensure your software grows as your business does."
                }
            ],
            published: true,
            publishedAt: new Date()
        };

        console.log("Seeding sample service...");
        await Service.findOneAndDelete({ slug: sampleService.slug });
        const serviceDoc = new Service(sampleService);
        await serviceDoc.save();
        console.log("✅ Custom Software Development service page seeded successfully.");

    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        mongoose.connection.close();
        console.log("Database connection closed.");
    }
};

seedData();
