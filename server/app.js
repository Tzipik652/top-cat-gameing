const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require("./routes/users")
app.use(cors()); 
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

