import React from 'react'
import TempStats from './TempStats'
import TempTable from './TempTable'


const Dashboard = () => {
  return (
    <div className="p-6">
        <div className="hero bg-base-100 rounded-lg shadow-xl">
          <div className="hero-content text-center">
            <div className="max-w-lg">
              <h1 className="text-5xl font-bold">Welcome, Integrity Specialists</h1>
              <p className="py-6">Click Below to get started on a new Dig</p>
              <button className="btn btn-primary ">Create New Dig</button>
              <TempStats />
              <TempTable />
            </div>
          </div>
        </div>
      </div>
  )
}

export default Dashboard