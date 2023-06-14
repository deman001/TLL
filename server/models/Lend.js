import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LendingSchema = new Schema(
    {
        tool: {
            type: Schema.Types.ObjectId,
            ref: 'Tool',
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
    }, { timestamps: true }
);

const Lending = mongoose.model('Lending', LendingSchema);
export default Lending;
