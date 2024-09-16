import React, { useState } from "react";
import ColoredCard from "./ColoredCard";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  CardProps,
  IconButton,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Restaurant as RestaurantIcon,
  LocalDining as LocalDiningIcon,
  LocalBar as LocalBarIcon,
  Cake as CakeIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  Print as PrintIcon
} from "@mui/icons-material";

// Types
type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: "entree" | "plat" | "dessert" | "boisson";
  tvaRate: 10 | 20; // TVA rate in percentage
};

type OrderItem = {
  item: MenuItem;
  quantity: number;
};

type Order = {
  items: OrderItem[];
  total: number;
  totalHT: number;
  tva10: number;
  tva20: number;
  tableNumber: number;
  orderNumber: number;
};

// Menu data
const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Entrée + Plat OU Plat + Dessert",
    price: 22,
    category: "plat",
    tvaRate: 10
  },
  {
    id: 2,
    name: "Entrée + Plat + Dessert",
    price: 27,
    category: "plat",
    tvaRate: 10
  },
  { id: 3, name: "Plat seul", price: 18.9, category: "plat", tvaRate: 10 },
  {
    id: 4,
    name: "Noix de Saint Jacques crème lait de coco",
    price: 12,
    category: "entree",
    tvaRate: 10
  },
  {
    id: 5,
    name: "Gaspacho tomate & basilic",
    price: 10,
    category: "entree",
    tvaRate: 10
  },
  {
    id: 6,
    name: "Carpaccio de boeuf & copeaux de parmigiano",
    price: 14,
    category: "entree",
    tvaRate: 10
  },
  {
    id: 7,
    name: "Filet mignon de porc & son jus corsé au thym",
    price: 18,
    category: "plat",
    tvaRate: 10
  },
  {
    id: 8,
    name: "Entrecôte de boeuf (env 200gr) frites, salade",
    price: 22,
    category: "plat",
    tvaRate: 10
  },
  {
    id: 9,
    name: "Poisson du moment, légumes confits au miel & sauce vierge",
    price: 20,
    category: "plat",
    tvaRate: 10
  },
  {
    id: 10,
    name: "Demi Magret de canard coulis de miel",
    price: 21,
    category: "plat",
    tvaRate: 10
  },
  {
    id: 11,
    name: "Panna cotta vanille & son coulis mangue passion",
    price: 8,
    category: "dessert",
    tvaRate: 10
  },
  { id: 12, name: "Dame blanche", price: 7, category: "dessert", tvaRate: 10 },
  {
    id: 13,
    name: "Tarte aux pommes",
    price: 7,
    category: "dessert",
    tvaRate: 10
  },
  {
    id: 14,
    name: "Verre de vin rouge",
    price: 5,
    category: "boisson",
    tvaRate: 20
  },
  {
    id: 15,
    name: "Bouteille d'eau plate",
    price: 3,
    category: "boisson",
    tvaRate: 10
  }
];

const OrderDrawer = styled(Drawer)(({ theme }) => ({
  width: 300,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 300,
    boxSizing: "border-box",
    padding: theme.spacing(2)
  }
}));

