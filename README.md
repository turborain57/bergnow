# Clone and setup
git clone https://github.com/turborain57/bergnow.git
cd bergnow

# Create .env file
echo "OPENWEATHER_API_KEY=your_api_key" > .env

# Run with Docker Compose
docker-compose up -d

# Access
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
