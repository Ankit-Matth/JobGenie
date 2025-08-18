import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    src: {
        type: String,
        required: true,
    },
});

const JobsModel = mongoose.models?.JobListing || mongoose.model('JobListing', jobSchema);

export default JobsModel;