const CaisseEnregistreuse: React.FC = () => {
  const [order, setOrder] = useState<Order>({
    items: [],
    total: 0,
    totalHT: 0,
    tva10: 0,
    tva20: 0,
    tableNumber: 1,
    orderNumber: 1
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addToOrder = (item: MenuItem) => {
    const newOrder = { ...order };
    const existingItem = newOrder.items.find((i) => i.item.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newOrder.items.push({ item, quantity: 1 });
    }
    updateOrderTotals(newOrder);
    setOrder(newOrder);
  };

  const removeFromOrder = (itemId: number) => {
    const newOrder = { ...order };
    const itemIndex = newOrder.items.findIndex((i) => i.item.id === itemId);
    if (itemIndex !== -1) {
      if (newOrder.items[itemIndex].quantity > 1) {
        newOrder.items[itemIndex].quantity -= 1;
      } else {
        newOrder.items.splice(itemIndex, 1);
      }
      updateOrderTotals(newOrder);
      setOrder(newOrder);
    }
  };

  const updateOrderTotals = (order: Order) => {
    let total = 0;
    let totalHT = 0;
    let tva10 = 0;
    let tva20 = 0;

    order.items.forEach(({ item, quantity }) => {
      const itemTotal = item.price * quantity;
      total += itemTotal;

      if (item.tvaRate === 10) {
        const itemHT = itemTotal / 1.1;
        totalHT += itemHT;
        tva10 += itemTotal - itemHT;
      } else {
        const itemHT = itemTotal / 1.2;
        totalHT += itemHT;
        tva20 += itemTotal - itemHT;
      }
    });

    order.total = parseFloat(total.toFixed(2));
    order.totalHT = parseFloat(totalHT.toFixed(2));
    order.tva10 = parseFloat(tva10.toFixed(2));
    order.tva20 = parseFloat(tva20.toFixed(2));
  };

  const printTicket = () => {
    const ticket = generateTicketContent();
    console.log("Simulation d'impression:", ticket);
    // Implement actual printing logic here
  };

  const generateTicketContent = (): string => {
    let content = `Restaurant Quai 24\n`;
    content += `Table: ${order.tableNumber} - Commande: ${order.orderNumber}\n\n`;
    order.items.forEach(({ item, quantity }) => {
      content += `${item.name} x ${quantity} : ${(
        item.price * quantity
      ).toFixed(2)}€ (TVA ${item.tvaRate}%)\n`;
    });
    content += `\nTotal HT : ${order.totalHT.toFixed(2)}€\n`;
    content += `TVA 10% : ${order.tva10.toFixed(2)}€\n`;
    content += `TVA 20% : ${order.tva20.toFixed(2)}€\n`;
    content += `Total TTC : ${order.total.toFixed(2)}€\n`;
    return content;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "entree":
        return <RestaurantIcon />;
      case "plat":
        return <LocalDiningIcon />;
      case "dessert":
        return <CakeIcon />;
      case "boisson":
        return <LocalBarIcon />;
      default:
        return <RestaurantIcon />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Quai 24 - Caisse
          </Typography>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <ShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <Grid item xs={6} sm={4} md={3} key={item.id}>
            <ColoredCard
              category={item.category}
              onClick={() => addToOrder(item)}
            >
              <CardContent>
                {getCategoryIcon(item.category)}
                <Typography variant="h6">{item.name}</Typography>
                <Typography>
                  {item.price.toFixed(2)}€ (TVA {item.tvaRate}%)
                </Typography>
              </CardContent>
            </ColoredCard>
          </Grid>
        ))}
      </Grid>
      <OrderDrawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Typography variant="h6">Commande en cours</Typography>
        <TextField
          label="Numéro de table"
          type="number"
          value={order.tableNumber}
          onChange={(e) =>
            setOrder({ ...order, tableNumber: parseInt(e.target.value) })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Numéro de commande"
          type="number"
          value={order.orderNumber}
          onChange={(e) =>
            setOrder({ ...order, orderNumber: parseInt(e.target.value) })
          }
          fullWidth
          margin="normal"
        />
        <List>
          {order.items.map(({ item, quantity }) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={item.name}
                secondary={`${quantity} x ${item.price.toFixed(2)}€ = ${(
                  quantity * item.price
                ).toFixed(2)}€ (TVA ${item.tvaRate}%)`}
              />
              <IconButton onClick={() => removeFromOrder(item.id)}>
                <RemoveIcon />
              </IconButton>
              <IconButton onClick={() => addToOrder(item)}>
                <AddIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Typography>Total HT : {order.totalHT.toFixed(2)}€</Typography>
        <Typography>TVA 10% : {order.tva10.toFixed(2)}€</Typography>
        <Typography>TVA 20% : {order.tva20.toFixed(2)}€</Typography>
        <Typography variant="h6">
          Total TTC : {order.total.toFixed(2)}€
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={printTicket}
          fullWidth
        >
          Imprimer le ticket
        </Button>
      </OrderDrawer>
    </Box>
  );
};

export default CaisseEnregistreuse;
