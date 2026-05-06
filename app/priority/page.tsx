"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

const API_URL = "/api/notifications";

const weights = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export default function PriorityPage() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [topN, setTopN] = useState(10);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      setNotifications(response.data.notifications || []);
    } catch (err) {
      console.error(err);
        setError("Server temporarily unavailable");
    } finally {
      setLoading(false);
    }
  }

  function calculatePriority(notification: Notification) {
    const timeScore = new Date(
      notification.Timestamp
    ).getTime();

    return (
      weights[notification.Type] * 1000000000 +
      timeScore
    );
  }

  const priorityNotifications = useMemo(() => {
    return [...notifications]
      .sort(
        (a, b) =>
          calculatePriority(b) -
          calculatePriority(a)
      )
      .slice(0, topN);
  }, [notifications, topN]);

  function getChipColor(type: string) {
    switch (type) {
      case "Placement":
        return "success";

      case "Result":
        return "primary";

      case "Event":
        return "warning";

      default:
        return "default";
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">
            Priority Inbox
          </Typography>

          <Link href="/" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="secondary">
              All Notifications
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h4">
            Top Priority Notifications
          </Typography>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Top N</InputLabel>

            <Select
              value={topN}
              label="Top N"
              onChange={(e) =>
                setTopN(Number(e.target.value))
              }
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 8,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Grid container spacing={3}>
            {priorityNotifications.map((notification) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={notification.ID}
              >
                <Card
                  sx={{
                    borderLeft:
                      notification.Type === "Placement"
                        ? "6px solid green"
                        : notification.Type === "Result"
                        ? "6px solid blue"
                        : "6px solid orange",

                    transition: "0.3s",

                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={notification.Type}
                        color={getChipColor(
                          notification.Type
                        )}
                      />

                      <Chip
                        label="PRIORITY"
                        color="error"
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      gutterBottom
                    >
                      {notification.Message}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {notification.Timestamp}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}