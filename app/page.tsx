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
  Pagination,
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

export default function HomePage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchNotifications();
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

  function markAsViewed(id: string) {
    const viewed = JSON.parse(
      localStorage.getItem("viewedNotifications") || "[]"
    );

    if (!viewed.includes(id)) {
      viewed.push(id);
      localStorage.setItem(
        "viewedNotifications",
        JSON.stringify(viewed)
      );
    }
  }

  function isViewed(id: string) {
    const viewed = JSON.parse(
      localStorage.getItem("viewedNotifications") || "[]"
    );

    return viewed.includes(id);
  }

  const filteredNotifications = useMemo(() => {
    if (filter === "All") return notifications;

    return notifications.filter(
      (notification) => notification.Type === filter
    );
  }, [notifications, filter]);

  const paginatedNotifications = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;

    return filteredNotifications.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredNotifications, page]);

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
            Campus Notifications
          </Typography>

          <Link href="/priority" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="secondary">
              Priority Inbox
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
            All Notifications
          </Typography>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter</InputLabel>

            <Select
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Placement">
                Placement
              </MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
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
          <>
            <Grid container spacing={3}>
              {paginatedNotifications.map((notification) => {
                const viewed = isViewed(notification.ID);

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={notification.ID}
                  >
                    <Card
                      onClick={() =>
                        markAsViewed(notification.ID)
                      }
                      sx={{
                        cursor: "pointer",
                        borderLeft: viewed
                          ? "4px solid gray"
                          : "4px solid #1976d2",
                        opacity: viewed ? 0.7 : 1,
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

                          {!viewed && (
                            <Chip
                              label="NEW"
                              color="error"
                            />
                          )}
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
                );
              })}
            </Grid>

            <Box
              sx={{
                mt: 5,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination
                count={Math.ceil(
                  filteredNotifications.length /
                    ITEMS_PER_PAGE
                )}
                page={page}
                onChange={(_, value) =>
                  setPage(value)
                }
                color="primary"
              />
            </Box>
          </>
        )}
      </Container>
    </>
  );
}