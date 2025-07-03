
import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Grid2 as Grid,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, FilterList, Description } from '@mui/icons-material';
import { useSearch, SearchMode, SearchResult } from '../hooks/useSearch';

const Documents: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('semantic');
  const [lawFilter, setLawFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [page, setPage] = useState(1);
  const { search, loading, results } = useSearch();

  const handleSearch = () => {
    if (query.trim()) {
      search(query, searchMode);
    }
  };

  const handleSearchModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: SearchMode | null,
  ) => {
    if (newMode !== null) {
      setSearchMode(newMode);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Opening document:', result.id);
    // In a real app, this would open the document viewer
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        مكتبة المستندات
      </Typography>
      
      {/* Search Section */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="البحث في المستندات القانونية..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ minWidth: 200 }}
          />
          <ToggleButtonGroup
            value={searchMode}
            exclusive
            onChange={handleSearchModeChange}
            size="small"
          >
            <ToggleButton value="semantic">
              دلالي
            </ToggleButton>
            <ToggleButton value="vector">
              متجه
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={handleSearch}
            disabled={!query.trim() || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'بحث'}
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FilterList fontSize="small" color="action" />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>مجال القانون</InputLabel>
            <Select
              value={lawFilter}
              label="مجال القانون"
              onChange={(e) => setLawFilter(e.target.value)}
            >
              <MenuItem value="all">جميع المجالات</MenuItem>
              <MenuItem value="contract">قانون العقود</MenuItem>
              <MenuItem value="employment">العمل</MenuItem>
              <MenuItem value="corporate">الشركات</MenuItem>
              <MenuItem value="criminal">الجنائي</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>السنة</InputLabel>
            <Select
              value={yearFilter}
              label="السنة"
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <MenuItem value="all">جميع السنوات</MenuItem>
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="older">أقدم</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Results */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {results.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            نتائج البحث ({results.length})
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {results.map((result) => (
              <Grid xs={12} key={result.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 },
                    transition: 'box-shadow 0.2s',
                  }}
                  onClick={() => handleResultClick(result)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Description color="primary" sx={{ mt: 0.5 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {result.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {result.snippet}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            المصدر: {result.source}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            التحديث: {result.lastUpdated.toLocaleDateString('ar-QA')}
                          </Typography>
                          <Chip
                            label={`${(result.relevanceScore * 100).toFixed(0)}% تطابق`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        <Box>
                          {result.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ ml: 0.5 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={10}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            sx={{ display: 'flex', justifyContent: 'center' }}
          />
        </>
      )}

      {!loading && results.length === 0 && query && (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              لم يتم العثور على مستندات
            </Typography>
            <Typography variant="body2" color="text.secondary">
              حاول تعديل مصطلحات البحث أو المرشحات
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Documents;
