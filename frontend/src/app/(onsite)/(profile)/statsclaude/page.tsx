'use client';
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  User2, 
  Zap, 
  Award,
  Users,
  Activity,
  BarChart3,
  PieChart,
  Timer,
  Play,
  Crown,
  Medal,
  Flame
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';

const data = {
  gameTypeDistData: [
    { type: "Ping Pong", percent: 56, color: "#8B5CF6" },
    { type: "Tic Tac Toe", percent: 44, color: "#06B6D4" },
  ],
  gameModeDistData: [
    { type: "Casual", percent: 22, color: "#10B981" },
    { type: "1v1", percent: 33, color: "#F59E0B" },
    { type: "Tournaments", percent: 24, color: "#EF4444" },
    { type: "Training", percent: 21, color: "#8B5CF6" },
  ],
  winLossDist: [
    { type: 'Wins', percent: 63, color: '#10B981' },
    { type: 'Losses', percent: 30, color: '#EF4444' },
    { type: 'Draws', percent: 7, color: '#F59E0B' }
  ],
  winRateTrend: [
    { date: '2023-01-01', winRate: 50 },
    { date: '2023-01-02', winRate: 55 },
    { date: '2023-01-03', winRate: 48 },
    { date: '2023-01-04', winRate: 62 },
    { date: '2023-01-05', winRate: 68 },
    { date: '2023-01-06', winRate: 73 },
    { date: '2023-01-07', winRate: 71 }
  ],
  avgScoreData: [
    { date: "2023-01-01", avgScore: 15.5 },
    { date: "2023-01-02", avgScore: 16.2 },
    { date: "2023-01-03", avgScore: 14.8 },
    { date: "2023-01-04", avgScore: 18.1 },
    { date: "2023-01-05", avgScore: 17.6 },
    { date: "2023-01-06", avgScore: 19.2 },
    { date: "2023-01-07", avgScore: 18.8 }
  ],
  gamesPerDay: [
    { date: "2023-01-01", games: 5 },
    { date: "2023-01-02", games: 9 },
    { date: "2023-01-03", games: 10 },
    { date: "2023-01-04", games: 7 },
    { date: "2023-01-05", games: 12 },
    { date: "2023-01-06", games: 8 },
    { date: "2023-01-07", games: 11 }
  ],
  timeSpent: [
    { date: "2023-01-01", timeSpent: 2.5 },
    { date: "2023-01-02", timeSpent: 3.2 },
    { date: "2023-01-03", timeSpent: 4.1 },
    { date: "2023-01-04", timeSpent: 2.8 },
    { date: "2023-01-05", timeSpent: 3.7 },
    { date: "2023-01-06", timeSpent: 2.9 },
    { date: "2023-01-07", timeSpent: 3.5 }
  ]
};

function StatCard({ title, value, subtitle, trend, icon, className = "" }) {
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-amber-400';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;
  
  return (
    <div className={`group bg-slate-900/50 border border-slate-700/50 rounded-xl backdrop-blur-sm p-6 hover:bg-slate-800/50 transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon size={16} />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className={`text-sm ${trendColor}`}>{subtitle}</p>
      </div>
    </div>
  );
}

function DetailCard({ title, items, className = "" }) {
  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-xl backdrop-blur-sm p-6 hover:bg-slate-800/50 transition-all duration-300 hover:border-violet-500/30 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">{item.label}</span>
            <span className={`font-bold text-lg ${item.valueClass || "text-white"}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, chart, className = "" }) {
  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-xl backdrop-blur-sm p-6 hover:bg-slate-800/50 transition-all duration-300 hover:border-violet-500/30 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-violet-400 mt-1">{subtitle}</p>
      </div>
      <div className="h-64">
        {chart}
      </div>
    </div>
  );
}

function CustomLineChart({ data, dataKey, color = "#8B5CF6" }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F9FAFB'
          }} 
        />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={3}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CustomPieChart({ data, nameKey, dataKey }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        {/* <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie> */}
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F9FAFB'
          }} 
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

