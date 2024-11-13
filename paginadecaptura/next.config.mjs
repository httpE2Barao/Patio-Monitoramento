export default {
    images: {
      formats: ['image/avif', 'image/webp'], // Formatos modernos para otimização
      deviceSizes: [640, 768, 1024, 1280, 1600], // Tamanhos para diferentes dispositivos
      imageSizes: [16, 32, 48, 64, 96], // Tamanhos fixos para elementos pequenos, como ícones
    },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3333/api/:path*' // URL local para desenvolvimento
            : `${process.env.API_URL}/api/:path*`, // URL de produção definida via variável de ambiente
        },
      ];
    },
  };
  