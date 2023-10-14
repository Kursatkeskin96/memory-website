import { withAuth } from "next-auth/middleware"

export default withAuth({

})

export const config = { matcher: [  '/blog/:path*', '/galeri/:path*', '/kelime/:path*', '/panel/:path*'] }