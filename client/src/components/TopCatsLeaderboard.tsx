import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Stack,
  IconButton,
  Container,
  Paper,
} from "@mui/material";
import { EmojiEvents, Diamond, Close } from "@mui/icons-material";
import usersService, { User } from "../services/usersService";

const TopCatsLeaderboard: React.FC = () => {
  const [top, setTop] = useState<User[]>([]);
  const [lowest, setLowest] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [topUsers, lowestUsers] = await Promise.all([
        usersService.getTopUsers(10),
        usersService.getLowestUsers(3),
      ]);
      setTop(topUsers);
      setLowest(lowestUsers);
    };
    fetchData();
  }, []);

  const getMedalIcon = (position: number) => {
    const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
    return position <= 3 ? (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h6" fontWeight="bold" color="white">
          {position}
        </Typography>{" "}
        <EmojiEvents sx={{ color: colors[position - 1], fontSize: 32 }} />
      </Box>
    ) : (
      <Typography variant="h6" fontWeight="bold" color="white">
        {position}
      </Typography>
    );
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #2D1B4E 0%, #1A0B2E 100%)",
          py: 2,
        }}
      >
        <Card
          sx={{
            bgcolor: "#5B3A8F",
            borderRadius: 4,
            mx: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ position: "relative", mb: 3 }}>
              <Paper
                elevation={8}
                sx={{
                  background:
                    "linear-gradient(135deg, #FF9500 0%, #FF7A00 100%)",
                  borderRadius: 3,
                  py: 2,
                  px: 3,
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <EmojiEvents
                  sx={{
                    position: "absolute",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 48,
                    color: "#FFD700",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                  }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="white"
                  sx={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    mt: 1,
                  }}
                >
                  Top Cats!
                </Typography>
              </Paper>
              <IconButton
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  bgcolor: "#D946EF",
                  color: "white",
                  "&:hover": { bgcolor: "#C026D3" },
                  boxShadow: 3,
                }}
                size="small"
              >
                <Close />
              </IconButton>
            </Box>

            <Stack direction="row" spacing={1} mb={3}>
              {lowest.map((user, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    bgcolor: "rgba(139, 92, 246, 0.5)",
                    borderRadius: 2,
                    p: 1.5,
                    textAlign: "center",
                    border: "2px solid rgba(167, 139, 250, 0.3)",
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#8B5CF6",
                        width: 40,
                        height: 40,
                        border: "2px solid #A78BFA",
                        fontSize: "1.2rem",
                      }}
                      src={user.image_url}
                      alt={user.name}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    color="white"
                    fontWeight="bold"
                    display="block"
                  >
                    {user.name}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="center"
                    mt={0.5}
                  >
                    <Chip
                      icon={<Diamond sx={{ fontSize: 12 }} />}
                      label={user.score}
                      size="small"
                      sx={{
                        bgcolor: "rgba(0, 229, 255, 0.2)",
                        color: "#00E5FF",
                        height: 20,
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 100px",
                bgcolor: "rgba(139, 92, 246, 0.3)",
                borderRadius: 1,
                p: 1,
                mb: 1,
              }}
            >
              <Typography variant="caption" color="white" fontWeight="bold">
                Pos.
              </Typography>
              <Typography variant="caption" color="white" fontWeight="bold">
                Player
              </Typography>
              <Typography
                variant="caption"
                color="white"
                fontWeight="bold"
                textAlign="right"
              >
                Gems Won
              </Typography>
            </Box>

            <Stack spacing={1}>
              {top.map((user) => (
                <Paper
                  key={user.id}
                  elevation={1}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 100px",
                    alignItems: "center",
                    bgcolor: "rgba(139, 92, 246, 0.2)",
                    borderRadius: 2,
                    p: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "rgba(139, 92, 246, 0.4)",
                      transform: "translateX(4px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {getMedalIcon(user.position)}
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "#8B5CF6",
                        width: 40,
                        height: 40,
                        border: "2px solid #A78BFA",
                        fontSize: "1.2rem",
                      }}
                      src={user.image_url}
                      alt={user.name}
                    />
                    <Typography
                      variant="body2"
                      color="white"
                      fontWeight="medium"
                    >
                      {user.name}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Diamond sx={{ color: "#00E5FF", fontSize: 20 }} />
                    <Typography variant="h6" color="#00E5FF" fontWeight="bold">
                      {user.score}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default TopCatsLeaderboard;
