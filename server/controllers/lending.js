import Lending from "../models/Lend.js";

export const createLending = async (req, res) => {
    try {
        const { tool, startDate, endDate } = req.body;
        const newLending = new Lending({
            userId: req.user.id,
            tool,
            startDate,
            endDate
        });
        const lend = await newLending.save();
        res.status(201).json(lend);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

export const getLendingById = async (req, res) => {
    try {
        const lending = await Lending.findOne({ id: req.params.id });
        res.status(201).json(lending);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

export const getLendings = async (req, res) => {
    try {
        const { tool } = req.query;
        let bloackDates = []
        let query = {};

        if (tool) {
            query = { tool: tool };
        }

        const lendings = await Lending.find(query);
        if (tool) {
            lendings.map((lending) => {
                const { startDate, endDate } = lending;
                const blockingDates = [];

                const currentDate = new Date(startDate);
                const end = new Date(endDate);

                while (currentDate <= end) {
                    blockingDates.push(currentDate.toISOString().split('T')[0]);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                bloackDates = [...bloackDates, blockingDates]
            })
            const blockedDates = bloackDates.flat();
            return res.status(200).json({ data: lendings, blockedDates });
        }
        return res.status(200).json(lendings);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

