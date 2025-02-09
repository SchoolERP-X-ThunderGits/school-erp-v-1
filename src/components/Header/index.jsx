import React from 'react'

function index() {
  return (
    <div className="header-to-hide" style={{
      borderBottomWidth: 2, 
      borderBottomColor: 'gray', 
      paddingTop: 20, 
      paddingBottom: 20,
      backgroundColor: '#f0f0f0'
    }}>
      <h1 style={{
        textAlign: 'center', 
        fontSize: '30px', 
        fontWeight: 'bold', 
        color: '#2C3E50', 
        letterSpacing: '2px', 
        textTransform: 'uppercase', 
        fontFamily: 'Arial, sans-serif',
        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
      }}>
        Shakti Vidhya Mandir School, Jaipur
      </h1>
    </div>
  )
}

export default index;
