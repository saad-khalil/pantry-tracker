'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { firestore } from '/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'


export default function Home() {

  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    // @ts-ignore
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  const [filterText, setFilterText] = useState('')

  const filterInventory = (inventory) => {
    return inventory.filter(item => item.name.toLowerCase().includes(filterText.toLowerCase()))
  }


  // We'll add our component logic here

  return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Inventory Management
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
              fullWidth
              variant="outlined"
              label="Filter Items"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                ),
              }}
          />
        </Box>

        <Grid container spacing={3}>
          {filterInventory(inventory).map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.name}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {item.name}
                    </Typography>
                    <Typography color="textSecondary">
                      Quantity: {item.quantity}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => addItem(item.name)}>
                      Add
                    </Button>
                    <Button size="small" color="secondary" onClick={() => removeItem(item.name)}>
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
          ))}
        </Grid>

        <Fab
            color="primary"
            aria-label="add"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={handleOpen}
        >
          <AddIcon />
        </Fab>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Item Name"
                fullWidth
                variant="outlined"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
}