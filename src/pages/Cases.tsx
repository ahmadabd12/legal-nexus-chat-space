
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, PlayArrow, Archive, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCase } from '../contexts/CaseContext';

const Cases: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseDescription, setNewCaseDescription] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const { cases, createCase } = useCase();

  const filteredCases = cases.filter(case_ =>
    statusFilter === 'all' || case_.status === statusFilter
  );

  const handleCreateCase = async () => {
    if (newCaseTitle.trim()) {
      const newCase = await createCase(newCaseTitle, newCaseDescription);
      setOpenDialog(false);
      setNewCaseTitle('');
      setNewCaseDescription('');
      navigate(`/cases/${newCase.id}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayArrow fontSize="small" />;
      case 'completed': return <Archive fontSize="small" />;
      case 'archived': return <Archive fontSize="small" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'completed': return 'مكتمل';
      case 'archived': return 'مؤرشف';
      default: return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          القضايا القانونية
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          قضية جديدة
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FilterList fontSize="small" color="action" />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>الحالة</InputLabel>
            <Select
              value={statusFilter}
              label="الحالة"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">جميع القضايا</MenuItem>
              <MenuItem value="active">نشط</MenuItem>
              <MenuItem value="completed">مكتمل</MenuItem>
              <MenuItem value="archived">مؤرشف</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            {filteredCases.length} قضية
          </Typography>
        </Box>
      </Card>

      {/* Cases Grid */}
      <Grid container spacing={3}>
        {filteredCases.map((case_) => (
          <Grid item xs={12} md={6} lg={4} key={case_.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                    {case_.title}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(case_.status)}
                    label={getStatusText(case_.status)}
                    color={getStatusColor(case_.status) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {case_.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    الإنشاء: {case_.createdAt.toLocaleDateString('ar-QA')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    التحديث: {case_.updatedAt.toLocaleDateString('ar-QA')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    الرسائل: {case_.messages.length}
                  </Typography>
                </Box>

                <Box>
                  {case_.tags.slice(0, 3).map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 0.5, mb: 0.5 }}
                    />
                  ))}
                  {case_.tags.length > 3 && (
                    <Chip
                      label={`+${case_.tags.length - 3} المزيد`}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 0.5, mb: 0.5 }}
                    />
                  )}
                </Box>
              </CardContent>
              
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/cases/${case_.id}`)}
                  startIcon={<PlayArrow />}
                >
                  فتح القضية
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCases.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              {statusFilter === 'all' ? 'لا توجد قضايا بعد' : `لا توجد قضايا ${getStatusText(statusFilter)}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              أنشئ قضيتك الأولى للبدء في البحث القانوني
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)}
              startIcon={<Add />}
            >
              إنشاء قضية جديدة
            </Button>
          </CardContent>
        </Card>
      )}

      {/* New Case Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>إنشاء قضية جديدة</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="عنوان القضية"
            fullWidth
            variant="outlined"
            value={newCaseTitle}
            onChange={(e) => setNewCaseTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="الوصف"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newCaseDescription}
            onChange={(e) => setNewCaseDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
          <Button
            onClick={handleCreateCase}
            variant="contained"
            disabled={!newCaseTitle.trim()}
          >
            إنشاء القضية
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cases;
