import Menu from "../models/menuModel.js";

export const getMenu = async (req, res) => {
  try {
    const daysOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const menus = await Menu.aggregate([
      {
        // Add a temporary field "dayIndex" to each document that represents the position of the day in the daysOrder array
        $addFields: {
          dayIndex: { $indexOfArray: [daysOrder, "$day"] },
        },
      },
      {
        // Sort the documents by the dayIndex field
        $sort: { dayIndex: 1 },
      },
      {
        // Optionally, remove the temporary dayIndex field if you don't want it in the final output
        $project: {
          dayIndex: 0,
        },
      },
    ]);

    res.status(200).json(menus);
  } catch (error) {
    console.error("Error in getMenu function:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addMenu = async (req, res) => {
  const { day, mealType, menu } = req.body;

  if (!day || !mealType || !menu) {
    return res.status(400).json({ message: 'Day, meal type, and menu are required.' });
  }

  try {
    // Application-level check to prevent duplicates
    const existingMenu = await Menu.findOne({ day, mealType });
    if (existingMenu) {
      return res.status(400).json({
        message: `Menu for ${mealType} on ${day} already exists.`,
      });
    }

    // Create a new menu item
    const newMenuItem = new Menu({
      day,
      mealType,
      menu,
    });

    // Save the new menu item to the database
    const savedMenu = await newMenuItem.save();
    res.status(201).json({
      success: true,
      message: 'Menu added successfully.',
      data: savedMenu,
    });
  } catch (error) {
    console.error('Error adding menu:', error);

    // Handle duplicate key error from the database
    if (error.code === 11000) { // MongoDB duplicate key error code
      return res.status(400).json({
        success: false,
        message: `Menu for ${mealType} on ${day} already exists.`,
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while adding the menu.',
      error: error.message,
    });
  }
};

export const editMenu = async (req, res) => {
  const { id } = req.params;
  const { day, mealType, menu } = req.body;

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { day, mealType, menu },
      { new: true }
    );
    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const deletedMenu = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedMenu) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
