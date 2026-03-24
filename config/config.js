const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  try {
    require('dotenv').config();
    return;
  } catch (error) {
    // Continua com o fallback abaixo quando dotenv nao estiver instalado.
  }

  try {
    const envPath = path.resolve(__dirname, '../.env');
    const envContent = fs.readFileSync(envPath, 'utf8');

    envContent.split(/\r?\n/).forEach(line => {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return;
      }

      const separatorIndex = trimmedLine.indexOf('=');

      if (separatorIndex === -1) {
        return;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
      const normalizedValue = rawValue.replace(/^['"]|['"]$/g, '');

      if (key && process.env[key] === undefined) {
        process.env[key] = normalizedValue;
      }
    });
  } catch (error) {
    // Mantem os fallbacks padrao se o arquivo .env nao existir.
  }
}

loadEnvFile();

const baseConfig = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_DATABASE || 'database_development',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  dialectModulePath: require.resolve('mysql2')
};

module.exports = {
  development: {
    ...baseConfig
  },
  test: {
    ...baseConfig,
    database: process.env.DB_DATABASE_TEST || process.env.DB_DATABASE || 'database_test'
  },
  production: {
    ...baseConfig,
    database: process.env.DB_DATABASE_PRODUCTION || process.env.DB_DATABASE || 'database_production'
  }
};
