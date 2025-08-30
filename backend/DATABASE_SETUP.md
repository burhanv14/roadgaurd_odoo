# RoadGuard Backend Database Setup

## PostgreSQL Installation on Windows

### Option 1: Download PostgreSQL Installer
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is 5432

### Option 2: Using Chocolatey (if installed)
```cmd
choco install postgresql
```

### Option 3: Using Scoop (if installed)
```cmd
scoop install postgresql
```

## Database Setup

### 1. Connect to PostgreSQL
Open Command Prompt or PowerShell as Administrator and run:

```cmd
# Connect to PostgreSQL (you'll be prompted for password)
psql -U postgres -h localhost

# Or if psql is not in PATH, use full path:
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -h localhost
```

### 2. Create Database
Once connected to PostgreSQL, run these SQL commands:

```sql
-- Create the database
CREATE DATABASE roadguard_db;

-- Create a user for the application (optional, you can use postgres user)
CREATE USER roadguard_user WITH PASSWORD 'roadguard_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE roadguard_db TO roadguard_user;

-- Connect to the new database
\c roadguard_db;

-- Exit PostgreSQL
\q
```

## Environment Configuration

Update the `.env` file with your PostgreSQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=roadguard_db
DB_USER=postgres              # or roadguard_user if you created one
DB_PASSWORD=your_password     # your PostgreSQL password
```

## Starting the Server

1. Make sure PostgreSQL service is running:
   ```cmd
   # Check if PostgreSQL is running
   sc query postgresql-x64-15
   
   # Start PostgreSQL if not running
   net start postgresql-x64-15
   ```

2. Start the RoadGuard backend:
   ```cmd
   npm run dev
   ```

The server will:
- Connect to PostgreSQL
- Create the necessary tables automatically
- Start listening on port 5000

## Testing the Setup

Once the server is running, you can test the health endpoint:

```cmd
curl http://localhost:5000/health
```

Or visit http://localhost:5000/health in your browser.

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL service is running
- Check if port 5432 is available
- Verify credentials in `.env` file
- Check Windows Firewall settings

### Common Errors
- `ECONNREFUSED`: PostgreSQL is not running
- `password authentication failed`: Wrong password in `.env`
- `database "roadguard_db" does not exist`: Create the database first

### PostgreSQL Service Commands
```cmd
# Start PostgreSQL
net start postgresql-x64-15

# Stop PostgreSQL
net stop postgresql-x64-15

# Restart PostgreSQL
net stop postgresql-x64-15 && net start postgresql-x64-15
```
