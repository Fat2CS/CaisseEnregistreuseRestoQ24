import { Card, CardProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// Définition des props spécifiques pour ColoredCard
interface ColoredCardProps extends CardProps {
  category: "entree" | "plat" | "dessert" | "boisson";
}

// Création d'un composant stylisé avec Material-UI et styled
const ColoredCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "category" // Empêche la transmission de "category" au DOM
})<ColoredCardProps>(({ theme, category }) => ({
  backgroundColor:
    category === "entree"
      ? "#FFD700" // Or pour les entrées
      : category === "plat"
      ? "#FF6347" // Rouge pour les plats
      : category === "dessert"
      ? "#98FB98" // Vert clair pour les desserts
      : category === "boisson"
      ? "#87CEFA" // Bleu clair pour les boissons
      : "#FFFFFF", // Blanc par défaut
  margin: theme.spacing(1), // Utilisation du thème pour les marges
  cursor: "pointer", // Curseur pointeur pour l'interaction
  transition: "transform 0.2s", // Transition douce à l'hover
  "&:hover": {
    transform: "scale(1.05)" // Effet d'agrandissement au survol
  }
}));

export default ColoredCard;
