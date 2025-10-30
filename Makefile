build:
	cd frontend && npm ci && npm run build

start:
	HOST=localhost npx start-server -s ./frontend/dist
