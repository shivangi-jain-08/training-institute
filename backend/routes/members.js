const express = require('express');
const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  sendReminder,
  getExpiringMembers
} = require('../controllers/memberController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.post('/', createMember);
router.get('/', getMembers);
router.get('/expiring', getExpiringMembers);
router.get('/:id', getMemberById);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);
router.post('/:id/reminder', sendReminder);

module.exports = router;