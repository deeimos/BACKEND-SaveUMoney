export default () => ({
  database: {
      url: process.env.URL_MONGODB,
      name: process.env.DB_NAME,
  }
})