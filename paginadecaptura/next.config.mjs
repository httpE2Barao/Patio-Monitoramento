export default {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3333/api/:path*', // Adapte para produção conforme necessário
            },
        ];
    },
};