import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { memberAPI } from '../../services/api'
import { Users, UserPlus, AlertTriangle, Calendar } from 'lucide-react'
import Loading from '../Common/Loading'
import { formatDate, getSubscriptionStatus } from '../../utils/dateHelpers'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    expiringMembers: 0,
    expiredMembers: 0
  })
  const [expiringMembers, setExpiringMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all members for stats
      const [membersResponse, expiringResponse] = await Promise.all([
        memberAPI.getMembers({ limit: 1000 }),
        memberAPI.getExpiringMembers()
      ])

      const allMembers = membersResponse.data.members
      setExpiringMembers(expiringResponse.data.members)

      // Calculate stats
      const totalMembers = allMembers.length
      const activeMembers = allMembers.filter(m => getSubscriptionStatus(m.subscriptionEndDate) === 'active').length
      const expiringMembers = allMembers.filter(m => getSubscriptionStatus(m.subscriptionEndDate) === 'expiring-soon').length
      const expiredMembers = allMembers.filter(m => getSubscriptionStatus(m.subscriptionEndDate) === 'expired').length

      setStats({
        totalMembers,
        activeMembers,
        expiringMembers,
        expiredMembers
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading text="Loading dashboard..." />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-950/20'
    },
    {
      title: 'Active Members',
      value: stats.activeMembers,
      icon: Users,
      color: 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400',
      bgColor: 'bg-success-50 dark:bg-success-950/20'
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringMembers,
      icon: AlertTriangle,
      color: 'bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400',
      bgColor: 'bg-warning-50 dark:bg-warning-950/20'
    },
    {
      title: 'Expired',
      value: stats.expiredMembers,
      icon: Calendar,
      color: 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400',
      bgColor: 'bg-danger-50 dark:bg-danger-950/20'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Dashboard</h1>
          <p className="text-secondary-600 dark:text-secondary-400">Overview of your institute members</p>
        </div>
        
        <Link 
          to="/members/add"
          className="mt-4 sm:mt-0 btn-primary inline-flex items-center space-x-2"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add New Member</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className={`card card-hover p-6 ${card.bgColor} border-0 animate-slide-up`} style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">{card.value}</p>
                </div>
                <div className={`${card.color} p-4 rounded-2xl shadow-soft dark:shadow-soft-dark`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Expiring Members */}
      <div className="card animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Members Expiring Soon</h2>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Subscriptions ending within 3 days</p>
            </div>
            {expiringMembers.length > 0 && (
              <Link 
                to="/members?filter=expiring-soon"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            )}
          </div>
        </div>

        <div className="p-6">
          {expiringMembers.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-secondary-400 dark:text-secondary-500" />
              </div>
              <p className="text-secondary-500 dark:text-secondary-400 font-medium">No members expiring soon</p>
              <p className="text-sm text-secondary-400 dark:text-secondary-500 mt-1">All subscriptions are up to date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiringMembers.slice(0, 5).map((member, index) => (
                <div key={member._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-warning-50 to-warning-100 rounded-xl border border-warning-200 hover:shadow-soft transition-all duration-200 animate-slide-up" style={{ animationDelay: `${500 + index * 100}ms` }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-soft">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-900">{member.fullName}</p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">{member.contactNumber}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-warning-700">
                      Expires: {formatDate(member.subscriptionEndDate)}
                    </p>
                    <p className="text-xs text-warning-600">
                      {member.daysUntilExpiry} days left
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/members"
            className="group flex items-center space-x-4 p-5 border border-secondary-200 dark:border-secondary-700 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-950/20 dark:hover:to-primary-900/20 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200 hover:shadow-soft dark:hover:shadow-soft-dark"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft dark:shadow-soft-dark group-hover:scale-110 transition-transform duration-200">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-primary-900 dark:group-hover:text-primary-100">View All Members</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">Manage and search members</p>
            </div>
          </Link>
          
          <Link 
            to="/members/add"
            className="group flex items-center space-x-4 p-5 border border-secondary-200 dark:border-secondary-700 rounded-xl hover:bg-gradient-to-r hover:from-success-50 hover:to-success-100 dark:hover:from-success-900/20 dark:hover:to-success-900/20 hover:border-success-200 dark:hover:border-success-800 transition-all duration-200 hover:shadow-soft dark:hover:shadow-soft-dark"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-soft dark:shadow-soft-dark group-hover:scale-110 transition-transform duration-200">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-success-900 dark:group-hover:text-success-100">Add New Member</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 group-hover:text-success-600 dark:group-hover:text-success-400">Register a new member</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard