// MongoDB initialization script
// Run this in MongoDB Compass or MongoDB shell

const db = db.getSiblingDB("hashcoin")

// Create users collection with indexes
db.createCollection("users")
db.users.createIndex({ walletAddress: 1 }, { unique: true })
db.users.createIndex({ referralCode: 1 }, { unique: true })
db.users.createIndex({ hashBalance: -1 })
db.users.createIndex({ tapCount: -1 })
db.users.createIndex({ level: -1 })
db.users.createIndex({ referralCount: -1 })
db.users.createIndex({ createdAt: 1 })

// Create sample data (optional)
db.users.insertMany([
  {
    walletAddress: "0:sample1234567890abcdef",
    username: "HashMaster",
    hashBalance: 15000,
    level: 15,
    tapCount: 5000,
    referralCode: "HASH01",
    referralCount: 10,
    boostsPurchased: {
      fastTap: true,
      multiplier: true,
      autoTap: true,
    },
    isConversionUnlocked: false,
    createdAt: new Date(),
  },
  {
    walletAddress: "0:sample0987654321fedcba",
    username: "CoinTapper",
    hashBalance: 8500,
    level: 8,
    tapCount: 3200,
    referralCode: "HASH02",
    referralCount: 5,
    boostsPurchased: {
      fastTap: true,
    },
    isConversionUnlocked: false,
    createdAt: new Date(),
  },
])

console.log("Hash Coin database initialized successfully!")
