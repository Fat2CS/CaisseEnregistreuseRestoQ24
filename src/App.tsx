import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Assurez-vous d'importer Material-UI
import CssBaseline from "@mui/material/CssBaseline";
import CaisseEnregistreuse from "./CaisseEnregistreuse";

// Création d'un thème personnalisé, si nécessaire
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2" // Couleur primaire par défaut
    },
    secondary: {
      main: "#dc004e" // Couleur secondaire par
    }
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline applique un reset CSS par défaut de Material-UI */}
      <CssBaseline />
      <div className="App">
        <CaisseEnregistreuse />
      </div>
    </ThemeProvider>
  );
};

export default App;
