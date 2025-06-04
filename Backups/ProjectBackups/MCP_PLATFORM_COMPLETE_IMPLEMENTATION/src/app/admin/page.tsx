'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import {
  Users,
  Download,
  AlertTriangle,
  Shield,
  Activity,
  Globe,
  Clock,
  Mail,
  Database,
  Zap,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  Filter,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { useAdminStats, useAdminDevices } from '@/lib/hooks/useApi'

export default function AdminDashboard() {
  // Auth state
  const [apiKey, setApiKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'alerts'>('overview')
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds

  // API hooks
  const { stats, loading: statsLoading, error: statsError, fetchStats, refreshStats } = useAdminStats(apiKey)
  const { devices, loading: devicesLoading, error: devicesError, pagination, fetchDevices, performDeviceAction } = useAdminDevices(apiKey)

  // Filters
  const [deviceFilters, setDeviceFilters] = useState({
    status: '',
    search: ''
  })

  // Auto-refresh
  useEffect(() => {
    if (!isAuthenticated || !apiKey) return

    const interval = setInterval(() => {
      if (activeTab === 'overview') {
        fetchStats()
      } else if (activeTab === 'devices') {
        fetchDevices(1, deviceFilters)
      }
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, apiKey, activeTab, refreshInterval, deviceFilters])

  // Initial load
  useEffect(() => {
    if (isAuthenticated && apiKey) {
      fetchStats()
      fetchDevices(1, deviceFilters)
    }
  }, [isAuthenticated, apiKey])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      setIsAuthenticated(true)
    }
  }

  const handleDeviceAction = async (action: string, deviceFingerprint: string, extraData?: any) => {
    const success = await performDeviceAction(action as any, deviceFingerprint, extraData)
    if (success) {
      fetchDevices(pagination.page, deviceFilters) // Refresh devices
      fetchStats() // Refresh stats
    }
    return success
  }

  // Auth screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">MCP Platform Admin</h1>
            <p className="text-gray-400">Inserisci la tua API key per accedere</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Admin API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:bg-white/10 transition-all duration-300"
                  placeholder="Inserisci API key..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
            >
              Accedi alla Dashboard
            </motion.button>
          </form>
        </motion.div>
      </div>
    )
  }

  // Stats cards data
  const statsCards = [
    {
      title: 'Dispositivi Totali',
      value: stats?.total_devices || 0,
      icon: Users,
      color: 'text-primary-400',
      bgColor: 'bg-primary-400/10'
    },
    {
      title: 'Trial Attivi',
      value: stats?.active_trials || 0,
      icon: Activity,
      color: 'text-success-400',
      bgColor: 'bg-success-400/10'
    },
    {
      title: 'Download Oggi',
      value: stats?.downloads_today || 0,
      icon: Download,
      color: 'text-warning-400',
      bgColor: 'bg-warning-400/10'
    },
    {
      title: 'Alert Non Risolti',
      value: stats?.alerts_unresolved || 0,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    }
  ]

  // Chart colors
  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MCP Platform Admin</h1>
              <p className="text-gray-400 text-sm">Dashboard di monitoraggio</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Auto-refresh toggle */}
            <div className="flex items-center space-x-2 text-gray-400">
              <RefreshCw className="w-4 h-4" />
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white"
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>1m</option>
                <option value={300}>5m</option>
              </select>
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mt-4">
          {[
            { id: 'overview', label: 'Panoramica', icon: BarChart },
            { id: 'devices', label: 'Dispositivi', icon: Users },
            { id: 'alerts', label: 'Alert', icon: AlertTriangle }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {statsLoading ? (
                          <Loader2 className="w-8 h-8 animate-spin" />
                        ) : (
                          card.value.toLocaleString()
                        )}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Countries Chart */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Paesi</h3>
                {stats?.top_countries && stats.top_countries.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.top_countries}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        nameKey="country"
                      >
                        {stats.top_countries.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-300 text-gray-400">
                    Nessun dato disponibile
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Attività Recente</h3>
                <div className="space-y-3 max-h-300 overflow-y-auto">
                  {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                    stats.recent_activity.map((event, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <Activity className="w-4 h-4 text-primary-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">{event.event_type}</p>
                          <p className="text-gray-400 text-xs truncate">
                            {event.device_fingerprint?.substring(0, 12)}...
                          </p>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      Nessuna attività recente
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cerca per email o device fingerprint..."
                      value={deviceFilters.search}
                      onChange={(e) => setDeviceFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-400"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={deviceFilters.status}
                    onChange={(e) => setDeviceFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-400"
                  >
                    <option value="">Tutti gli stati</option>
                    <option value="active">Attivi</option>
                    <option value="expired">Scaduti</option>
                    <option value="banned">Bannati</option>
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchDevices(1, deviceFilters)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtra</span>
                </motion.button>
              </div>
            </div>

            {/* Devices Table */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">País</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Scadenza</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {devicesLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-400" />
                        </td>
                      </tr>
                    ) : devices.length > 0 ? (
                      devices.map((device, index) => (
                        <tr key={device.device_fingerprint} className="hover:bg-white/5">
                          <td className="px-6 py-4">
                            <div className="text-white font-mono text-sm">
                              {device.device_fingerprint.substring(0, 12)}...
                            </div>
                            <div className="text-gray-400 text-xs">
                              {device.total_launches} avvii
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white text-sm">
                              {device.email || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              device.status === 'active' 
                                ? 'bg-success-400/20 text-success-400'
                                : device.status === 'expired'
                                ? 'bg-warning-400/20 text-warning-400'
                                : 'bg-red-400/20 text-red-400'
                            }`}>
                              {device.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white text-sm">
                            {device.country || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-white text-sm">
                            {new Date(device.trial_expires).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              {device.status !== 'banned' && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeviceAction('ban', device.device_fingerprint)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                  title="Ban device"
                                >
                                  <Ban className="w-4 h-4" />
                                </motion.button>
                              )}
                              {device.status === 'banned' && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeviceAction('unban', device.device_fingerprint)}
                                  className="text-success-400 hover:text-success-300 transition-colors"
                                  title="Unban device"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeviceAction('extend_trial', device.device_fingerprint, { hours: 24 })}
                                className="text-primary-400 hover:text-primary-300 transition-colors"
                                title="Estendi trial (+24h)"
                              >
                                <Clock className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                          Nessun dispositivo trovato
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="bg-white/5 px-6 py-3 flex items-center justify-between">
                  <div className="text-gray-400 text-sm">
                    Mostrando {devices.length} di {pagination.total} dispositivi
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fetchDevices(pagination.page - 1, deviceFilters)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 bg-white/5 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Prev
                    </motion.button>
                    <span className="px-3 py-1 text-white">
                      {pagination.page} / {pagination.pages}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fetchDevices(pagination.page + 1, deviceFilters)}
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-1 bg-white/5 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sistema Alert</h3>
              <p className="text-gray-400">
                Il sistema di alert verrà implementato nella prossima versione. 
                Include monitoraggio comportamenti sospetti, tentativi di bypass e anomalie del sistema.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
