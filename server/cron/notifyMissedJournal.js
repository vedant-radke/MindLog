// cron/notifyMissedJournal.js
const cron = require("node-cron");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

cron.schedule("0 21 * * *", async () => {
  console.log("Running missed journal notification check...");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Find users with streak >= 1 but who haven’t written today
    const users = await User.find({
      streak: { $gte: 1 },
      $or: [
        { lastJournalDate: { $lt: today } },
        { lastJournalDate: { $exists: false } },
      ],
    });

    console.log("3");
    for (const user of users) {
      await sendEmail(
        user.email,
        "📓 Keep Your MindLog Streak Alive! ✨",
        `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
     <h2 style="color: #4CAF50;">📓 Hello ${user.name}!</h2>
     <p>You've been doing amazing with your <strong>MindLog streak</strong>! 🏆</p>
     <p>But it looks like you haven’t written today’s journal entry yet. Don’t break your momentum! 🚀</p>
     <p style="text-align: center;">
       <a href="https://mindlog-in.vercel.app/journal/new" 
          style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: #fff; 
                 text-decoration: none; border-radius: 6px; font-weight: bold;">
         Write Now ✍️
       </a>
     </p>
     <p>Keep your streak alive and your mind sharp! 💡</p>
     <hr style="border: none; border-top: 1px solid #ddd;">
     <p style="font-size: 0.9em; color: #888;">- MindLog Team</p>
   </div>`
      );

      console.log(`✅ Reminder sent to: ${user.email}`);
    }
  } catch (error) {
    console.error("❌ Error sending reminders:", error);
  }
});