function CustomBarChart({ data, dataKey, color = "#8B5CF6" }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F9FAFB'
          }} 
        />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function EnhancedStatsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Your Gaming Stats
              </h1>
              <p className="text-slate-400 text-lg">Track your performance and improve your game</p>
            </div>
            <div className="flex gap-2">
              {['day', 'week', 'month'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Matches"
            value="247"
            subtitle="156W / 73L / 18D"
            trend="up"
            icon={<Trophy size={24} className="text-white" />}
          />
          <StatCard
            title="Win Rate"
            value="73.1%"
            subtitle="+2.1% from last month"
            trend="up"
            icon={<Award size={24} className="text-white" />}
          />
          <StatCard
            title="Points Scored"
            value="3,842"
            subtitle="+951 net differential"
            trend="up"
            icon={<Target size={24} className="text-white" />}
          />
          <StatCard
            title="Time Played"
            value="307h"
            subtitle="Average 45min/day"
            trend="neutral"
            icon={<Clock size={24} className="text-white" />}
          />
        </section>

        {/* Performance Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <ChartCard
            title="Win Rate Trend"
            subtitle="Your performance over time"
            chart={<CustomLineChart data={data.winRateTrend} dataKey="winRate" color="#10B981" />}
          />
          
          <ChartCard
            title="Win/Loss Distribution"
            subtitle="Match outcome breakdown"
            chart={<CustomPieChart data={data.winLossDist} nameKey="type" dataKey="percent" />}
          />
          
          <ChartCard
            title="Games Per Day"
            subtitle="Daily activity levels"
            chart={<CustomBarChart data={data.gamesPerDay} dataKey="games" color="#8B5CF6" />}
          />
        </section>

        {/* Detailed Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <DetailCard
            title="Today's Performance"
            items={[
              { label: "Matches Played", value: "12", valueClass: "text-blue-400" },
              { label: "Wins", value: "8", valueClass: "text-green-400" },
              { label: "Losses", value: "3", valueClass: "text-red-400" },
              { label: "Draws", value: "1", valueClass: "text-yellow-400" }
            ]}
          />
          
          <DetailCard
            title="Score Records"
            items={[
              { label: "Highest Score", value: "45", valueClass: "text-green-400" },
              { label: "Lowest Score", value: "2", valueClass: "text-red-400" },
              { label: "Average Score", value: "18.6", valueClass: "text-blue-400" }
            ]}
          />
          
          <DetailCard
            title="Match Duration"
            items={[
              { label: "Longest Match", value: "47m", valueClass: "text-purple-400" },
              { label: "Shortest Match", value: "3m", valueClass: "text-cyan-400" },
              { label: "Average Match", value: "15m", valueClass: "text-yellow-400" }
            ]}
          />
          
          <DetailCard
            title="Streaks"
            items={[
              { label: "Current Streak", value: "5W", valueClass: "text-green-400" },
              { label: "Best Win Streak", value: "12W", valueClass: "text-emerald-400" },
              { label: "Worst Loss Streak", value: "4L", valueClass: "text-red-400" }
            ]}
          />
        </section>

        {/* Advanced Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Clutch Wins"
            value="23"
            subtitle="14.7% of total wins"
            trend="up"
            icon={<Flame size={24} className="text-white" />}
          />
          <StatCard
            title="Perfect Games"
            value="7"
            subtitle="2.8% of matches"
            trend="up"
            icon={<Crown size={24} className="text-white" />}
          />
          <StatCard
            title="Comeback Victories"
            value="18"
            subtitle="11.5% of wins"
            trend="up"
            icon={<Zap size={24} className="text-white" />}
          />
          <StatCard
            title="Tournament Wins"
            value="4"
            subtitle="67% tournament rate"
            trend="up"
            icon={<Medal size={24} className="text-white" />}
          />
        </section>

        {/* Opponent Analysis */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Users size={28} className="text-violet-400" />
            Opponent Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Favorite Opponent"
              value="sabona"
              subtitle="68% win rate (17/25)"
              trend="up"
              icon={<User2 size={24} className="text-white" />}
            />
            <StatCard
              title="Most Played"
              value="iassil"
              subtitle="55 total matches"
              trend="neutral"
              icon={<Play size={24} className="text-white" />}
            />
            <StatCard
              title="Toughest Rival"
              value="xezzuz"
              subtitle="23% win rate (5/22)"
              trend="down"
              icon={<Target size={24} className="text-white" />}
            />
            <StatCard
              title="Unique Opponents"
              value="42"
              subtitle="Active community"
              trend="up"
              icon={<Users size={24} className="text-white" />}
            />
          </div>
        </section>

        {/* Time Analysis */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <BarChart3 size={28} className="text-violet-400" />
            Time Analysis
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartCard
              title="Average Score Trends"
              subtitle="Score performance over time"
              chart={<CustomLineChart data={data.avgScoreData} dataKey="avgScore" color="#F59E0B" />}
            />
            <ChartCard
              title="Daily Time Spent"
              subtitle="Hours played per day"
              chart={<CustomBarChart data={data.timeSpent} dataKey="timeSpent" color="#06B6D4" />}
            />
          </div>
        </section>
      </div>
    </div>
  );
}