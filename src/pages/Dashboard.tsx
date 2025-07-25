import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { Add, Search, Folder, PlayArrow, Archive } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCase } from "../contexts/CaseContext";
import { useAuth } from "../hooks/useAuth";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { cases, createCase } = useCase();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseDescription, setNewCaseDescription] = useState("");
  const recentCases = cases.slice(0, 6);

  const handleNewCase = async () => {
    const newCase = await createCase(
      "بحث قانوني جديد",
      "قضية جديدة - انقر لإضافة وصف"
    );
    navigate(`/cases/${newCase.id}`);
  };
  const handleCreateCase = async () => {
    if (newCaseTitle.trim()) {
      const newCase = await createCase(newCaseTitle, newCaseDescription);
      setOpenDialog(false);
      setNewCaseTitle("");
      setNewCaseDescription("");
      navigate(`/cases/${newCase.id}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "primary";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return (
          <PlayArrow fontSize="small" sx={{ transform: "rotate(180deg)" }} />
        );
      case "completed":
        return <Folder fontSize="small" />;
      case "archived":
        return <Archive fontSize="small" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "completed":
        return "مكتمل";
      case "archived":
        return "مؤرشف";
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          مرحباً بك، {user?.name?.split(" ")[0]}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          تابع بحثك القانوني أو ابدأ تحليل قضية جديدة
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: "pointer" }} onClick={() => setOpenDialog(true)}>
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <Add fontSize="large" color="primary" sx={{ mb: 1 }} />
              <Typography variant="h6">قضية جديدة</Typography>
              <Typography variant="body2" color="text.secondary">
                ابدأ بحثاً جديداً
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/documents")}
          >
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <Search fontSize="large" color="primary" sx={{ mb: 1 }} />
              <Typography variant="h6">بحث سريع</Typography>
              <Typography variant="body2" color="text.secondary">
                البحث في المستندات
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/documents")}
          >
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <Folder fontSize="large" color="primary" sx={{ mb: 1 }} />
              <Typography variant="h6"> تصفح المستندات</Typography>
              <Typography variant="body2" color="text.secondary">
                استكشف الموارد
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: "pointer" }} onClick={() => navigate("/cases")}>
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <Archive fontSize="large" color="primary" sx={{ mb: 1 }} />
              <Typography variant="h6">جميع القضايا</Typography>
              <Typography variant="body2" color="text.secondary">
                عرض تاريخ القضايا
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Cases */}
      <Typography variant="h5" component="h2" gutterBottom>
        القضايا الأخيرة
      </Typography>
      <Grid container spacing={3}>
        {recentCases.map((case_) => (
          <Grid item xs={12} md={6} lg={4} key={case_.id}>
            <Card>
              <CardContent
                sx={{
                  minWidth: "250px",
                  height: "100%",
                  display: "flex",
                  minHeight: "180px",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                    {case_.title}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(case_.status)}
                    label={getStatusText(case_.status)}
                    color={getStatusColor(case_.status) as any}
                    size="small"
                    sx={{ flexDirection: "row-reverse" }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {case_.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  آخر تحديث: {case_.updatedAt.toLocaleDateString("ar-QA")}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {case_.tags.slice(0, 3).map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  sx={{
                    flexDirection: "row-reverse",
                  }}
                  onClick={() => navigate(`/cases/${case_.id}`)}
                  startIcon={<PlayArrow sx={{ transform: "rotate(180deg)" }} />}
                >
                  فتح القضية
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {recentCases.length === 0 && (
        <Card sx={{ textAlign: "center", py: 4 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              لا توجد قضايا بعد
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              أنشئ قضيتك الأولى للبدء في البحث القانوني
            </Typography>
            <Button
              variant="contained"
              onClick={handleNewCase}
              startIcon={<Add />}
            >
              إنشاء قضية جديدة
            </Button>
          </CardContent>
        </Card>
      )}
      {/* New Case Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        slots={{ transition: Zoom }}
      >
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

export default Dashboard;
