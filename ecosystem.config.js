module.exports = {
  apps: [
    {
      name: 'image-service',
      script: 'dist/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
    },
  ],
}
