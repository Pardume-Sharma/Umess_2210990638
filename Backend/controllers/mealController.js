import { monitorDatabaseChanges } from "../exportToExcel.js";
import { User } from "../models/userModel.js";
import cron from "node-cron";
import Meal from "../models/mealModel.js";
const resetMealStatuses = async () => {
  try {
    const result = await User.updateMany(
      {},
      {
        $set: {
          breakfast: false,
          lunch: false,
          snacks: false,
          dinner: false,
          breakfastTime: "",
          lunchTime: "",
          snacksTime: "",
          dinnerTime: "",
          checkedIn: false,
          role:"Student"
        },
      }
    );

    console.log(`Meal statuses reset for ${result.modifiedCount} users.`);
  } catch (error) {
    console.error("Error resetting meal statuses:", error);
  }
};

// resetMealStatuses();

cron.schedule("0 0 * * *", resetMealStatuses);

export const getMealStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const mealStatus = {
      breakfast: {
        availed: user.breakfast,
        time: user.breakfastTime ? user.breakfastTime.toLocaleString() : "",
      },
      lunch: {
        availed: user.lunch,
        time: user.lunchTime ? user.lunchTime.toLocaleString() : "",
      },
      snacks: {
        availed: user.snacks,
        time: user.snacksTime ? user.snacksTime.toLocaleString() : "",
      },
      dinner: {
        availed: user.dinner,
        time: user.dinnerTime ? user.dinnerTime.toLocaleString() : "",
      },
    };

    res.json({ success: true, mealStatus });
  } catch (error) {
    console.error("Error fetching meal status", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// export const getMealStats = async (req, res) => {
//   console.log("Request Query:", req.query);

//   let hostels = req.query["hostels[]"] || req.query.hostels || [];
//   console.log("Hostels:", hostels);

//   // Ensure hostels is always an array
//   if (!Array.isArray(hostels)) {
//     hostels = [hostels];
//   }

//   // Remove any empty strings or undefined values
//   hostels = hostels.filter(Boolean);

//   console.log("Processed Hostels:", hostels);

//   try {
//     let matchCondition = {};

//     if (hostels.length > 0) {
//       matchCondition.hostel = { $in: hostels };
//     }

//     console.log("Match Condition:", matchCondition);

//     const mealCounts = await User.aggregate([
//       { $match: matchCondition },
//       {
//         $group: {
//           _id: null,
//           breakfast: { $sum: { $cond: ["$breakfast", 1, 0] } },
//           lunch: { $sum: { $cond: ["$lunch", 1, 0] } },
//           snacks: { $sum: { $cond: ["$snacks", 1, 0] } },
//           dinner: { $sum: { $cond: ["$dinner", 1, 0] } },
//         },
//       },
//     ]);

//     console.log("Meal Counts:", mealCounts);

//     if (hostels.length > 0 && mealCounts.length === 0) {
//       console.warn("No data found for specified hostels:", hostels);
//     }

//     res.json({
//       success: true,
//       mealStats: mealCounts.length > 0
//         ? mealCounts[0]
//         : { breakfast: 0, lunch: 0, snacks: 0, dinner: 0 },
//       hostelsQueried: hostels,
//     });
//   } catch (error) {
//     console.error("Error fetching meal stats", error);
//     res.status(500).json({ success: false, error: "Server error", details: error.message });
//   }
// };

// mealController.js or relevant controller file

export const getMealStats = async (req, res) => {
  console.log("Request Query:", req.query);

  let hostels = req.query["hostels[]"] || req.query.hostels || [];
  let genders = req.query["genders[]"] || req.query.genders || [];
  let floors = req.query["floors[]"] || req.query.floors || [];

  console.log("Hostels:", hostels);
  console.log("Genders:", genders);
  console.log("Floors:", floors);

  // Ensure hostels, genders, and floors are always arrays
  if (!Array.isArray(hostels)) {
    hostels = [hostels];
  }
  if (!Array.isArray(genders)) {
    genders = [genders];
  }
  if (!Array.isArray(floors)) {
    floors = [floors];
  }

  // Remove any empty strings or undefined values
  hostels = hostels.filter(Boolean);
  genders = genders.filter(Boolean);
  floors = floors.filter(Boolean);

  console.log("Processed Hostels:", hostels);
  console.log("Processed Genders:", genders);
  console.log("Processed Floors:", floors);

  try {
    let matchCondition = {};

    if (hostels.length > 0) {
      matchCondition.hostel = { $in: hostels };
    }

    if (genders.length > 0) {
      matchCondition.gender = { $in: genders };
    }

    if (floors.length > 0) {
      // Assuming roomNumber is a string like "302"
      // We'll use MongoDB aggregation to add a floor field and match
      // However, since match is before project in aggregation, we'll need to adjust the pipeline
      // Alternatively, use a $expr with $substr
      // We'll handle it in the aggregation pipeline below
    }

    console.log("Initial Match Condition:", matchCondition);

    const aggregationPipeline = [];

    // Add match condition for hostels and genders
    if (Object.keys(matchCondition).length > 0) {
      aggregationPipeline.push({ $match: matchCondition });
    }

    if (floors.length > 0) {
      aggregationPipeline.push({
        $addFields: {
          floor: { $substr: ["$roomNumber", 0, 1] }, 
        },
      });

      aggregationPipeline.push({
        $match: {
          floor: { $in: floors },
        },
      });
    }

    console.log("Aggregation Pipeline:", aggregationPipeline);

    const mealCounts = await User.aggregate([
      ...aggregationPipeline,
      {
        $group: {
          _id: null,
          breakfast: { $sum: { $cond: ["$breakfast", 1, 0] } },
          lunch: { $sum: { $cond: ["$lunch", 1, 0] } },
          snacks: { $sum: { $cond: ["$snacks", 1, 0] } },
          dinner: { $sum: { $cond: ["$dinner", 1, 0] } },
        },
      },
    ]);

    console.log("Meal Counts:", mealCounts);

    if (
      (hostels.length > 0 || genders.length > 0 || floors.length > 0) &&
      mealCounts.length === 0
    ) {
      console.warn("No data found for specified filters:", {
        hostels,
        genders,
        floors,
      });
    }

    res.json({
      success: true,
      mealStats:
        mealCounts.length > 0
          ? mealCounts[0]
          : { breakfast: 0, lunch: 0, snacks: 0, dinner: 0 },
      hostelsQueried: hostels,
      gendersQueried: genders,
      floorsQueried: floors,
    });
  } catch (error) {
    console.error("Error fetching meal stats", error);
    res
      .status(500)
      .json({ success: false, error: "Server error", details: error.message });
  }
};

export const updateMealStatus = async (req, res) => {
  const { rollNumber, meal } = req.body;
  // console.log(rollNumber, meal )
  const status = true;

  const validMeals = ["breakfast", "lunch", "snacks", "dinner"];
  if (!validMeals.includes(meal)) {
    return res.status(400).json({ error: "Invalid meal type" });
  }

  try {
    const currentTime = new Date();

    let hours = currentTime.getHours();
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    const seconds = String(currentTime.getSeconds()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, "0") : "12";

    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    console.log(formattedTime);

    const user = await User.findOneAndUpdate(
      { rollNumber, [meal]: { $ne: true } },
      {
        $set: {
          [meal]: status,
          [`${meal}Time`]: formattedTime, // Update the corresponding meal time
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ alreadyAvailed: true });
    }

    console.log(
      `Updated ${meal} status for roll number ${rollNumber}:`,
      user[meal]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating meal status:", error);
    res.status(500).json({ error: "Server error" });
  }
  monitorDatabaseChanges();
};
