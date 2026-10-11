/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [{ source: "/servicios", destination: "/mentoria", permanent: false }]
  },
}

export default nextConfig
