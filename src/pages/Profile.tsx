
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Avatar,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { Edit, Save, Person } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organization: user?.organization || '',
  });
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    autoSave: true,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    // In a real app, this would call an API to update user data
    setEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        الملف الشخصي والإعدادات
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          تم تحديث الملف الشخصي بنجاح!
        </Alert>
      )}

      {/* Profile Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, ml: 3, bgcolor: 'primary.main' }}>
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.organization}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              المعلومات الشخصية
            </Typography>
            <Button
              startIcon={editing ? <Save /> : <Edit />}
              onClick={editing ? handleSave : () => setEditing(true)}
              variant={editing ? 'contained' : 'outlined'}
            >
              {editing ? 'حفظ' : 'تعديل'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="الاسم الكامل"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!editing}
              fullWidth
            />
            <TextField
              label="البريد الإلكتروني"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!editing}
              fullWidth
            />
            <TextField
              label="المؤسسة"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              disabled={!editing}
              fullWidth
            />
          </Box>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            إعدادات التطبيق
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                />
              }
              label="الوضع المظلم"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                />
              }
              label="إشعارات البريد الإلكتروني"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoSave}
                  onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                />
              }
              label="حفظ القضايا تلقائياً"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            إجراءات الحساب
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              تسجيل الخروج
            </Button>
            <Button variant="outlined" color="warning">
              تغيير كلمة المرور
            </Button>
            <Button variant="outlined" color="error">
              حذف الحساب
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
