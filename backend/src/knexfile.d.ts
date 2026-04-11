declare module '../knexfile' {
  const config: {
    [key: string]: {
      client: string;
      connection: {
        filename: string;
      };
      useNullAsDefault?: boolean;
      migrations?: {
        directory: string;
      };
      seeds?: {
        directory: string;
      };
    };
  };
  export default config;
}
