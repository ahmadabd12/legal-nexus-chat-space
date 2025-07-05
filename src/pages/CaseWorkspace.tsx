import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Description,
  AccountTree,
  Visibility,
  Psychology,
  Summarize,
  Article,
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";

import { useParams } from "react-router-dom";
import { useCase } from "../contexts/CaseContext";
import { useChat } from "../hooks/useChat";
import { useGraph } from "../hooks/useGraph";

const drawerWidth = 400;

const CaseWorkspace: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerTab, setDrawerTab] = useState(0);
  const [message, setMessage] = useState("");
  const [showContext, setShowContext] = useState(false);

  const { loadCase, currentCase } = useCase();
  const { messages, send, loading: chatLoading } = useChat();
  const { loadGraph, graphData, loading: graphLoading } = useGraph();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (caseId) {
      loadCase(caseId);
    }
  }, [caseId, loadCase]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await send(message);
      setMessage("");
    }
  };

  const handleQuickAction = async (action: string) => {
    const quickMessages = {
      summarize: "Please summarize the key points from the current section.",
      suggest: "What related articles or cases should I review?",
      reasoning: "Can you show me the reasoning chain for your last response?",
    };

    if (quickMessages[action as keyof typeof quickMessages]) {
      await send(quickMessages[action as keyof typeof quickMessages]);
    }
  };

  const renderDrawerContent = () => {
    switch (drawerTab) {
      case 0: // Documents
        return (
          <Box sx={{ p: 2 }} dir="rtl">
            <Typography variant="h6" gutterBottom>
              مستندات القضية
            </Typography>
            <List>
              {currentCase?.documents.map((doc, index) => (
                <ListItem key={index} divider>
                  <Description sx={{ mr: 2 }} />
                  <ListItemText
                    primary={doc}
                    secondary="Click to view with highlights"
                    //secondary="انقر لعرض المحتوى مع التمييزات"
                  />
                </ListItem>
              ))}
            </List>
            {currentCase?.documents.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                لم يتم إرفاق أي مستندات بهذه القضية بعد.
              </Typography>
            )}
          </Box>
        );

      case 1: // Graph
        return (
          <Box sx={{ p: 2 }} dir="ltr">
            <Typography variant="h6" gutterBottom>
              Knowledge Graph
            </Typography>
            {graphLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress />
              </Box>
            ) : graphData ? (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Nodes ({graphData.nodes.length})
                </Typography>
                {graphData.nodes.map((node) => (
                  <Chip
                    key={node.id}
                    label={node.label}
                    variant="outlined"
                    size="small"
                    sx={{ m: 0.25 }}
                    color={node.type === "statute" ? "primary" : "default"}
                  />
                ))}
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Relationships ({graphData.edges.length})
                </Typography>
                {graphData.edges.map((edge) => (
                  <Typography key={edge.id} variant="caption" display="block">
                    {edge.source} → {edge.relationship} → {edge.target}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No graph data available. Start a conversation to generate
                insights.
              </Typography>
            )}
            <Button
              variant="outlined"
              startIcon={<AccountTree />}
              onClick={() => loadGraph("sample")}
              sx={{ mt: 2 }}
              disabled={graphLoading}
            >
              Load Graph
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderMessage = (msg: any) => {
    return (
      <Card
        key={msg.id}
        sx={{
          mb: 2,
          alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
          maxWidth: "80%",
          minHeight: "fit-content",
          bgcolor: msg.type === "user" ? "primary.main" : "background.paper",
          color: msg.type === "user" ? "primary.contrastText" : "text.primary",
        }}
      >
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography variant="body2">{msg.content}</Typography>
          {msg.metadata && (
            <Box sx={{ mt: 1 }}>
              {msg.metadata.sources && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" display="block">
                    Sources:
                  </Typography>
                  {msg.metadata.sources.map((source: string, idx: number) => (
                    <Chip
                      key={idx}
                      label={source}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5, fontSize: "0.7rem" }}
                    />
                  ))}
                </Box>
              )}
              {msg.metadata.graphNodes && (
                <Box>
                  <Typography variant="caption" display="block">
                    Related Concepts:
                  </Typography>
                  {msg.metadata.graphNodes.map((node: string, idx: number) => (
                    <Chip
                      key={idx}
                      label={node}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5, fontSize: "0.7rem" }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              color: msg.type === "user" ? "#ffffff" : "black",
              mt: 1,
              fontSize: 10,
              fontWeight: "bold",
              display: "block",
              textAlign: msg.type === "user" ? "right" : "left",
            }}
          >
            {msg.timestamp.toLocaleTimeString()}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  if (!currentCase) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }} dir="rtl">
      {/* Collapsible Drawer */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            position: "relative",
            height: "100%",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          <Tabs
            value={drawerTab}
            onChange={(_, newValue) => setDrawerTab(newValue)}
            sx={{ flexGrow: 1 }}
          >
            <Tab icon={<Description />} label="المستندات" />
            <Tab icon={<AccountTree />} label="Graph" />
          </Tabs>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <ChevronRight />
          </IconButton>
        </Box>
        <Divider />
        {renderDrawerContent()}
      </Drawer>

      {/* Main Chat Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          filter: isMobile && drawerOpen ? "blur(1px)" : "none",
          opacity: isMobile && drawerOpen ? 0.5 : 1,
          pointerEvents: isMobile && drawerOpen ? "none" : "auto",
          transition: "all 0.3s ease",
        }}
        dir="ltr"
      >
        {/* Header */}
        <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
          {/* {!drawerOpen && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <ChevronLeft />
            </IconButton>
          )} */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              textAlign: "right",
            }}
            dir="rtl"
          >
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              القضية: {currentCase.title}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => setShowContext(!showContext)}
              sx={{ flexDirection: "row-reverse", height: "fit-content" }}
            >
              السياق
            </Button>
          </Box>
          {!drawerOpen && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <ChevronLeft />
            </IconButton>
          )}
        </Paper>

        {/* Messages */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map(renderMessage)}
          {chatLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>

        {/* Quick Actions */}
        <Paper sx={{ p: 2, borderTop: 1, borderColor: "divider" }} dir="rtl">
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Button
              size="small"
              startIcon={<Summarize />}
              onClick={() => handleQuickAction("summarize")}
              sx={{ flexDirection: "row-reverse" }}
            >
              لخّص
            </Button>
            <Button
              size="small"
              startIcon={<Article />}
              onClick={() => handleQuickAction("suggest")}
              sx={{ flexDirection: "row-reverse" }}
            >
              اقترح مقالات
            </Button>
            <Button
              size="small"
              startIcon={<Psychology />}
              onClick={() => handleQuickAction("reasoning")}
              sx={{ flexDirection: "row-reverse" }}
            >
              اعرض المنطق
            </Button>
          </Box>

          {/* Input Area */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="اطرح سؤالًا قانونيًا..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              multiline
              maxRows={3}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!message.trim() || chatLoading}
              sx={{ minWidth: 64 }}
            >
              <Send sx={{ transform: "rotate(180deg)" }} />
            </Button>
          </Box>
        </Paper>

        {/* Context Panel */}
        {showContext && (
          <Paper
            sx={{
              p: 2,
              maxHeight: 200,
              overflow: "auto",
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Raw Context & Insights
            </Typography>
            <Typography variant="caption" color="text.secondary">
              This panel would show retrieved law excerpts and graph insights in
              a real implementation.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default CaseWorkspace;
