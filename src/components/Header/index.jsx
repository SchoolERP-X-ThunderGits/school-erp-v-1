import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

function index(props) {
  const { school} = useUserContext();
  console.log('schoo111l',school)
  return (
    <div
      className="header-to-hide"
      style={{
        borderBottomWidth: 2,
        borderBottomColor: 'gray',
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#f0f0f0',
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4">
        {/* Sidebar Hamburger Toggle Button */}
        <button
          aria-controls="sidebar"
          onClick={(e) => {
            e.stopPropagation();
            props.setSidebarOpen(!props.sidebarOpen);
          }}
          className="block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
        >
          <span className="relative block h-5.5 w-5.5 cursor-pointer">
            <span className="du-block absolute right-0 h-full w-full">
              <span
                className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                  !props.sidebarOpen && '!w-full delay-300'
                }`}
              ></span>
              <span
                className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                  !props.sidebarOpen && 'delay-400 !w-full'
                }`}
              ></span>
              <span
                className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                  !props.sidebarOpen && '!w-full delay-500'
                }`}
              ></span>
            </span>
            <span className="absolute right-0 h-full w-full rotate-45">
              <span
                className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                  !props.sidebarOpen && '!h-0 !delay-[0]'
                }`}
              ></span>
              <span
                className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                  !props.sidebarOpen && '!h-0 !delay-200'
                }`}
              ></span>
            </span>
          </span>
        </button>

        {/* Logo */}
        <Link className="block flex-shrink-0 lg:hidden" to="/">
          <img style={{ height: 40, width: 40,backgroundColor:'#1c2534' }} src={school?.logo} alt="Logo" />
        </Link>

        {/* School Name */}
        <h1
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#2C3E50',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: 'Arial, sans-serif',
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
            flex: 1, // To make sure it takes the remaining space
            textAlign: 'center',
          }}
        >
          {school?.name}
        </h1>
      </div>
    </div>
  );
}

export default index;
