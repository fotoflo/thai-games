import React from "react";
import { useReadThaiGameState } from "../hooks/useReadThaiGameState";
import { Box, Typography, Paper, Grid } from "@mui/material";

const HooksDebugPage: React.FC = () => {
  const gameState = useReadThaiGameState();

  const renderSection = (title: string, data: any) => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hooks Debug Page
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {renderSection("Game Settings", {
            showPronunciation: gameState.showPronunciation,
            showTranslation: gameState.showTranslation,
            cardSource: gameState.cardSource,
          })}
        </Grid>

        <Grid item xs={12}>
          {renderSection("Lesson State", {
            currentLesson: gameState.currentLesson,
            progressionMode: gameState.progressionMode,
            totalLessons: gameState.totalLessons,
          })}
        </Grid>

        <Grid item xs={12}>
          {renderSection("Working Set", {
            workingSet: gameState.workingSet,
            activeVocabItem: gameState.activeVocabItem,
            currentItem: gameState.currentItem,
          })}
        </Grid>

        <Grid item xs={12}>
          {renderSection("Lesson Subset", gameState.lessonSubset)}
        </Grid>

        <Grid item xs={12}>
          {renderSection("Game State", gameState.gameState)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default HooksDebugPage;
