import Tool from "../models/Tool.js";

export const createTool = async (req, res) => {
  try {
    const { maker, model, shortDescription, longDescription } = req.body;
    const newPost = new Tool({
      userId: req.user.id,
      maker,
      model,
      shortDescription,
      longDescription,
      images: req.files.map((v) => v.filename),
    });
    const tool = await newPost.save();
    res.status(201).json(tool);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getTool = async (req, res) => {
  try {
    const pageNumber = req.query.pageNumber || 1;
    const pageSize = req.query.pageSize || 10;

    const skip = (pageNumber - 1) * pageSize;

    const { userId } = req.query;
    const totalDocuments = await Tool.countDocuments();
    let where = {};
    if (userId) {
      where = { userId };
    }
    const tools = await Tool.find({ ...where })
      .skip(skip)
      .limit(pageSize);
    // const remainingDocuments = totalDocuments - (skip + tools.length);
    const paginatedResults = {
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalDocuments,
      tools: tools,
      // remainingDocuments: remainingDocuments,
    };
    return res.status(200).json(paginatedResults);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getToolById = async (req, res) => {
  try {
    const tool = await Tool.findOne({ _id: req.params.id });

    return res.status(200).json(tool);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const deleteToolById = async (req, res) => {
  try {
    await Tool.findByIdAndRemove({ _id: req.params.id });

    return res.status(200).json();
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const updateToolById = async (req, res) => {
  try {
    const { id } = req.params;
    const { maker, model, shortDescription, longDescription } = req.body;
    let where = {};
    let updateImage = {};
    if (maker) {
      where = { maker };
    }
    if (model) {
      where = { ...where, model };
    }
    if (shortDescription) {
      where = { ...where, shortDescription };
    }
    if (longDescription) {
      where = { ...where, longDescription };
    }
    if (req.files.length) {
      const images = req.files.map((file) => file.path);
      updateImage = {
        $push: { images: { $each: images } },
      };
    }

    const tool = await Tool.findByIdAndUpdate(id, { ...where, ...updateImage }, { new: true });
    // delete image is remaining
    return res.status(200).json(tool);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
