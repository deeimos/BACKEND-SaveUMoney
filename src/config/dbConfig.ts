interface IdbConfig {
  url: string;
  name: string;
}

export default (): { database: IdbConfig } => ({
  database: {
    url: process.env.URL_MONGODB || '',
    name: process.env.DB_NAME || '',
  }
})