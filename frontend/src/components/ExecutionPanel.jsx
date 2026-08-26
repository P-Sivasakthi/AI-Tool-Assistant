import {
  CloseRounded,
  DeleteOutlineRounded,
  CheckCircleRounded,
  CloudRounded,
  CalculateRounded,
  AccessTimeRounded
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Typography
} from "@mui/material";
import { useState } from "react";

const iconMap = {
  get_weather: <CloudRounded />,
  calculator: <CalculateRounded />,
  get_time: <AccessTimeRounded />
};

export default function ExecutionPanel({
  logs,
  onClose,
  onClear
}) {
  return (
    <Box className="execution-panel">
      <Box className="execution-header">
        <Box className="execution-title-wrap">
          <Box className="execution-main-icon">⌘</Box>
          <Box>
            <Typography className="execution-title">Tool Execution</Typography>
            <Typography className="execution-subtitle">
              View all tool calls and results in this conversation.
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <CloseRounded />
        </IconButton>
      </Box>

      <Box className="execution-content">
        {logs.length === 0 ? (
          <Box className="empty-execution">
            <Typography>No tool calls yet.</Typography>
          </Box>
        ) : (
          logs.map((log, index) => (
            <ExecutionItem
              key={log.id}
              log={log}
              index={index + 1}
            />
          ))
        )}
      </Box>

      <Box className="execution-footer">
        <Button
          fullWidth
          variant="outlined"
          startIcon={<DeleteOutlineRounded />}
          onClick={onClear}
        >
          Clear Execution Log
        </Button>
      </Box>
    </Box>
  );
}

function ExecutionItem({ log, index }) {
  const [open, setOpen] = useState(true);

  return (
    <Box className="execution-item">
      <Box className="timeline-dot">
        <CheckCircleRounded />
      </Box>

      <Box className="execution-card">
        <Box className="execution-card-header">
          <Box className="execution-tool-icon">
            {iconMap[log.name] || "⚡"}
          </Box>
          <Typography className="execution-tool-name">
            {index} {log.name}
          </Typography>
          <Chip label="Success" size="small" className="success-chip" />
          <IconButton size="small" onClick={() => setOpen((v) => !v)}>
            <span style={{ transform: open ? "rotate(180deg)" : "none" }}>⌄</span>
          </IconButton>
        </Box>

        <Collapse in={open}>
          <Typography className="code-label">Input</Typography>
          <pre className="json-block">
            {JSON.stringify(log.input, null, 2)}
          </pre>

          <Typography className="code-label">Result</Typography>
          <pre className="json-block">
            {JSON.stringify(log.result, null, 2)}
          </pre>

          <Box className="execution-meta">
            <span>{log.time}</span>
            <span>{log.duration}</span>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}