// frontend-prototype/app/page.tsx
import React from "react";

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">GroceryBag Pro</h1>
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Sales</p>
          <h2 className="text-xl font-bold">₹12,500</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Outstanding</p>
          <h2 className="text-xl font-bold">₹3,200</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Today’s Purchases</p>
          <h2 className="text-xl font-bold">30 bags</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Customers</p>
          <h2 className="text-xl font-bold">42</h2>
        </div>
      </div>

      {/* Recent Purchases Section */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-2">Recent Purchases</h3>
        <ul className="space-y-2">
          <li className="flex justify-between text-sm text-gray-700">
            <span>10kg Bag × 20</span>
            <span>₹1000</span>
          </li>
          <li className="flex justify-between text-sm text-gray-700">
            <span>5kg Bag × 15</span>
            <span>₹600</span>
          </li>
        </ul>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 flex justify-around">
        <button className="text-blue-600 font-semibold">Home</button>
        <button className="text-gray-400 font-medium">Purchase</button>
        <button className="text-gray-400 font-medium">Sales</button>
        <button className="text-gray-400 font-medium">Profile</button>
      </div>

    </div>
  );
}
