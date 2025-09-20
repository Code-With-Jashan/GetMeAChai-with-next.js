import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='bg-gray-900 text-white flex items-center justify-center px-4 h-16 w-[118vw] md:w-[100vw]'>
        <p className='text-center '>Copyright &copy; {currentYear} Get me A Chai - All rights reserved </p>
    </footer>
  )
}

export default Footer
