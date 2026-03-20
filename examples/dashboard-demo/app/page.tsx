'use client';

import { motion } from 'framer-motion';
import { BarChart3, Users, DollarSign, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const metrics = [
  { name: 'Total Revenue', value: '$45,231', change: '+12.5%', up: true, icon: DollarSign },
  { name: 'Active Users', value: '2,340', change: '+8.2%', up: true, icon: Users },
  { name: 'Total Orders', value: '1,284', change: '-3.1%', up: false, icon: ShoppingCart },
  { name: 'Conversion', value: '3.24%', change: '+2.4%', up: true, icon: TrendingUp },
];

const chartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Emma Watson', amount: '$299.00', status: 'Completed' },
  { id: '#ORD-002', customer: 'James Chen', amount: '$149.00', status: 'Pending' },
  { id: '#ORD-003', customer: 'Sarah Miller', amount: '$499.00', status: 'Completed' },
  { id: '#ORD-004', customer: 'Michael Park', amount: '$89.00', status: 'Processing' },
  { id: '#ORD-005', customer: 'Lisa Wang', amount: '$199.00', status: 'Completed' },
];

function SimpleBarChart({ data }: { data: typeof chartData }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between h-40 gap-2">
      {data.map((item, i) => {
        const height = (item.value / maxValue) * 100;
        return (
          <div key={item.name} className="flex flex-col items-center flex-1">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="w-full bg-emerald-500/20 rounded-t"
              style={{ minHeight: '8px' }}
            />
            <span className="text-xs text-gray-500 mt-2">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-400">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors">
              Download Report
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${metric.up ? 'text-emerald-500' : 'text-red-500'}`}>
                    {metric.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {metric.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                <p className="text-sm text-gray-400">{metric.name}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Revenue Overview</h3>
              <select className="bg-gray-800 text-sm rounded-lg px-3 py-1 border border-gray-700">
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
            <SimpleBarChart data={chartData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Sales by Category</h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {[
                { name: 'Electronics', value: 45, color: 'bg-blue-500' },
                { name: 'Clothing', value: 30, color: 'bg-purple-500' },
                { name: 'Home & Garden', value: 15, color: 'bg-emerald-500' },
                { name: 'Sports', value: 10, color: 'bg-orange-500' },
              ].map((cat) => (
                <div key={cat.name} className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 w-32">{cat.name}</span>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cat.value}%` }}
                      viewport={{ once: true }}
                      className={`h-full ${cat.color} rounded-full`}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-12">{cat.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold">Recent Orders</h3>
            <button className="text-sm text-emerald-500 hover:text-emerald-400">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-gray-400">{order.id}</td>
                    <td className="px-6 py-4 text-sm">{order.customer}</td>
                    <td className="px-6 py-4 text-sm font-medium">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
