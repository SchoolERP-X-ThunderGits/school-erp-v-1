import React, { useState, useEffect } from 'react';
import { showToast } from '../../../../components/Toast';
import { getService } from '../../../../constants/Service';
import apiName from '../../../../constants/ApiName';

// Example static data for dashboard
const dashboardData = {
  students: 14,
  classes: 9,
  sections: 13,
  payments: 4,
  recentTransactions: [
    { admissionNo: '1001', amount: 250, transactionId: 'TXN001', date: '2024-07-15' },
    { admissionNo: '1002', amount: 150, transactionId: 'TXN002', date: '2024-07-16' },
    { admissionNo: '1003', amount: 200, transactionId: 'TXN003', date: '2024-07-17' },
    { admissionNo: '1004', amount: 300, transactionId: 'TXN004', date: '2024-07-18' },
    { admissionNo: '1005', amount: 120, transactionId: 'TXN005', date: '2024-07-19' },
    { admissionNo: '1006', amount: 180, transactionId: 'TXN006', date: '2024-07-20' },
  ],
};

const AdminHome = () => {
  // You could replace static data with an API call to fetch dashboard data
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [payments, setPayments] = useState(dashboardData.payments);
  const [recentTransactions, setRecentTransactions] = useState(dashboardData.recentTransactions);

  // For searching transactions
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState(recentTransactions);

  useEffect(() => {
    fetchStudents()
    getClassList()
  }, [])
  // Handle search filter for recent transactions
  const fetchStudents = async () => {
    try {
      const result = await getService(apiName.getStudent); // API to get fee structures
      console.log('bvlblv',result)
      setStudents(result?.length)

    } catch (error) {
      showToast('Error fetching fee structures', 'error');
    }
  }
  const getClassList = async () => {
    try {
      const result = await getService(apiName.getClassList); // API endpoint (e.g. '/posts')
      console.log('bvbkvkbv', result)
      setClasses(result?.length)
      let totalSections = 0;
        result.forEach((cls) => {
          totalSections += cls.sections.length;
        });
        setSections(totalSections);
      // setClasses(result)
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterTransactions(value);
  };

  // Filter transactions based on search term
  const filterTransactions = (searchText) => {
    if (!searchText) {
      setFilteredTransactions(recentTransactions);
    } else {
      const filtered = recentTransactions.filter(
        (transaction) =>
          transaction.admissionNo.includes(searchText) ||
          transaction.transactionId.includes(searchText)
      );
      setFilteredTransactions(filtered);
    }
  };

  useEffect(() => {
    // Add any necessary useEffect logic if you want to fetch live data.
  }, []);

  return (
    <div className="dashboard-container">
      {/* Dashboard Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{students}</p>
        </div>
        <div className="stat-card">
          <h3>Total Classes</h3>
          <p>{classes}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sections</h3>
          <p>{sections}</p>
        </div>
        <div className="stat-card">
          <h3>Total Payments</h3>
          <p>{payments}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-section">
        <h2>Recent Transactions</h2>
        <input
          type="text"
          placeholder="Search by Admission No. or Transaction ID"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />

        <table className="transactions-table">
          <thead>
            <tr>
              <th>Admission No.</th>
              <th>Amount</th>
              <th>Transaction Id</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.admissionNo}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.transactionId}</td>
                <td>{transaction.date}</td>
                <td>
                  <button className="view-details-btn">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .stat-card h3 {
          font-size: 1.2rem;
          color: #555;
        }

        .stat-card p {
          font-size: 2rem;
          font-weight: bold;
          color: #2d3e50;
        }

        .transactions-section {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .transactions-section h2 {
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .search-input {
          padding: 10px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 400px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
        }

        .transactions-table th,
        .transactions-table td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .transactions-table th {
          background-color: #f4f4f4;
        }

        .view-details-btn {
          padding: 6px 12px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .view-details-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default AdminHome;
