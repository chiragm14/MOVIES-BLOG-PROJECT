import React from 'react'
import { Logo, LogoutBtn, Container } from '../index'
import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const authStatus = useSelector(state => state.auth.status);

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: true,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Sign Up",
      slug: "/signup",
      active: !authStatus,
      isButton: true,
    },
  ];

  return (
    <header className='sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-gray-800/80 transition-all'>
      <Container>
        <nav className='flex items-center justify-between py-3 px-2 sm:px-4'>
          {/* Logo & Brand */}
          <Link to='/' className='flex items-center gap-3 group'>
            <div className='p-1.5 rounded-xl bg-gradient-to-br from-red-600/20 via-rose-600/10 to-transparent border border-red-500/30 group-hover:border-red-500/50 shadow-sm transition-all'>
              <Logo width="46px" height="46px" />
            </div>
            <div className='flex flex-col text-left'>
              <span className='text-xl font-black tracking-tight text-white leading-tight'>
                Cine<span className="text-red-500">Blog</span>
              </span>
              <span className='text-[10px] tracking-widest uppercase font-bold text-red-500/90'>
                Movies & Reviews
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <ul className='flex items-center gap-1 sm:gap-2'>
            {navItems.map((item) => (
              item.active ? (
                <li key={item.name}>
                  {item.isButton ? (
                    <NavLink
                      to={item.slug}
                      end
                      className="inline-block ml-1 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-sm shadow-red-900/40 transition-all"
                    >
                      {item.name}
                    </NavLink>
                  ) : (
                    <NavLink
                      to={item.slug}
                      end
                      className={({ isActive }) =>
                        `inline-block px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                          isActive
                            ? 'text-white bg-gray-800/90 shadow-inner'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  )}
                </li>
              ) : null
            ))}
            {authStatus && (
              <li className="ml-1">
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header