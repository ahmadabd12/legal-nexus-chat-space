
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  Description,
  Gavel,
  Person,
  Menu as MenuIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const drawerWidth = 280;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'لوحة التحكم', icon: <Dashboard />, path: '/dashboard' },
    { text: 'المستندات', icon: <Description />, path: '/documents' },
    { text: 'القضايا', icon: <Gavel />, path: '/cases' },
    { text: 'الملف الشخصي', icon: <Person />, path: '/profile' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Qatar.svg/320px-Flag_of_Qatar.svg.png" 
          alt="وزارة التجارة والصناعة قطر" 
          style={{ width: 40, height: 30 }}
        />
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
          البحث القانوني
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{ textAlign: 'right' }}
            >
              <ListItemText primary={item.text} sx={{ textAlign: 'right' }} />
              <ListItemIcon sx={{ minWidth: 'auto', marginLeft: 2 }}>{item.icon}</ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Qatar.svg/320px-Flag_of_Qatar.svg.png" 
              alt="قطر" 
              style={{ width: 32, height: 24 }}
            />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
              منصة البحث القانوني - وزارة التجارة والصناعة
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {user?.name}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
          الملف الشخصي
        </MenuItem>
        <MenuItem onClick={handleLogout}>تسجيل الخروج</MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
