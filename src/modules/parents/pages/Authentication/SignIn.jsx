import React from 'react'

function SignIn() {
  
  const handleParentLogin = () => {
    navigate('/parent/login');
  };


  return (
    <div>
    
    <button onClick={handleParentLogin}>Parent SignIn</button>
      
    </div>
  )
}

export default SignIn