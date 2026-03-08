# Node.js Server Setup (Express + MongoDB)

## Step 1: Install Required Libraries

Run the following command in your terminal:

```bash
npm install express mongodb cors
```

---

## Step 2: Create `.env` File

Create a file named **.env** in your project root directory and add the following:

```env
MONGODB_URL=<Paste your MongoDB URL here>
PORT=<Enter your custom port>
```

### Example

```env
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/
PORT=3000
```

---

## Step 3: Create `start.js`

Create a file named **start.js** and paste the following code:

```javascript
const app = require("./index.js");

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```

---

## Step 4: Run the Server

Run the following command to start the server using the `.env` file:

```bash
node --env-file=.env start.js
```

---

## Security Tip

Never upload your `.env` file to GitHub.
Add `.env` to your `.gitignore` file:

```
.env
node_modules
```
