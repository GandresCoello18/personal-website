/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/servicios", destination: "/mentoria", permanent: false },
      {
        source: "/blog/developer-and-cto",
        destination: "/blog/de-desarrollador-a-lider-tecnico",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
