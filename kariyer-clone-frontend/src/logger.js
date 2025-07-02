// logger.js
// Basit frontend logging servisi

const logger = {
  info: (msg, data) => {
    console.info('[INFO]', msg, data || '');
    // Burada harici servise de gönderebilirsiniz
  },
  warn: (msg, data) => {
    console.warn('[WARN]', msg, data || '');
    // Burada harici servise de gönderebilirsiniz
  },
  error: (msg, data) => {
    console.error('[ERROR]', msg, data || '');
    // Burada harici servise de gönderebilirsiniz
  }
};

export default logger; 