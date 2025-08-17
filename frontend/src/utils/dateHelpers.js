export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const formatDateForInput = (date) => {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

export const getDaysUntilExpiry = (endDate) => {
  if (!endDate) return 0
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const expiry = new Date(endDate)
  expiry.setHours(0, 0, 0, 0)
  
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

export const getSubscriptionStatus = (endDate) => {
  const daysUntilExpiry = getDaysUntilExpiry(endDate)
  
  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 3) return 'expiring-soon' 
  return 'active'
}

export const getStatusColor = (status) => {
  switch (status) {
    case 'expired': 
      return 'text-red-600 bg-red-100'
    case 'expiring-soon': 
      return 'text-orange-600 bg-orange-100'
    case 'active': 
      return 'text-green-600 bg-green-100'
    default: 
      return 'text-gray-600 bg-gray-100'
  }
}

export const debugMemberStatus = (member) => {
  const daysLeft = getDaysUntilExpiry(member.subscriptionEndDate)
  const status = getSubscriptionStatus(member.subscriptionEndDate)
  
  console.log(`Member: ${member.fullName}`)
  console.log(`End Date: ${member.subscriptionEndDate}`)
  console.log(`Days Left: ${daysLeft}`)
  console.log(`Status: ${status}`)
  console.log('---')
  
  return { daysLeft, status }
}