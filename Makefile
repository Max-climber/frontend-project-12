install:
	cd frontend && npm ci

build:
	cd frontend && npm ci && npm run build

start:
	npx @hexlet/chat-server -s ./frontend/dist
