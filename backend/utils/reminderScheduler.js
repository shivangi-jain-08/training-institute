const cron = require('node-cron');
const Member = require('../models/Member');
const { sendBulkReminders } = require('../services/whatsappService');

const checkAndSendReminders = async () => {
  try {
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const expiringMembers = await Member.find({
      isActive: true,
      subscriptionEndDate: { $gte: today, $lte: threeDaysFromNow },
      $or: [
        { lastReminderSent: { $lt: twentyFourHoursAgo } },
        { lastReminderSent: null }
      ]
    });

    if (expiringMembers.length > 0) {
      console.log(`Found ${expiringMembers.length} members to send reminders to`);
      
      const results = await sendBulkReminders(expiringMembers);
      
      const successfulSends = results.filter(r => r.success);
      if (successfulSends.length > 0) {
        await Member.updateMany(
          { _id: { $in: successfulSends.map(r => r.memberId) } },
          { 
            $set: { lastReminderSent: today },
            $inc: { reminderCount: 1 }
          }
        );
      }
      
      console.log(`Sent ${successfulSends.length} reminders successfully`);
    } else {
      console.log('No members need reminders at this time');
    }
  } catch (error) {
    console.error('Error in reminder scheduler:', error);
  }
};

const start = () => {
  cron.schedule('0 9 * * *', checkAndSendReminders, {
    timezone: "Asia/Kolkata"
  });
  
  cron.schedule('0 */6 * * *', checkAndSendReminders, {
    timezone: "Asia/Kolkata"
  });
  
  console.log('Reminder scheduler started');
};

module.exports = {
  start,
  checkAndSendReminders
};