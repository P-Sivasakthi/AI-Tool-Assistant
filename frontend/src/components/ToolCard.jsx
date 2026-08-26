import {
  AccessTimeRounded,
  CalculateRounded,
  CheckCircleRounded,
  CloudRounded,
  ExpandMoreRounded
} from "@mui/icons-material";
import { Box, Chip, Collapse, IconButton, Typography } from "@mui/material";
import { useState } from "react";

const iconMap = {
  get_weather: <CloudRounded />,
  calculator: <CalculateRounded />,
  get_time: <AccessTimeRounded />
};

export default function ToolCard({ tool, compact = false }) {
  const [open, setOpen] = useState(!compact);

  if (!tool) return null;

  return (
    <Box className={`tool-card ${compact ? "tool-card-compact" : ""}`}>
      <Box className="tool-card-header">
        <Box className="tool-card-icon">
          {iconMap[tool.name] || <SmartFallback />}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography className="tool-card-name">{tool.name}</Typography>
          <Typography className="tool-card-subtitle" noWrap>
            {tool.subtitle}
          </Typography>
        </Box>

        <Chip
          icon={<CheckCircleRounded />}
          label="Success"
          size="small"
          className="success-chip"
        />

        <IconButton size="small" onClick={() => setOpen((v) => !v)}>
          <ExpandMoreRounded
            sx={{
              transform: open ? "rotate(180deg)" : "none",
              transition: "0.2s"
            }}
          />
        </IconButton>
      </Box>

      <Collapse in={open}>
        {!compact && tool.name === "get_weather" && tool.result?.temperature != null ? (
          <WeatherResult result={tool.result} />
        ) : !compact && tool.name === "calculator" ? (
          <CalculatorResult result={tool.result} input={tool.input} />
        ) : !compact && tool.name === "get_time" ? (
          <TimeResult result={tool.result} />
        ) : null}
      </Collapse>
    </Box>
  );
}

function WeatherResult({ result }) {
  return (
    <Box className="weather-result">
      <Box className="weather-illustration">
        <CloudRounded sx={{ fontSize: 56 }} />
      </Box>
      <Box className="weather-temperature">
        <Typography>{result.temperature}°C</Typography>
        <span>{result.condition}</span>
      </Box>
      <Box className="weather-details">
        <span>City</span><strong>{result.city}</strong>
        <span>Feels like</span><strong>37°C</strong>
        <span>Humidity</span><strong>{result.humidity}%</strong>
        <span>Wind</span><strong>{result.wind}</strong>
      </Box>
    </Box>
  );
}

function CalculatorResult({ result, input }) {
  return (
    <Box className="calculator-result">
      <Typography>
        {input?.a} × {input?.b} = <strong>{result}</strong>
      </Typography>
    </Box>
  );
}

function TimeResult({ result }) {
  return (
    <Box className="time-result">
      <AccessTimeRounded />
      <Typography>{result}</Typography>
      <Typography variant="caption">Tokyo, Japan (GMT+09:00)</Typography>
    </Box>
  );
}

function SmartFallback() {
  return <span>⚡</span>;
}