const Member = require('../models/Member');
const { sendWhatsAppReminder } = require('../services/whatsappService');

const createMember = async (req, res) => {
  try {
    const { fullName, age, contactNumber, joinDate, subscriptionEndDate } = req.body;

    const member = new Member({
      fullName,
      age,
      contactNumber,
      joinDate,
      subscriptionEndDate,
      createdBy: req.user._id
    });

    await member.save();
    res.status(201).json({ message: 'Member created successfully', member });
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ message: 'Failed to create member', error: error.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const query = { isActive: true };

    // Search 
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { contactNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);

      switch (status) {
        case 'expired':
          query.subscriptionEndDate = { $lt: today };
          break;

        case 'expiring-soon':
          const threeDaysFromToday = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
          threeDaysFromToday.setHours(23, 59, 59, 999);
          query.subscriptionEndDate = {
            $gte: today,
            $lte: threeDaysFromToday
          };
          break;

        case 'active':
          const threeDaysFromTodayActive = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
          threeDaysFromTodayActive.setHours(23, 59, 59, 999);
          query.subscriptionEndDate = { $gt: threeDaysFromTodayActive };
          break;
      }
    }

    const members = await Member.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Member.countDocuments(query);

    res.json({
      members,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: 'Failed to get members', error: error.message });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate('createdBy', 'name email');

    if (!member || !member.isActive) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ member });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ message: 'Failed to get member', error: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { fullName, age, contactNumber, joinDate, subscriptionEndDate } = req.body;

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { fullName, age, contactNumber, joinDate, subscriptionEndDate },
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member updated successfully', member });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ message: 'Failed to update member', error: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ message: 'Failed to delete member', error: error.message });
  }
};

const sendReminder = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member || !member.isActive) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const result = await sendWhatsAppReminder(member);

    if (result.success) {
      member.lastReminderSent = new Date();
      member.reminderCount += 1;
      await member.save();

      res.json({ message: 'Reminder sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send reminder', error: result.error });
    }
  } catch (error) {
    console.error('Send reminder error:', error);
    res.status(500).json({ message: 'Failed to send reminder', error: error.message });
  }
};

const getExpiringMembers = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    threeDaysFromNow.setHours(23, 59, 59, 999);

    const expiringMembers = await Member.find({
      isActive: true,
      subscriptionEndDate: { $gte: today, $lte: threeDaysFromNow }
    }).sort({ subscriptionEndDate: 1 });

    res.json({ members: expiringMembers, count: expiringMembers.length });
  } catch (error) {
    console.error('Get expiring members error:', error);
    res.status(500).json({ message: 'Failed to get expiring members', error: error.message });
  }
};

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  sendReminder,
  getExpiringMembers
};