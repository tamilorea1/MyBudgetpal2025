# Step 1: Use Node 20 Alpine
FROM node:20-alpine

# NEW STEP: Install libc6-compat for Next.js compiler compatibility
RUN apk add --no-cache libc6-compat

# Step 2: Create a folder inside the virtual container for our app
WORKDIR /app

# Step 3: Copy the package files first
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of your project files
COPY . .

# Step 6: Build the Next.js app
RUN npx prisma generate
RUN npm run build

# Step 7: Tell the container to start the app on port 3000
EXPOSE 3000
CMD ["npm", "start"]